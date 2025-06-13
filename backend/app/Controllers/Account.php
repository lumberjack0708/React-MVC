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
        
        return $this->am->newAccount($account_code, $email, $password, $fullName, $addr, $birth);
    }
    
    public function removeUser(){
        $accountId = $_POST['uid'];
        return $this->am->removeAccount($accountId);
    }
    
    public function updateUser(){
        $accountId = $_POST['uid'];
        $fullName = $_POST['name'];
        $addr = $_POST['addr'];
        $birth = $_POST['bir'];
        $password = isset($_POST['password']) ? $_POST['password'] : null;
        
        return $this->am->updateAccount($accountId, $fullName, $addr, $birth, $password);
    }
}
?>