<?php
namespace Models;
use Vendor\DB;

class Supplier {
    public function getSuppliers() {
        $sql = "SELECT * FROM `supplier`";
        $arg = NULL;
        return DB::select($sql, $arg);
    }
    
    public function getSupplier($sid) {
        $sql = "SELECT * FROM `supplier` WHERE `sid`=?";
        $arg = array($sid);
        return DB::select($sql, $arg);
    }
    
    public function newSupplier($s_name, $contact, $tel, $address) {
        // 檢查必填欄位
        if(empty($s_name)) {
            return array('status' => 400, 'message' => "供應商名稱不可為空");
        }

        if(empty($address)) {
            return array('status' => 400, 'message' => "供應商地址不可為空");
        }

        // 先檢查地址是否已存在
        $checkSql = "SELECT COUNT(*) AS count FROM `supplier` WHERE `address` = ?";
        $checkResult = DB::select($checkSql, array($address));
        
        // 如果已存在相同地址，回傳錯誤訊息
        if ($checkResult['result'][0]['count'] > 0) {
            return array('status' => 409, 'message' => "地址「" . $address . "」已經存在，請使用其他地址");
        }
        
        // 如果不存在相同地址，則進行新增
        $sql = "INSERT INTO `supplier` (`s_name`, `contact`, `tel`, `address`) VALUES (?, ?, ?, ?)";
        return DB::insert($sql, array($s_name, $contact, $tel, $address));
    }
    
    public function removeSupplier($sid) {
        $sql = "DELETE FROM `supplier` WHERE `sid`=?";
        return DB::delete($sql, array($sid));
    }
    
    public function updateSupplier($sid, $s_name, $contact, $tel, $address) {
        // 檢查必填欄位
        if(empty($s_name)) {
            return array('status' => 400, 'message' => "供應商名稱不可為空");
        }

        if(empty($address)) {
            return array('status' => 400, 'message' => "供應商地址不可為空");
        }
        
        // 先檢查地址是否已存在且不是當前供應商
        $checkSql = "SELECT COUNT(*) AS count FROM `supplier` WHERE `address` = ? AND `sid` != ?";
        $checkResult = DB::select($checkSql, array($address, $sid));
        
        // 如果已存在，回傳錯誤訊息
        if ($checkResult['result'][0]['count'] > 0) {
            return array('status' => 409, 'message' => "地址「" . $address . "」已經存在，請使用其他地址");
        }
        
        // 如果通過所有檢查，則進行更新
        $sql = "UPDATE `supplier` SET `s_name`=?, `contact`=?, `tel`=?, `address`=? WHERE sid=?";
        return DB::update($sql, array($s_name, $contact, $tel, $address, $sid));
    }
}
?>