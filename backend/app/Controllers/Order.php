<?php
namespace app\Controllers;
use vendor\DB;
use vendor\Controller;
use app\Models\Order as OrderModel;

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
        return $this->om->getOrderDetail();
    }
    
    public function newOrder(){
        // 訂單主表
        $account_id = $_POST['account_id'];
        // 訂單詳細表
        $products_id = $_POST['products_id'];
        $quantity = $_POST['quantity'];

        // 直接回傳模型的結果，不處理錯誤
        return $this->om->newOrder($account_id, $products_id, $quantity);
    }
    
    public function removeOrder(){
        if (!isset($_POST['order_id']) || !isset($_POST['account_id'])) {
            return array('status' => 400, 'message' => '缺少必要參數：order_id 或 account_id');
        }
        $order_id = $_POST['order_id'];
        $account_id = $_POST['account_id'];
        return $this->om->removeOrder($order_id, $account_id);
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