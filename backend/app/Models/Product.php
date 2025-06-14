<?php
    namespace Models;
    use Vendor\DB;

    class Product{
        // 加入權限控管
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
        
        public function getProducts(){
            $sql = "SELECT  *  FROM  `product`";
            $arg = NULL;
            return DB::select($sql, $arg);
        }
        
        public function getProduct($pid){
            $sql = "SELECT  *  FROM  `product` WHERE `product_id`=?";
            $arg = array($pid);
            return DB::select($sql, $arg);
        }
        
        public function newProduct($p_name, $price, $stock, $category, $imageUrl){
            // 檢查必填欄位
            if(empty($p_name)) {
                return array('status' => 400, 'message' => "產品名稱不可為空");
            }
            
            if(!is_numeric($price) || $price <= 0) {
                return array('status' => 400, 'message' => "產品價格必須大於零");
            }
            
            if(!is_numeric($stock) || $stock < 0) {
                return array('status' => 400, 'message' => "庫存數量不可為負數");
            }
            
            // 檢查產品名稱是否已存在
            $checkSql = "SELECT COUNT(*) AS count FROM `product` WHERE `name` = ?";
            $checkResult = DB::select($checkSql, array($p_name));
            
            // 如果已存在同名產品，回傳錯誤訊息
            if ($checkResult['result'][0]['count'] > 0) {
                return array('status' => 409, 'message' => "產品名稱「" . $p_name . "」已經存在");
            }
            
            // 如果不存在同名產品，則進行新增
            $sql = "INSERT INTO `product` (`name`, `price`, `stock`, `category`, `image_url`) VALUES (?, ?, ?, ?, ?)";
            return DB::insert($sql, array($p_name, $price, $stock, $category, $imageUrl));
        }
        
        public function removeProduct($pid){
            // 檢查商品是否存在
            $checkProductSql = "SELECT COUNT(*) AS count FROM `product` WHERE `product_id` = ?";
            $checkProductResult = DB::select($checkProductSql, array($pid));
            
            if ($checkProductResult['status'] !== 200) {
                return array('status' => 500, 'message' => '資料庫查詢錯誤');
            }
            
            if ($checkProductResult['result'][0]['count'] === 0) {
                return array('status' => 404, 'message' => '商品不存在');
            }
            
            // 檢查商品是否被訂單引用
            $checkOrderSql = "SELECT COUNT(*) AS count FROM `order_detail` WHERE `product_id` = ?";
            $checkOrderResult = DB::select($checkOrderSql, array($pid));
            
            if ($checkOrderResult['status'] !== 200) {
                return array('status' => 500, 'message' => '資料庫查詢錯誤');
            }
            
            if ($checkOrderResult['result'][0]['count'] > 0) {
                return array('status' => 409, 'message' => '無法刪除商品，該商品已被訂單引用');
            }
            
            // 檢查商品是否在購物車中被引用
            $checkCartSql = "SELECT COUNT(*) AS count FROM `cart_items` WHERE `product_id` = ?";
            $checkCartResult = DB::select($checkCartSql, array($pid));
            
            if ($checkCartResult['status'] !== 200) {
                return array('status' => 500, 'message' => '資料庫查詢錯誤');
            }
            
            if ($checkCartResult['result'][0]['count'] > 0) {
                // 購物車項目會因為 ON DELETE CASCADE 自動刪除，所以這裡只是提醒
                // 可以選擇警告或直接繼續刪除
            }
            
            // 執行刪除
            $sql = "DELETE FROM `product` WHERE product_id=?";
            return DB::delete($sql, array($pid));
        }
        
        public function updateProduct($pid, $p_name, $price, $stock, $category, $imageUrl){
            // 檢查必填欄位
            if(empty($p_name)) {
                return array('status' => 400, 'message' => "產品名稱不可為空");
            }
            
            if(!is_numeric($price) || $price <= 0) {
                return array('status' => 400, 'message' => "產品價格必須大於零");
            }
            
            if(!is_numeric($stock) || $stock < 0) {
                return array('status' => 400, 'message' => "庫存數量不可為負數");
            }
            
            // 檢查產品名稱是否已存在且不是當前產品
            $checkSql = "SELECT COUNT(*) AS count FROM `product` WHERE `name` = ? AND `product_id` != ?";
            $checkResult = DB::select($checkSql, array($p_name, $pid));
            
            // 如果已存在同名產品，回傳錯誤訊息
            if ($checkResult['result'][0]['count'] > 0) {
                return array('status' => 409, 'message' => "產品名稱「" . $p_name . "」已經存在");
            }
            
            // 根據是否有新的 imageUrl 來決定 SQL 語句
            if ($imageUrl !== null) {
                // 如果有新圖片，則更新 image_url 欄位
                $sql = "UPDATE `product` SET `name`=?, `price`=?, `stock`=?, `category`=?, `image_url`=? WHERE `product_id`=?";
                $params = array($p_name, $price, $stock, $category, $imageUrl, $pid);
            } else {
                // 如果沒有新圖片，則不更新 image_url 欄位
                $sql = "UPDATE `product` SET `name`=?, `price`=?, `stock`=?, `category`=? WHERE `product_id`=?";
                $params = array($p_name, $price, $stock, $category, $pid);
            }
            
            // 如果通過所有檢查，則進行更新
            return DB::update($sql, $params);
        }
    }
?>