<?php
    namespace app\Models;
    use vendor\DB;

    class Order{
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
        
        // 顧客端：獲取該帳號的訂單統計資料
        public function getOrderStatistics($account_id){
            // 總訂單數
            $totalOrdersSql = "SELECT COUNT(*) AS total_orders FROM orders WHERE account_id = ?";
            $totalOrdersResult = DB::select($totalOrdersSql, array($account_id));
            $totalOrders = $totalOrdersResult['result'][0]['total_orders'] ?? 0;
            
            // 已取消訂單數
            $cancelledOrdersSql = "SELECT COUNT(*) AS cancelled_orders FROM orders WHERE account_id = ? AND status = 'cancelled'";
            $cancelledOrdersResult = DB::select($cancelledOrdersSql, array($account_id));
            $cancelledOrders = $cancelledOrdersResult['result'][0]['cancelled_orders'] ?? 0;
            
            // 實際購買金額（排除已取消訂單）
            $totalAmountSql = "SELECT 
                                COALESCE(SUM(od.quantity * p.price), 0) AS total_amount
                               FROM orders o
                               JOIN order_detail od ON o.order_id = od.order_id
                               JOIN product p ON od.product_id = p.product_id
                               WHERE o.account_id = ? AND o.status != 'cancelled'";
            $totalAmountResult = DB::select($totalAmountSql, array($account_id));
            $totalAmount = $totalAmountResult['result'][0]['total_amount'] ?? 0;
            
            // 購買商品種類數（排除已取消訂單）
            $totalItemsSql = "SELECT 
                               COALESCE(SUM(item_count), 0) AS total_items
                              FROM (
                                SELECT COUNT(od.product_id) AS item_count
                                FROM orders o
                                JOIN order_detail od ON o.order_id = od.order_id
                                WHERE o.account_id = ? AND o.status != 'cancelled'
                                GROUP BY o.order_id
                              ) AS order_items";
            $totalItemsResult = DB::select($totalItemsSql, array($account_id));
            $totalItems = $totalItemsResult['result'][0]['total_items'] ?? 0;
            
            return array(
                'status' => 200,
                'result' => array(
                    'total_orders' => intval($totalOrders),             # 總訂單數
                    'cancelled_orders' => intval($cancelledOrders),     # 已取消訂單數
                    'total_amount' => intval($totalAmount),             # 實際購買金額
                    'total_items' => intval($totalItems)                # 購買商品種類數
                )
            );
        }
        
        public function newOrder($account_id, $products_id, $quantity){
            // 檢查必要參數
            if (empty($account_id) || !is_numeric($account_id)) {
                return array('status' => 400, 'message' => "無效的帳號ID");
            }
            
            // 確保 products_id 和 quantity 是陣列，不然count()會出錯
            if (!is_array($products_id)) {
                $products_id = array($products_id);
            }
            
            if (!is_array($quantity)) {
                $quantity = array($quantity);
            }
            
            try {
                // 先檢查所有產品庫存是否足夠
                for ($i = 0; $i < count($products_id); $i++) {
                    $checkStockSql = "SELECT `stock`, `name` FROM `product` WHERE `product_id` = ?";
                    $checkStockResult = DB::select($checkStockSql, array($products_id[$i]));
                    
                    // 檢查產品是否存在
                    if ($checkStockResult['status'] != 200 || empty($checkStockResult['result'])) {
                        return array('status' => 404, 'message' => "找不到產品ID: " . $products_id[$i]);
                    }
                    
                    // 檢查庫存是否足夠
                    $currentStock = $checkStockResult['result'][0]['stock'];
                    $productName = $checkStockResult['result'][0]['name'];
                    
                    if ($currentStock < $quantity[$i]) {
                        return array(
                            'status' => 400, 
                            'message' => "產品「" . $productName . "」庫存不足，目前僅剩 " . $currentStock . " 件，但您要購買 " . $quantity[$i] . " 件"
                        );
                    }
                }
                
                // 庫存檢查通過後，建立訂單主表
                $sql = "INSERT INTO `orders` (`account_id`, `order_time`, `status`) VALUES (?, NOW(), 'pending')";
                $result = DB::insert($sql, array($account_id));
                
                if ($result['status'] != 200) {
                    return $result;
                }
                
                // 查詢剛建立的訂單ID (使用MAX獲取最新的訂單ID)
                $getIdSql = "SELECT MAX(order_id) as latest_id FROM `orders` WHERE `account_id` = ?";
                $getIdResult = DB::select($getIdSql, array($account_id));
                
                if ($getIdResult['status'] != 200 || empty($getIdResult['result'])) {
                    return array('status' => 500, 'message' => "無法獲取訂單ID");
                }
                
                $orderId = $getIdResult['result'][0]['latest_id'];
                
                // 處理多個產品的情況
                for ($i = 0; $i < count($products_id); $i++) {
                    // 建立訂單詳細表
                    $detailSql = "INSERT INTO `order_detail` (`order_id`, `product_id`, `quantity`) VALUES (?, ?, ?)";
                    $detailResult = DB::insert($detailSql, array($orderId, $products_id[$i], $quantity[$i]));
                    
                    if ($detailResult['status'] != 200) {
                        return $detailResult;
                    }
                    
                    // 更新產品庫存
                    $updateSql = "UPDATE `product` SET `stock` = `stock` - ? WHERE `product_id` = ?";
                    $updateResult = DB::update($updateSql, array($quantity[$i], $products_id[$i]));
                    
                    if ($updateResult['status'] != 200) {
                        return $updateResult;
                    }
                }
                
                return array('status' => 200, 'message' => "訂單建立成功", 'order_id' => $orderId);
                
            } catch (\Throwable $th) {
                return array('status' => 500, 'message' => "訂單建立失敗：" . $th->getMessage());
            }
        }
        
        public function removeOrder($order_id, $account_id){
            // 1. 訂單存在性檢查
            $orderSql = "SELECT * FROM `orders` WHERE `order_id` = ?";
            $orderResult = DB::select($orderSql, array($order_id));

            if ($orderResult['status'] != 200 || empty($orderResult['result'])) {
                return array('status' => 404, 'message' => "找不到訂單編號：" . $order_id);
            }
            $order = $orderResult['result'][0];

            // 2. 訂單狀態檢查
            if (in_array($order['status'], ['shipped', 'cancelled'])) {
                return array('status' => 400, 'message' => "無法取消狀態為「" . $order['status'] . "」的訂單");
            }

            // 3. 權限檢查
            $accountSql = "SELECT `role_id` FROM `account` WHERE `account_id` = ?";
            $accountResult = DB::select($accountSql, array($account_id));

            if ($accountResult['status'] != 200 || empty($accountResult['result'])) {
                return array('status' => 403, 'message' => "權限不足，無法取消此訂單");
            }

            $userRole = $accountResult['result'][0]['role_id'];
            $is_admin = ($userRole == 1); //  role_id = 1 是管理員
            $is_owner = ($order['account_id'] == $account_id);

            if (!$is_admin && !$is_owner) {
                return array('status' => 403, 'message' => "權限不足，無法取消此訂單");
            }
            
            try {
                // 4. 庫存回滾
                // 4.1 查詢訂單詳細表
                $detailSql = "SELECT `product_id`, `quantity` FROM `order_detail` WHERE `order_id` = ?";
                $detailResult = DB::select($detailSql, array($order_id));
                
                if ($detailResult['status'] == 200 && !empty($detailResult['result'])) {
                    // 4.2 庫存回滾
                    foreach($detailResult['result'] as $item) {
                        $updateStockSql = "UPDATE `product` SET `stock` = `stock` + ? WHERE `product_id` = ?";
                        $updateResult = DB::update($updateStockSql, array($item['quantity'], $item['product_id']));
                        if ($updateResult['status'] != 200) {
                            return array('status' => 500, 'message' => '庫存還原失敗，請聯繫管理員處理訂單 #' . $order_id);
                        }
                    }
                }

                // 5. 訂單狀態更新
                $updateOrderSql = "UPDATE `orders` SET `status` = 'cancelled' WHERE `order_id` = ?";
                $updateOrderResult = DB::update($updateOrderSql, array($order_id));

                if ($updateOrderResult['status'] != 200) {
                    return $updateOrderResult;
                }

                return array('status' => 200, 'message' => "訂單 #" . $order_id . " 已成功取消");

            } catch (\Throwable $th) {
                return array('status' => 500, 'message' => "取消訂單時發生錯誤：" . $th->getMessage());
            }
        }
        
        // 更新訂單狀態
        public function updateOrderStatus($orderId, $status){
            // 檢查訂單是否存在
            $checkSql = "SELECT COUNT(*) AS count FROM `orders` WHERE `order_id` = ?";
            $checkResult = DB::select($checkSql, array($orderId));
            
            // 如果訂單不存在，回傳錯誤訊息
            if ($checkResult['result'][0]['count'] == 0) {
                return array('status' => 404, 'message' => "找不到訂單編號：" . $orderId);
            }
            
            // 檢查狀態值是否有效 (假設有效狀態為：pending(待處理), processing(處理中), shipped(已出貨), cancelled(已取消))
            $validStatus = array('pending', 'processing', 'shipped', 'cancelled');
            if (!in_array($status, $validStatus)) {
                return array('status' => 400, 'message' => "無效的訂單狀態，有效狀態為：pending, processing, shipped, cancelled");
            }
            
            // 更新訂單狀態
            $sql = "UPDATE `orders` SET `status` = ? WHERE `order_id` = ?";
            $result = DB::update($sql, array($status, $orderId));
            
            // 如果更新成功，回傳成功訊息
            if ($result['status'] == 200) {
                return array('status' => 200, 'message' => "訂單狀態已更新為：" . $status);
            } else {
                return $result; // 回傳資料庫操作的錯誤訊息
            }
        }
    }
?>