<?php
namespace app\Models;
use vendor\DB;

class Employee{
    public function getUsers(){
        $sql = "SELECT  *  FROM  `user`";
        $arg = NULL;
        return DB::select($sql, $arg);
    }
    public function getUser($id){
        $sql = "SELECT  *  FROM  `user` WHERE `id`=?";
        $arg = array($id);
        return DB::select($sql, $arg);
    }
    public function newUser($name, $password, $JoinDate, $address, $email, $phone){
        $sql = "INSERT INTO `user` (`name`, `password`, `JoinDate`, `address` , `email`, `phone`) VALUES (?, ?, ?, ?, ?, ?)";
        return DB::insert($sql, array($name, $password, $JoinDate,$address, $email, $phone));
    }
    public function removeUser($id){
        $sql = "DELETE FROM `user` WHERE id=?";
        return DB::delete($sql, array($id));
    }
    public function updateUser($id, $name, $password, $JoinDate, $address, $email, $phone){
        $sql = "UPDATE `user` SET `name`=?, `password`=?, `JoinDate`=?, `address`=?, `email`=?, `phone`=? WHERE `id`=?";
        return DB::update($sql, array($name, $password, $JoinDate,$address, $email, $phone, $id));
    }
}
?>