<?php
namespace Models;
use Vendor\DB;

class Account {
    // 加入權限控管 - 完全照ProductModel的模式
    public function getRoles($id){
        $sql = "SELECT role_id FROM user_role WHERE account_id = ?";
        $arg = array($id);
        $response = DB::select($sql, $arg);
        $result = $response['result'];
        for ($i=0; $i < count($result); $i++) { 
            $result[$i] = $result[$i]['role_id'];    
        }
        $response['result'] = $result;
        return $response;    
    }

    // 獲取所有或單一帳戶資訊
    public function getAccounts($accountId = null) {
        if ($accountId !== null) {
            $sql = "SELECT account_id, role_id, email, full_name, addr, birth FROM `account` WHERE `account_id`=?";
            $arg = array($accountId);
        } else {
            $sql = "SELECT account_id, role_id, email, full_name, addr, birth FROM `account`";
            $arg = NULL;
        }
        return DB::select($sql, $arg);
    }
    
    // 建立新帳戶 (註冊)
    // 預設註冊的新帳戶是顧客，管理者需要由後台設定
    public function newAccount($account_code, $email, $password, $fullName, $addr = null, $birth = null, $roleId = 2) {
        try {
            // 基本資料驗證 (Controller 已驗證，但還是再做一次)
            if(empty($account_code) || empty($email) || empty($password) || empty($fullName)) {
                return array('status' => 400, 'message' => "帳號、電子郵件、密碼和姓名為必填欄位");
            }

            // 檢查帳號是否已存在
            $sqlCheckAccount = "SELECT `account_id` FROM `account` WHERE `account_code`=?";
            $accountExists = DB::select($sqlCheckAccount, array($account_code));
            if ($accountExists['status'] === 200 && !empty($accountExists['result'])) {
                return array('status' => 409, 'message' => "此帳號已被註冊");
            }

            // 檢查電子郵件是否已存在
            $sqlCheckEmail = "SELECT `account_id` FROM `account` WHERE `email`=?";
            $emailExists = DB::select($sqlCheckEmail, array($email));
            if ($emailExists['status'] === 200 && !empty($emailExists['result'])) {
                return array('status' => 409, 'message' => "此電子郵件已被註冊");
            }

            // 密碼處理 (之後可能可以改加密處理)
            $hashedPassword = $password;

            // 插入用戶資料
            $sqlInsert = "INSERT INTO `account` (`account_code`, `email`, `password`, `full_name`, `addr`, `birth`, `role_id`) VALUES (?, ?, ?, ?, ?, ?, ?)";
            $insertResult = DB::insert($sqlInsert, array($account_code, $email, $hashedPassword, $fullName, $addr, $birth, $roleId));
            
            if ($insertResult['status'] !== 200) {
                return array('status' => 500, 'message' => "用戶註冊失敗");
            }

            // 獲取新建立的用戶 ID
            $newAccountId = $insertResult['insert_id'] ?? null;
            if (!$newAccountId) {
                // 如果無法獲取 insert_id，查詢最新建立的帳戶
                $sqlGetId = "SELECT account_id FROM `account` WHERE email = ? ORDER BY account_id DESC LIMIT 1";
                $idResult = DB::select($sqlGetId, array($email));
                if ($idResult['status'] === 200 && !empty($idResult['result'])) {
                    $newAccountId = $idResult['result'][0]['account_id'];
                } else {
                    return array('status' => 500, 'message' => "無法獲取新用戶ID");
                }
            }

            // 在 user_role 表中建立角色關聯
            $sqlInsertRole = "INSERT INTO `user_role` (`account_id`, `role_id`) VALUES (?, ?)";
            $roleResult = DB::insert($sqlInsertRole, array($newAccountId, $roleId));
            
            if ($roleResult['status'] !== 200) {
                // 角色關聯失敗，使用輔助方法清理資料
                $cleanupSuccess = $this->cleanupFailedRegistration($newAccountId, "角色關聯建立失敗");
                
                if (!$cleanupSuccess) {
                    return array('status' => 500, 'message' => "註冊失敗且清理失敗，請聯繫管理員處理");
                }
                
                return array('status' => 500, 'message' => "註冊失敗：無法建立用戶角色關聯，請稍後重試");
            }

            // 為新用戶建立購物車
            $sqlCreateCart = "INSERT INTO `shopping_cart` (`account_id`, `status`) VALUES (?, 'active')";
            $cartResult = DB::insert($sqlCreateCart, array($newAccountId));
            
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
        $cleanupRoleSql = "DELETE FROM `user_role` WHERE `account_id` = ?";
        $roleCleanupResult = DB::delete($cleanupRoleSql, array($accountId));
        
        // 清理 shopping_cart 表
        $cleanupCartSql = "DELETE FROM `shopping_cart` WHERE `account_id` = ?";
        $cartCleanupResult = DB::delete($cleanupCartSql, array($accountId));
        
        // 清理 account 表
        $cleanupAccountSql = "DELETE FROM `account` WHERE `account_id` = ?";
        $accountCleanupResult = DB::delete($cleanupAccountSql, array($accountId));
        
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
        $accountCheck = "SELECT account_id FROM `account` WHERE `account_id` = ?";
        $accountResult = DB::select($accountCheck, array($accountId));
        
        if ($accountResult['status'] !== 200 || empty($accountResult['result'])) {
            return array('valid' => false, 'reason' => '帳戶不存在');
        }
        
        // 檢查角色關聯是否存在
        $roleCheck = "SELECT id FROM `user_role` WHERE `account_id` = ? AND `role_id` = ?";
        $roleResult = DB::select($roleCheck, array($accountId, $roleId));
        
        if ($roleResult['status'] !== 200 || empty($roleResult['result'])) {
            return array('valid' => false, 'reason' => '角色關聯不存在');
        }
        
        return array('valid' => true, 'reason' => '驗證通過');
    }
    
    // 刪除帳戶
    public function removeAccount($accountId) {
        $sql = "DELETE FROM `account` WHERE `account_id`=?";
        return DB::delete($sql, array($accountId));
    }
    
    // 更新帳戶資訊
    public function updateAccount($accountId, $fullName, $addr, $birth, $password = null) {
        if(empty($fullName)) {
            return array('status' => 400, 'message' => "姓名不可為空");
        }
        
        // 如果提供了密碼，則更新密碼
        if (!empty($password)) {
            $sql = "UPDATE `account` SET `full_name`=?, `addr`=?, `birth`=?, `password`=? WHERE account_id=?";
            return DB::update($sql, array($fullName, $addr, $birth, $password, $accountId));
        } else {
            // 否則，不更新密碼
            $sql = "UPDATE `account` SET `full_name`=?, `addr`=?, `birth`=? WHERE account_id=?";
            return DB::update($sql, array($fullName, $addr, $birth, $accountId));
        }
    }
}
?>