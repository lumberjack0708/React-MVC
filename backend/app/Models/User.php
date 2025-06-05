<?php
namespace app\Models;
use vendor\DB;

class User {
    public function getUsers() {
        $sql = "SELECT * FROM `user`";
        $arg = NULL;
        return DB::select($sql, $arg);
    }
    
    public function getUser($uid) {
        $sql = "SELECT * FROM `user` WHERE `id`=?";
        $arg = array($uid);
        return DB::select($sql, $arg);
    }
    
    public function newUser($password, $name, $addr, $bir) {
        // 檢查必填欄位
        if(empty($name)) {
            return array('status' => 400, 'message' => "使用者名稱不可為空");
        }

        // 如果不存在相同電子郵件，則進行新增
        $sql = "INSERT INTO `user` (`password`, `name`, `addr`, `birth`) VALUES (?, ?, ?, ?)";
        return DB::insert($sql, array($password, $name, $addr, $bir));
    }
    
    public function removeUser($uid) {
        $sql = "DELETE FROM `user` WHERE `id`=?";
        return DB::delete($sql, array($uid));
    }
    
    public function updateUser($uid, $name, $addr, $bir, $password) {
        // 檢查必填欄位
        if(empty($name)) {
            return array('status' => 400, 'message' => "使用者名稱不可為空");
        }
        
        // 如果通過所有檢查，則進行更新
        $sql = "UPDATE `user` SET `password`=?, `name`=?, `addr`=?, `birth`=? WHERE id=?";
        return DB::update($sql, array($password, $name, $addr, $bir, $uid));
    }
}
?>