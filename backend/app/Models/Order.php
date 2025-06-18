<?php
    namespace Models;
    use Vendor\DB;

    class Order{
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

        // 店家端：若沒有挾帶`account_id`，則先顯示訂單總覽
        public function getOrders(){
            $sql = "SELECT 
                        o.order_id        AS `訂單編號`,
                        o.order_time      AS `訂單時間`,
                        a.account_code    AS `帳號號碼(唯一)`,
                        a.email           AS `用戶email`,
                        SUM(od.quantity * p.price) AS `訂單總金額`,
                        o.status          AS `訂單狀態`
                    FROM orders o
                    JOIN order_detail od  
                        ON o.order_id = od.order_id
                    JOIN account a 
                        ON o.account_id = a.account_id
                    JOIN product p 
                        ON od.product_id = p.product_id
                    GROUP BY o.order_id, o.order_time, a.account_code, a.email
                    ORDER BY o.order_time DESC;";
            $arg = NULL;
            return DB::select($sql, $arg);
        }

        // 店家端：從【預覽】點進來之後可以看詳細訂單內容
        public function getOrderDetail($order_id){
            $sql = "SELECT
                        o.order_id        AS `訂單編號`,
                        o.order_time      AS `訂單時間`,
                        a.account_code    AS `帳號號碼(唯一)`,
                        a.email           AS `用戶email`,
                        p.name            AS `產品名稱`,
                        od.quantity       AS `訂購數量`,
                        p.price           AS `單價`,
                        (od.quantity * p.price) AS `小計`
                    FROM orders o
                    JOIN order_detail od
                        ON o.order_id = od.order_id
                    JOIN account a
                        ON o.account_id = a.account_id
                    JOIN product p
                        ON od.product_id = p.product_id
                    WHERE o.order_id = ?;";
            $arg = array($order_id);
            return DB::select($sql, $arg);
        }
        
        // 顧客端：若有挾帶`account_id`，則回傳該帳號的訂單總覽
        public function getOrder($account_id){
            $sql = "SELECT 
                        o.order_id        AS `訂單編號`,
                        o.order_time      AS `訂單時間`,
                        SUM(od.quantity * p.price) AS `訂單總金額`,
                        o.status          AS `訂單狀態`,
                        COUNT(od.product_id) AS `商品種類數量`
                    FROM orders o
                    JOIN order_detail od  
                        ON o.order_id = od.order_id
                    JOIN product p 
                        ON od.product_id = p.product_id
                    WHERE o.account_id = ?
                    GROUP BY o.order_id, o.order_time, o.status
                    ORDER BY o.order_time DESC;";
            $arg = array($account_id);
            return DB::select($sql, $arg);
        }
        
        // 顧客端：獲取該帳號的訂單詳細記錄（原本的 getOrder 邏輯）
        public function getOrderDetails($account_id){
            $sql = "SELECT
                        od.order_id         AS `訂單編號`,
                        p.name              AS `產品名稱`,
                        od.quantity         AS `訂購數量`,
                        p.price             AS `單價`,
                        (od.quantity * p.price) AS `小計`,
                        o.order_time        AS `訂單時間`,
                        o.status			AS `訂單狀態`
                    FROM order_detail od
                    JOIN product p ON od.product_id = p.product_id
                    JOIN orders o ON od.order_id = o.order_id
                    WHERE o.account_id = ?
                    ORDER BY o.order_time DESC;";
            $arg = array($account_id);
            return DB::select($sql, $arg);
        }
        
        // 取得總訂單數
        public function getTotalOrdersCount($accountId){
            $sql = "SELECT COUNT(*) AS total_orders FROM orders WHERE account_id = ?";
            return DB::select($sql, array($accountId));
        }
        
        // 取得已取消訂單數
        public function getCancelledOrdersCount($accountId){
            $sql = "SELECT COUNT(*) AS cancelled_orders FROM orders WHERE account_id = ? AND status = 'cancelled'";
            return DB::select($sql, array($accountId));
        }
        
        // 取得實際購買金額（排除已取消訂單）
        public function getTotalPurchaseAmount($accountId){
            $sql = "SELECT 
                        COALESCE(SUM(od.quantity * p.price), 0) AS total_amount
                        FROM orders o
                        JOIN order_detail od ON o.order_id = od.order_id
                        JOIN product p ON od.product_id = p.product_id
                        WHERE o.account_id = ? AND o.status != 'cancelled'";
            return DB::select($sql, array($accountId));
        }
        
        // 取得購買商品種類數（排除已取消訂單）
        public function getTotalItemsCount($accountId){
            $sql = "SELECT 
                        COALESCE(SUM(item_count), 0) AS total_items
                        FROM (
                        SELECT COUNT(od.product_id) AS item_count
                        FROM orders o
                        JOIN order_detail od ON o.order_id = od.order_id
                        WHERE o.account_id = ? AND o.status != 'cancelled'
                        GROUP BY o.order_id
                        ) AS order_items";
            return DB::select($sql, array($accountId));
        }
        
        // 檢查商品庫存和狀態
        public function checkProductStock($productId){
            $sql = "SELECT `stock`, `name` FROM `product` WHERE `product_id` = ? AND `p_status` = 'active'";
            return DB::select($sql, array($productId));
        }
        
        // 建立訂單主表
        public function createOrder($accountId){
            $sql = "INSERT INTO `orders` (`account_id`, `order_time`, `status`) VALUES (?, NOW(), 'pending')";
            return DB::insert($sql, array($accountId));
        }
        
        // 取得最新的訂單ID
        public function getLatestOrderId($accountId){
            $sql = "SELECT MAX(order_id) as latest_id FROM `orders` WHERE `account_id` = ?";
            return DB::select($sql, array($accountId));
        }
        
        // 建立訂單詳細項目
        public function createOrderDetail($orderId, $productId, $quantity){
            $sql = "INSERT INTO `order_detail` (`order_id`, `product_id`, `quantity`) VALUES (?, ?, ?)";
            return DB::insert($sql, array($orderId, $productId, $quantity));
        }
        
        // 更新產品庫存
        public function updateProductStock($productId, $quantity){
            $sql = "UPDATE `product` SET `stock` = `stock` - ? WHERE `product_id` = ?";
            return DB::update($sql, array($quantity, $productId));
        }
        
        // 取得訂單資訊
        public function getOrderById($orderId){
            $sql = "SELECT * FROM `orders` WHERE `order_id` = ?";
            return DB::select($sql, array($orderId));
        }
        
        // 取得用戶角色
        public function getUserRole($accountId){
            $sql = "SELECT `role_id` FROM `account` WHERE `account_id` = ?";
            return DB::select($sql, array($accountId));
        }
        
        // 取得訂單詳細項目
        public function getOrderDetailItems($orderId){
            $sql = "SELECT `product_id`, `quantity` FROM `order_detail` WHERE `order_id` = ?";
            return DB::select($sql, array($orderId));
        }
        
        // 回滾產品庫存
        public function restoreProductStock($productId, $quantity){
            $sql = "UPDATE `product` SET `stock` = `stock` + ? WHERE `product_id` = ?";
            return DB::update($sql, array($quantity, $productId));
        }
        
        // 更新訂單狀態為取消
        public function cancelOrder($orderId){
            $sql = "UPDATE `orders` SET `status` = 'cancelled' WHERE `order_id` = ?";
            return DB::update($sql, array($orderId));
        }
        
        // 檢查訂單是否存在
        public function checkOrderExists($orderId){
            $sql = "SELECT COUNT(*) AS count FROM `orders` WHERE `order_id` = ?";
            return DB::select($sql, array($orderId));
        }
        
        // 更新訂單狀態
        public function updateOrderStatus($orderId, $status){
            $sql = "UPDATE `orders` SET `status` = ? WHERE `order_id` = ?";
            return DB::update($sql, array($status, $orderId));
        }
    }
?>