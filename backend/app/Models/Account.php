<?php
namespace Models;
use Vendor\DB;

class Account {
    // 權限控管 - 取得使用者角色
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

    // 檢查帳號是否已存在
    public function checkAccountCodeExists($account_code) {
        $sql = "SELECT `account_id` FROM `account` WHERE `account_code`=?";
        return DB::select($sql, array($account_code));
    }

    // 檢查電子郵件是否已存在
    public function checkEmailExists($email) {
        $sql = "SELECT `account_id` FROM `account` WHERE `email`=?";
        return DB::select($sql, array($email));
    }

    // 插入新帳戶
    public function insertAccount($account_code, $email, $password, $fullName, $addr, $birth, $roleId) {
        $sql = "INSERT INTO `account` (`account_code`, `email`, `password`, `full_name`, `addr`, `birth`, `role_id`) VALUES (?, ?, ?, ?, ?, ?, ?)";
        return DB::insert($sql, array($account_code, $email, $password, $fullName, $addr, $birth, $roleId));
    }

    // 獲取最新帳戶ID（根據email）
    public function getAccountIdByEmail($email) {
        $sql = "SELECT account_id FROM `account` WHERE email = ? ORDER BY account_id DESC LIMIT 1";
        return DB::select($sql, array($email));
    }

    // 插入使用者角色關聯
    public function insertUserRole($accountId, $roleId) {
        $sql = "INSERT INTO `user_role` (`account_id`, `role_id`) VALUES (?, ?)";
        return DB::insert($sql, array($accountId, $roleId));
    }

    // 為使用者建立購物車
    public function createShoppingCart($accountId) {
        $sql = "INSERT INTO `shopping_cart` (`account_id`, `status`) VALUES (?, 'active')";
        return DB::insert($sql, array($accountId));
    }

    // 檢查帳戶是否存在（用於完整性驗證）
    public function verifyAccountExists($accountId) {
        $sql = "SELECT account_id FROM `account` WHERE `account_id` = ?";
        return DB::select($sql, array($accountId));
    }

    // 檢查使用者角色關聯是否存在（用於完整性驗證）
    public function verifyUserRoleExists($accountId, $roleId) {
        $sql = "SELECT id FROM `user_role` WHERE `account_id` = ? AND `role_id` = ?";
        return DB::select($sql, array($accountId, $roleId));
    }

    // 刪除帳戶
    public function deleteAccount($accountId) {
        $sql = "DELETE FROM `account` WHERE `account_id`=?";
        return DB::delete($sql, array($accountId));
    }

    // 刪除使用者角色關聯（清理用）
    public function deleteUserRole($accountId) {
        $sql = "DELETE FROM `user_role` WHERE `account_id` = ?";
        return DB::delete($sql, array($accountId));
    }

    // 刪除購物車（清理用）
    public function deleteShoppingCart($accountId) {
        $sql = "DELETE FROM `shopping_cart` WHERE `account_id` = ?";
        return DB::delete($sql, array($accountId));
    }

    // 更新帳戶資訊（包含密碼）
    public function updateAccountWithPassword($accountId, $fullName, $addr, $birth, $password) {
        $sql = "UPDATE `account` SET `full_name`=?, `addr`=?, `birth`=?, `password`=? WHERE account_id=?";
        return DB::update($sql, array($fullName, $addr, $birth, $password, $accountId));
    }

    // 更新帳戶資訊（不包含密碼）
    public function updateAccountWithoutPassword($accountId, $fullName, $addr, $birth) {
        $sql = "UPDATE `account` SET `full_name`=?, `addr`=?, `birth`=? WHERE account_id=?";
        return DB::update($sql, array($fullName, $addr, $birth, $accountId));
    }
}
?>