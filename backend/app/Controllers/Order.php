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
        $account_id = $_POST['account_id'];
        return $this->om->getOrderStatistics($account_id);
    }
    
    public function newOrder(){
        // 除錯：檢查接收到的POST資料
        error_log("POST data: " . print_r($_POST, true));
        
        // 訂單主表
        $account_id = $_POST['account_id'] ?? null;
        // 訂單詳細表
        $products_id = $_POST['products_id'] ?? array();
        $quantity = $_POST['quantity'] ?? array();
        
        // 除錯：檢查參數值
        error_log("account_id: " . $account_id);
        error_log("products_id: " . print_r($products_id, true));
        error_log("quantity: " . print_r($quantity, true));
        
        // 檢查必要參數
        if (empty($account_id)) {
            return array('status' => 400, 'message' => '缺少account_id參數');
        }
        
        if (empty($products_id)) {
            return array('status' => 400, 'message' => '缺少products_id參數');
        }
        
        if (empty($quantity)) {
            return array('status' => 400, 'message' => '缺少quantity參數');
        }

        // 直接回傳模型的結果
        return $this->om->newOrder($account_id, $products_id, $quantity);
    }
    
    public function removeOrder(){
        if (!isset($_POST['order_id']) || !isset($_POST['account_id'])) {
            return array('status' => 400, 'message' => '缺少必要參數：order_id 或 account_id');
        }
        $order_id = $_POST['order_id'];
        $account_id = $_POST['account_id'];
        
        // 添加調試資訊
        error_log("removeOrder 調試 - order_id: " . $order_id);
        error_log("removeOrder 調試 - account_id: " . $account_id);
        
        $result = $this->om->removeOrder($order_id, $account_id);
        
        // 調試結果
        error_log("removeOrder 調試 - 結果: " . json_encode($result));
        
        return $result;
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
        
        // 呼叫模型的方法更新訂單狀態
        return $this->om->updateOrderStatus($orderId, $status);
    }
}
?>