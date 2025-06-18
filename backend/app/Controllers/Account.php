<?php
namespace Controllers;
use Vendor\Controller;
use Models\Account as AccountModel;

class Account extends Controller
{
    private $am;
    
    public function __construct() {
        $this->am = new AccountModel();
    }
    
    public function getUsers(){
        if (isset($_POST['uid'])) {
            $accountId = $_POST['uid'];
            return $this->am->getAccounts($accountId);
        } else {
            return $this->am->getAccounts();
        }
    }
    
    public function getUser(){
        return $this->getUsers();
    }
    
    public function newUser(){
        // 必要參數檢查
        if (!isset($_POST['account_code']) || empty($_POST['account_code'])) {
            return array('status' => 400, 'message' => '帳號為必填欄位');
        }
        
        if (!isset($_POST['email']) || empty($_POST['email'])) {
            return array('status' => 400, 'message' => '電子郵件為必填欄位');
        }
        
        if (!isset($_POST['password']) || empty($_POST['password'])) {
            return array('status' => 400, 'message' => '密碼為必填欄位');
        }
        
        if (!isset($_POST['name']) || empty($_POST['name'])) {
            return array('status' => 400, 'message' => '姓名為必填欄位');
        }
        
        // 帳號格式驗證
        if (strlen($_POST['account_code']) < 3 || strlen($_POST['account_code']) > 10) {
            return array('status' => 400, 'message' => '帳號長度必須在3-10個字元之間');
        }
        
        // 帳號只能包含英文字母和數字
        if (!preg_match('/^[a-zA-Z0-9]+$/', $_POST['account_code'])) {
            return array('status' => 400, 'message' => '帳號只能包含英文字母和數字');
        }
        
        // Email 格式驗證
        if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
            return array('status' => 400, 'message' => '請輸入有效的電子郵件格式');
        }
        
        // 密碼強度驗證
        if (strlen($_POST['password']) < 6) {
            return array('status' => 400, 'message' => '密碼長度至少需要6個字元');
        }
        
        $account_code = $_POST['account_code'];
        $email = $_POST['email'];
        $password = $_POST['password'];
        $fullName = $_POST['name'];
        $addr = $_POST['addr'] ?? null;     // 使用 null coalescing operator
        $birth = $_POST['bir'] ?? null;     // 使用 null coalescing operator
        
        return $this->createNewAccount($account_code, $email, $password, $fullName, $addr, $birth);
    }
    
    // 建立新帳戶業務邏輯 (註冊)
    // 預設註冊的新帳戶是顧客，管理者需要由後台設定
    private function createNewAccount($account_code, $email, $password, $fullName, $addr = null, $birth = null, $roleId = 2) {
        try {
            // 檢查帳號是否已存在
            $accountExists = $this->am->checkAccountCodeExists($account_code);
            if ($accountExists['status'] === 200 && !empty($accountExists['result'])) {
                return array('status' => 409, 'message' => "此帳號已被註冊");
            }

            // 檢查電子郵件是否已存在
            $emailExists = $this->am->checkEmailExists($email);
            if ($emailExists['status'] === 200 && !empty($emailExists['result'])) {
                return array('status' => 409, 'message' => "此電子郵件已被註冊");
            }

            // 密碼處理 (之後可能可以改加密處理)
            $hashedPassword = $password;

            // 插入用戶資料
            $insertResult = $this->am->insertAccount($account_code, $email, $hashedPassword, $fullName, $addr, $birth, $roleId);
            
            if ($insertResult['status'] !== 200) {
                return array('status' => 500, 'message' => "用戶註冊失敗");
            }

            // 獲取新建立的用戶 ID
            $newAccountId = $insertResult['insert_id'] ?? null;
            if (!$newAccountId) {
                // 如果無法獲取 insert_id，查詢最新建立的帳戶
                $idResult = $this->am->getAccountIdByEmail($email);
                if ($idResult['status'] === 200 && !empty($idResult['result'])) {
                    $newAccountId = $idResult['result'][0]['account_id'];
                } else {
                    return array('status' => 500, 'message' => "無法獲取新用戶ID");
                }
            }

            // 在 user_role 表中建立角色關聯
            $roleResult = $this->am->insertUserRole($newAccountId, $roleId);
            
            if ($roleResult['status'] !== 200) {
                // 角色關聯失敗，使用輔助方法清理資料
                $cleanupSuccess = $this->cleanupFailedRegistration($newAccountId, "角色關聯建立失敗");
                
                if (!$cleanupSuccess) {
                    return array('status' => 500, 'message' => "註冊失敗且清理失敗，請聯繫管理員處理");
                }
                
                return array('status' => 500, 'message' => "註冊失敗：無法建立用戶角色關聯，請稍後重試");
            }

            // 為新用戶建立購物車
            $cartResult = $this->am->createShoppingCart($newAccountId);
            
            if ($cartResult['status'] !== 200) {
                error_log("Warning: 用戶 {$newAccountId} 的購物車建立失敗，但註冊仍然成功");
                // 購物車失敗不影響註冊成功，用戶首次加入商品時會自動建立
            }

            // 最終驗證註冊完整性
            $integrity = $this->validateRegistrationIntegrity($newAccountId, $roleId);
            if (!$integrity['valid']) {
                error_log("註冊完整性驗證失敗：用戶 {$newAccountId}，原因：{$integrity['reason']}");
                // 雖然可能有問題，但不影響用戶使用，只記錄 log
            }

            return array(
                'status' => 200, 
                'message' => "註冊成功", 
                'account_id' => $newAccountId,
                'account_code' => $account_code,
                'email' => $email,
                'full_name' => $fullName
            );

        } catch (\Throwable $th) {
            return array('status' => 500, 'message' => "註冊過程中發生錯誤：" . $th->getMessage());
        }
    }
    
    // 輔助方法：清理註冊失敗的資料
    private function cleanupFailedRegistration($accountId, $reason) {
        error_log("開始清理失敗註冊資料，用戶 ID: {$accountId}，原因: {$reason}");
        
        // 清理 user_role 表
        $roleCleanupResult = $this->am->deleteUserRole($accountId);
        
        // 清理 shopping_cart 表
        $cartCleanupResult = $this->am->deleteShoppingCart($accountId);
        
        // 清理 account 表
        $accountCleanupResult = $this->am->deleteAccount($accountId);
        
        if ($accountCleanupResult['status'] !== 200) {
            error_log("Critical: 無法清理帳戶資料 {$accountId}，需要手動處理");
            return false;
        }
        
        error_log("註冊失敗清理完成，用戶 ID: {$accountId}");
        return true;
    }
    
    // 輔助方法：驗證註冊完整性
    private function validateRegistrationIntegrity($accountId, $roleId) {
        // 檢查帳戶是否存在
        $accountResult = $this->am->verifyAccountExists($accountId);
        
        if ($accountResult['status'] !== 200 || empty($accountResult['result'])) {
            return array('valid' => false, 'reason' => '帳戶不存在');
        }
        
        // 檢查角色關聯是否存在
        $roleResult = $this->am->verifyUserRoleExists($accountId, $roleId);
        
        if ($roleResult['status'] !== 200 || empty($roleResult['result'])) {
            return array('valid' => false, 'reason' => '角色關聯不存在');
        }
        
        return array('valid' => true, 'reason' => '驗證通過');
    }
    
    public function removeUser(){
        $accountId = $_POST['uid'];
        return $this->am->deleteAccount($accountId);
    }
    
    public function updateUser(){
        $accountId = $_POST['uid'];
        $fullName = $_POST['name'];
        $addr = $_POST['addr'];
        $birth = $_POST['bir'];
        $password = isset($_POST['password']) ? $_POST['password'] : null;
        
        return $this->updateAccountInfo($accountId, $fullName, $addr, $birth, $password);
    }
    
    // 更新帳戶資訊業務邏輯
    private function updateAccountInfo($accountId, $fullName, $addr, $birth, $password = null) {
        // 姓名驗證
        if(empty($fullName)) {
            return array('status' => 400, 'message' => "姓名不可為空");
        }
        
        // 如果提供了密碼，則更新密碼
        if (!empty($password)) {
            // 密碼強度驗證
            if (strlen($password) < 6) {
                return array('status' => 400, 'message' => '密碼長度至少需要6個字元');
            }
            
            return $this->am->updateAccountWithPassword($accountId, $fullName, $addr, $birth, $password);
        } else {
            // 否則，不更新密碼
            return $this->am->updateAccountWithoutPassword($accountId, $fullName, $addr, $birth);
        }
    }
}
?>