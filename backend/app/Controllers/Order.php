<?php
namespace Controllers;
use Vendor\DB;
use Vendor\Controller;
use Models\Order as OrderModel;

class Order extends Controller
{
    private $om; 
    
    public function __construct() {
        $this->om = new OrderModel();
    }
    

    

    public function getOrders(){
        if (isset($_POST['account_id'])) {
            $account_id = $_POST['account_id'];
            return $this->om->getOrder($account_id);
        } else {
            return $this->om->getOrders(); 
        }
    }

    public function getOrder(){
        return $this->getOrders();
    }

    public function getOrderDetail(){
        if (!isset($_POST['order_id'])) {
            return array('status' => 400, 'message' => '缺少必要參數：order_id');
        }
        $orderId = $_POST['order_id'];
        return $this->om->getOrderDetail($orderId);
    }
    
    public function getOrderStatistics(){
        if (!isset($_POST['account_id'])) {
            return array('status' => 400, 'message' => '缺少必要參數：account_id');
        }
        $accountId = $_POST['account_id'];
        
        // 取得總訂單數
        $totalOrdersResult = $this->om->getTotalOrdersCount($accountId);
        $totalOrders = ($totalOrdersResult['status'] === 200 && !empty($totalOrdersResult['result'])) 
                      ? $totalOrdersResult['result'][0]['total_orders'] : 0;
        
        // 取得已取消訂單數
        $cancelledOrdersResult = $this->om->getCancelledOrdersCount($accountId);
        $cancelledOrders = ($cancelledOrdersResult['status'] === 200 && !empty($cancelledOrdersResult['result'])) 
                          ? $cancelledOrdersResult['result'][0]['cancelled_orders'] : 0;
        
        // 取得實際購買金額（排除已取消訂單）
        $totalAmountResult = $this->om->getTotalPurchaseAmount($accountId);
        $totalAmount = ($totalAmountResult['status'] === 200 && !empty($totalAmountResult['result'])) 
                      ? $totalAmountResult['result'][0]['total_amount'] : 0;
        
        // 取得購買商品種類數（排除已取消訂單）
        $totalItemsResult = $this->om->getTotalItemsCount($accountId);
        $totalItems = ($totalItemsResult['status'] === 200 && !empty($totalItemsResult['result'])) 
                     ? $totalItemsResult['result'][0]['total_items'] : 0;
        
        return array(
            'status' => 200,
            'result' => array(
                'total_orders' => intval($totalOrders),           // 總訂單數
                'cancelled_orders' => intval($cancelledOrders),   // 已取消訂單數
                'total_amount' => intval($totalAmount),           // 實際購買金額
                'total_items' => intval($totalItems)              // 購買商品種類數
            )
        );
    }
    
    public function newOrder(){
        // 除錯：檢查接收到的POST資料
        error_log("POST data: " . print_r($_POST, true));
        
        // 訂單主表
        $accountId = $_POST['account_id'] ?? null;
        // 訂單詳細表
        $productsId = $_POST['products_id'] ?? array();
        $quantity = $_POST['quantity'] ?? array();
        
        // 除錯：檢查參數值
        error_log("account_id: " . $accountId);
        error_log("products_id: " . print_r($productsId, true));
        error_log("quantity: " . print_r($quantity, true));
        
        // 檢查必要參數
        if (empty($accountId) || !is_numeric($accountId)) {
            return array('status' => 400, 'message' => '無效的帳號ID');
        }
        
        if (empty($productsId)) {
            return array('status' => 400, 'message' => '缺少products_id參數');
        }
        
        if (empty($quantity)) {
            return array('status' => 400, 'message' => '缺少quantity參數');
        }
        
        // 確保 productsId 和 quantity 是陣列
        if (!is_array($productsId)) {
            $productsId = array($productsId);
        }
        if (!is_array($quantity)) {
            $quantity = array($quantity);
        }
        
        try {
            // 先檢查所有產品庫存是否足夠，且商品狀態為上架
            for ($i = 0; $i < count($productsId); $i++) {
                $checkStockResult = $this->om->checkProductStock($productsId[$i]);
                
                // 檢查產品是否存在
                if ($checkStockResult['status'] != 200 || empty($checkStockResult['result'])) {
                    return array('status' => 404, 'message' => "找不到產品ID: " . $productsId[$i]);
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
            $result = $this->om->createOrder($accountId);
            
            if ($result['status'] != 200) {
                return $result;
            }
            
            // 查詢剛建立的訂單ID
            $getIdResult = $this->om->getLatestOrderId($accountId);
            
            if ($getIdResult['status'] != 200 || empty($getIdResult['result'])) {
                return array('status' => 500, 'message' => "無法獲取訂單ID");
            }
            
            $orderId = $getIdResult['result'][0]['latest_id'];
            
            // 處理多個產品的情況
            for ($i = 0; $i < count($productsId); $i++) {
                // 建立訂單詳細表
                $detailResult = $this->om->createOrderDetail($orderId, $productsId[$i], $quantity[$i]);
                
                if ($detailResult['status'] != 200) {
                    return $detailResult;
                }
                
                // 更新產品庫存
                $updateResult = $this->om->updateProductStock($productsId[$i], $quantity[$i]);
                
                if ($updateResult['status'] != 200) {
                    return $updateResult;
                }
            }
            
            return array('status' => 200, 'message' => "訂單建立成功", 'order_id' => $orderId);
            
        } catch (\Throwable $th) {
            return array('status' => 500, 'message' => "訂單建立失敗：" . $th->getMessage());
        }
    }
    
    public function removeOrder(){
        if (!isset($_POST['order_id']) || !isset($_POST['account_id'])) {
            return array('status' => 400, 'message' => '缺少必要參數：order_id 或 account_id');
        }
        $orderId = $_POST['order_id'];
        $accountId = $_POST['account_id'];
        
        // 添加調試資訊
        error_log("removeOrder 調試 - order_id: " . $orderId);
        error_log("removeOrder 調試 - account_id: " . $accountId);
        
        // 1. 先確認訂單是否存在
        $orderResult = $this->om->getOrderById($orderId);

        if ($orderResult['status'] != 200 || empty($orderResult['result'])) {
            return array('status' => 404, 'message' => "找不到訂單編號：" . $orderId);
        }
        $order = $orderResult['result'][0];
        error_log("訂單資料：" . json_encode($order));

        // 2. 確認訂單狀態，已出貨跟已取消的訂單不能取消
        if (in_array($order['status'], ['shipped', 'cancelled'])) {
            error_log("訂單狀態不允許取消：" . $order['status']);
            return array('status' => 400, 'message' => "無法取消狀態為「" . $order['status'] . "」的訂單");
        }

        // 3. 只有admin跟訂單擁有者可以刪除訂單
        $accountResult = $this->om->getUserRole($accountId);
        
        error_log("用戶查詢結果：" . json_encode($accountResult));

        if ($accountResult['status'] != 200 || empty($accountResult['result'])) {
            error_log("無法找到用戶：" . $accountId);
            return array('status' => 403, 'message' => "權限不足，無法取消此訂單");
        }

        $userRole = $accountResult['result'][0]['role_id'];
        $isAdmin = ($userRole == 1); //  role_id = 1 是管理員
        $isOwner = ($order['account_id'] == $accountId);
        
        if (!$isAdmin && !$isOwner) {
            return array('status' => 403, 'message' => "權限不足，無法取消此訂單");
        }
        
        error_log("權限檢查通過，開始處理訂單取消");
        
        try {
            // 4. 庫存回滾
            // 4.1 查詢訂單詳細表
            $detailResult = $this->om->getOrderDetailItems($orderId);
            
            if ($detailResult['status'] == 200 && !empty($detailResult['result'])) {
                // 4.2 庫存回滾
                foreach($detailResult['result'] as $item) {
                    $updateResult = $this->om->restoreProductStock($item['product_id'], $item['quantity']);
                    if ($updateResult['status'] != 200) {
                        return array('status' => 500, 'message' => '庫存還原失敗，請聯繫管理員處理訂單 #' . $orderId);
                    }
                }
            }

            // 5. 訂單狀態更新
            $updateOrderResult = $this->om->cancelOrder($orderId);

            if ($updateOrderResult['status'] != 200) {
                return $updateOrderResult;
            }

            return array('status' => 200, 'message' => "訂單 #" . $orderId . " 已成功取消");

        } catch (\Throwable $th) {
            return array('status' => 500, 'message' => "取消訂單時發生錯誤：" . $th->getMessage());
        }
    }
    
    public function updateProduct(){
        $pid = $_POST['pid'];
        $p_name = $_POST['p_name'];
        $price = $_POST['price'];
        $stock = $_POST['stock'];
        $category = $_POST['category'];

        // 直接回傳模型的結果，不處理錯誤
        return $this->om->updateProduct($pid, $p_name, $price, $stock, $category);
    }

    // 更新訂單狀態
    public function updateOrderStatus(){
        // 檢查必要參數
        if (!isset($_POST['order_id']) || !isset($_POST['status'])) {
            return array('status' => 400, 'message' => '缺少必要參數：order_id 或 status');
        }
        
        $orderId = $_POST['order_id'];
        $status = $_POST['status'];
        
        // 檢查訂單是否存在
        $checkResult = $this->om->checkOrderExists($orderId);
        
        // 如果訂單不存在，回傳錯誤訊息
        if ($checkResult['status'] !== 200 || $checkResult['result'][0]['count'] == 0) {
            return array('status' => 404, 'message' => "找不到訂單編號：" . $orderId);
        }
        
        // 檢查狀態值是否有效 (有效狀態為：pending(待處理), processing(處理中), shipped(已出貨), cancelled(已取消))
        $validStatus = array('pending', 'processing', 'shipped', 'cancelled');
        if (!in_array($status, $validStatus)) {
            return array('status' => 400, 'message' => "無效的訂單狀態，有效狀態為：pending, processing, shipped, cancelled");
        }
        
        // 更新訂單狀態
        $result = $this->om->updateOrderStatus($orderId, $status);
        
        // 如果更新成功，回傳成功訊息
        if ($result['status'] == 200) {
            return array('status' => 200, 'message' => "訂單狀態已更新為：" . $status);
        } else {
            return $result; // 回傳資料庫操作的錯誤訊息
        }
    }
}
?>