<?php
namespace Controllers;
use Vendor\DB;
use Vendor\Controller;
use Models\Cart as CartModel;

class Cart extends Controller
{
    private $cm; 
    
    public function __construct() {
        $this->cm = new CartModel();
    }
    
    public function getCart(){
        // 驗證必要參數
        if (!isset($_POST['account_id']) || empty($_POST['account_id'])) {
            return array(
                'status' => 400, 
                'message' => '缺少必要參數: account_id'
            );
        }
        
        $accountId = $_POST['account_id'];
        return $this->cm->getUserCart($accountId);
    }
    
    public function addToCart(){
        // 驗證必要參數
        if (!isset($_POST['account_id']) || empty($_POST['account_id'])) {
            return array('status' => 400, 'message' => '缺少必要參數: account_id');
        }
        
        if (!isset($_POST['product_id']) || empty($_POST['product_id'])) {
            return array('status' => 400, 'message' => '缺少必要參數: product_id');
        }
        
        $accountId = $_POST['account_id'];
        $productId = $_POST['product_id'];
        $quantity = isset($_POST['quantity']) && is_numeric($_POST['quantity']) ? 
                    intval($_POST['quantity']) : 1;
        
        // 驗證數量
        if ($quantity <= 0) {
            return array('status' => 400, 'message' => '商品數量必須大於零');
        }
        
        return $this->cm->addToCart($accountId, $productId, $quantity);
    }
    
    public function updateCartItem(){
        // 驗證必要參數
        if (!isset($_POST['account_id']) || empty($_POST['account_id'])) {
            return array('status' => 400, 'message' => '缺少必要參數: account_id');
        }
        
        if (!isset($_POST['cart_item_id']) || empty($_POST['cart_item_id'])) {
            return array('status' => 400, 'message' => '缺少必要參數: cart_item_id');
        }
        
        if (!isset($_POST['quantity']) || !is_numeric($_POST['quantity'])) {
            return array('status' => 400, 'message' => '缺少必要參數: quantity');
        }
        
        $accountId = $_POST['account_id'];
        $cartItemId = $_POST['cart_item_id'];
        $quantity = intval($_POST['quantity']);
        
        // 驗證數量
        if ($quantity < 0) {
            return array('status' => 400, 'message' => '商品數量不可為負數');
        }
        
        return $this->cm->updateCartItem($accountId, $cartItemId, $quantity);
    }
    
    public function removeFromCart(){
        // 驗證必要參數
        if (!isset($_POST['account_id']) || empty($_POST['account_id'])) {
            return array('status' => 400, 'message' => '缺少必要參數: account_id');
        }
        
        if (!isset($_POST['cart_item_id']) || empty($_POST['cart_item_id'])) {
            return array('status' => 400, 'message' => '缺少必要參數: cart_item_id');
        }
        
        $accountId = $_POST['account_id'];
        $cartItemId = $_POST['cart_item_id'];
        
        return $this->cm->removeFromCart($accountId, $cartItemId);
    }
    
    public function clearCart(){
        // 驗證必要參數
        if (!isset($_POST['account_id']) || empty($_POST['account_id'])) {
            return array('status' => 400, 'message' => '缺少必要參數: account_id');
        }
        
        $accountId = $_POST['account_id'];
        return $this->cm->clearCart($accountId);
    }
    
    public function getCartStatistics(){
        // 驗證必要參數
        if (!isset($_POST['account_id']) || empty($_POST['account_id'])) {
            return array('status' => 400, 'message' => '缺少必要參數: account_id');
        }
        
        $accountId = $_POST['account_id'];
        return $this->cm->getCartStatistics($accountId);
    }
}
?> 