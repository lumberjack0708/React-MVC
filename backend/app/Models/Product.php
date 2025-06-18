<?php
    namespace Models;
    use Vendor\DB;

    class Product{
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
        
        // 取得上架中的商品
        public function getProducts(){
            $sql = "SELECT  *  FROM  `product` WHERE `p_status` = 'active'";
            $arg = NULL;
            return DB::select($sql, $arg);
        }

        // 取得所有商品(包含下架)
        public function getAllProducts(){
            $sql = "SELECT  *  FROM  `product`";
            $arg = NULL;
            return DB::select($sql, $arg);
        }
        
        // 取得單一商品
        public function getProduct($pid){
            $sql = "SELECT  *  FROM  `product` WHERE `product_id`=? AND `p_status` = 'active'";
            $arg = array($pid);
            return DB::select($sql, $arg);
        }

        // 檢查產品名稱是否已存在
        public function checkProductNameExists($p_name) {
            $sql = "SELECT COUNT(*) AS count FROM `product` WHERE `name` = ?";
            return DB::select($sql, array($p_name));
        }

        // 檢查產品名稱是否已存在且不是當前產品
        public function checkProductNameExistsExcludingCurrent($p_name, $pid) {
            $sql = "SELECT COUNT(*) AS count FROM `product` WHERE `name` = ? AND `product_id` != ?";
            return DB::select($sql, array($p_name, $pid));
        }

        // 插入新產品
        public function insertProduct($p_name, $price, $stock, $category, $imageUrl, $p_status) {
            $sql = "INSERT INTO `product` (`name`, `price`, `stock`, `category`, `image_url`, `p_status`) VALUES (?, ?, ?, ?, ?, ?)";
            return DB::insert($sql, array($p_name, $price, $stock, $category, $imageUrl, $p_status));
        }

        // 檢查商品是否存在
        public function checkProductExists($pid) {
            $sql = "SELECT COUNT(*) AS count FROM `product` WHERE `product_id` = ?";
            return DB::select($sql, array($pid));
        }

        // 檢查商品是否被訂單引用
        public function checkProductInOrders($pid) {
            $sql = "SELECT COUNT(*) AS count FROM `order_detail` WHERE `product_id` = ?";
            return DB::select($sql, array($pid));
        }

        // 檢查商品是否在購物車中被引用
        public function checkProductInCart($pid) {
            $sql = "SELECT COUNT(*) AS count FROM `cart_items` WHERE `product_id` = ?";
            return DB::select($sql, array($pid));
        }

        // 刪除產品
        public function deleteProduct($pid) {
            $sql = "DELETE FROM `product` WHERE product_id=?";
            return DB::delete($sql, array($pid));
        }

        // 更新產品（包含圖片）
        public function updateProductWithImage($pid, $p_name, $price, $stock, $category, $imageUrl, $p_status) {
            $sql = "UPDATE `product` SET `name`=?, `price`=?, `stock`=?, `category`=?, `image_url`=?, `p_status`=? WHERE `product_id`=?";
            return DB::update($sql, array($p_name, $price, $stock, $category, $imageUrl, $p_status, $pid));
        }

        // 更新產品（不包含圖片）
        public function updateProductWithoutImage($pid, $p_name, $price, $stock, $category, $p_status) {
            $sql = "UPDATE `product` SET `name`=?, `price`=?, `stock`=?, `category`=?, `p_status`=? WHERE `product_id`=?";
            return DB::update($sql, array($p_name, $price, $stock, $category, $p_status, $pid));
        }
    }
?>