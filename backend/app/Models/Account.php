<?php
namespace Models;
use Vendor\DB;

class Account {
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
    
    // 建立新帳戶
    public function newAccount($email, $password, $fullName, $addr, $birth, $roleId = 2) { // 預設為 customer
        if(empty($email) || empty($password) || empty($fullName)) {
            return array('status' => 400, 'message' => "電子郵件、密碼和姓名為必填欄位");
        }

        // 檢查電子郵件是否已存在
        $sql_check_email = "SELECT `account_id` FROM `account` WHERE `email`=?";
        $email_exists = DB::select($sql_check_email, array($email));
        if ($email_exists['status'] === 200 && !empty($email_exists['result'])) {
            return array('status' => 409, 'message' => "此電子郵件已被註冊");
        }

        // 自動生成新的 account_code
        $sql_max_code = "SELECT MAX(account_code) AS max_code FROM `account` WHERE role_id = ?";
        $result = DB::select($sql_max_code, array($roleId));

        $newCode = 'C001'; // 如果沒有客戶時的預設值
        if ($result['status'] === 200 && !empty($result['result'][0]['max_code'])) {
            $maxCode = $result['result'][0]['max_code'];
            $numericPart = (int)substr($maxCode, 1);
            $newNumericPart = $numericPart + 1;
            $newCode = 'C' . str_pad($newNumericPart, 3, '0', STR_PAD_LEFT);
        }

        $sql_insert = "INSERT INTO `account` (`account_code`, `email`, `password`, `full_name`, `addr`, `birth`, `role_id`) VALUES (?, ?, ?, ?, ?, ?, ?)";
        return DB::insert($sql_insert, array($newCode, $email, $password, $fullName, $addr, $birth, $roleId));
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