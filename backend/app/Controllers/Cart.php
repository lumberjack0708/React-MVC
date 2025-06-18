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
        
        // 1. 獲取或創建用戶的活躍購物車
        $cartResult = $this->getOrCreateActiveCart($accountId);
        if ($cartResult['status'] !== 200) {
            return $cartResult;
        }
        
        $cartId = $cartResult['cart_id'];
        
        // 2. 獲取購物車詳細資訊
        $result = $this->cm->getCartDetailsByCartId($cartId);
        
        if ($result['status'] === 200) {
            // 3. 計算統計資訊（業務邏輯）
            $items = $result['result'];
            $totalItems = count($items);
            $totalQuantity = 0;
            $totalAmount = 0;
            $priceChangedItems = 0;
            
            foreach ($items as $item) {
                $totalQuantity += $item['quantity'];
                $totalAmount += $item['item_total'];
                if ($item['price_changed']) {
                    $priceChangedItems++;
                }
            }
            
            return array(
                'status' => 200,
                'result' => array(
                    'cart_id' => $cartId,
                    'items' => $items,
                    'statistics' => array(
                        'total_items' => $totalItems,
                        'total_quantity' => $totalQuantity,
                        'total_amount' => $totalAmount,
                        'price_changed_items' => $priceChangedItems
                    )
                )
            );
        }
        
        return $result;
    }
    
    // 獲取或創建用戶的活躍購物車（業務邏輯）
    private function getOrCreateActiveCart($accountId) {
        // 先查詢是否有活躍的購物車
        $result = $this->cm->getActiveCartByAccountId($accountId);
        
        if ($result['status'] === 200 && count($result['result']) > 0) {
            // 已有活躍購物車
            return array(
                'status' => 200,
                'cart_id' => $result['result'][0]['cart_id']
            );
        } else {
            // 創建新的購物車
            $createResult = $this->cm->createCart($accountId);
            
            if ($createResult['status'] === 200) {
                return array(
                    'status' => 200,
                    'cart_id' => $createResult['cart_id']
                );
            } else {
                return array(
                    'status' => 500,
                    'message' => '創建購物車失敗'
                );
            }
        }
    }
    
    // 驗證商品是否存在且有足夠庫存（業務邏輯）
    private function validateProduct($productId, $requestedQuantity) {
        $result = $this->cm->getProductById($productId);
        
        if ($result['status'] !== 200 || count($result['result']) === 0) {
            return array(
                'status' => 404,
                'message' => '商品不存在'
            );
        }
        
        $product = $result['result'][0];
        
        if ($product['stock'] < $requestedQuantity) {
            return array(
                'status' => 400,
                'message' => '庫存不足，目前庫存: ' . $product['stock']
            );
        }
        
        return array(
            'status' => 200,
            'product' => $product
        );
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
        
        // 1. 驗證商品是否存在且庫存充足
        $productValidation = $this->validateProduct($productId, $quantity);
        if ($productValidation['status'] !== 200) {
            return $productValidation;
        }
        
        $product = $productValidation['product'];
        
        // 2. 獲取或創建購物車
        $cartResult = $this->getOrCreateActiveCart($accountId);
        if ($cartResult['status'] !== 200) {
            return $cartResult;
        }
        
        $cartId = $cartResult['cart_id'];
        
        // 3. 檢查商品是否已在購物車中
        $checkResult = $this->cm->getCartItemByCartAndProduct($cartId, $productId);
        
        if ($checkResult['status'] === 200 && count($checkResult['result']) > 0) {
            // 商品已存在，更新數量
            $existingItem = $checkResult['result'][0];
            $newQuantity = $existingItem['quantity'] + $quantity;
            
            // 再次驗證總數量
            $totalValidation = $this->validateProduct($productId, $newQuantity);
            if ($totalValidation['status'] !== 200) {
                return $totalValidation;
            }
            
            // 更新數量
            $updateResult = $this->cm->updateCartItemQuantity($existingItem['cart_item_id'], $newQuantity);
            
            if ($updateResult['status'] === 200) {
                return array(
                    'status' => 200,
                    'message' => '商品數量已更新',
                    'cart_item_id' => $existingItem['cart_item_id'],
                    'new_quantity' => $newQuantity
                );
            } else {
                return array(
                    'status' => 500,
                    'message' => '更新購物車失敗'
                );
            }
        } else {
            // 新增商品到購物車
            $insertResult = $this->cm->insertCartItem($cartId, $productId, $quantity, $product['price']);
            
            if ($insertResult['status'] === 200) {
                $cartItemId = isset($insertResult['insert_id']) ? $insertResult['insert_id'] : null;
                return array(
                    'status' => 200,
                    'message' => '商品已加入購物車',
                    'cart_item_id' => $cartItemId
                );
            } else {
                return array(
                    'status' => 500,
                    'message' => '加入購物車失敗'
                );
            }
        }
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
        
        // 1. 驗證購物車項目是否屬於該用戶
        $verifyResult = $this->cm->verifyCartItemOwnership($cartItemId, $accountId);
        
        if ($verifyResult['status'] !== 200 || count($verifyResult['result']) === 0) {
            return array(
                'status' => 404,
                'message' => '購物車項目不存在或無權限操作'
            );
        }
        
        $item = $verifyResult['result'][0];
        
        // 2. 如果數量為0，則刪除該項目
        if ($quantity === 0) {
            return $this->removeFromCart($accountId, $cartItemId);
        }
        
        // 3. 驗證庫存
        $productValidation = $this->validateProduct($item['product_id'], $quantity);
        if ($productValidation['status'] !== 200) {
            return $productValidation;
        }
        
        // 4. 更新數量
        $updateResult = $this->cm->updateCartItemQuantity($cartItemId, $quantity);
        
        if ($updateResult['status'] === 200) {
            return array(
                'status' => 200,
                'message' => '商品數量已更新',
                'new_quantity' => $quantity
            );
        } else {
            return array(
                'status' => 500,
                'message' => '更新失敗'
            );
        }
    }
    
    public function removeFromCart($accountId = null, $cartItemId = null){
        // 如果沒有傳入參數，從 POST 取得
        if ($accountId === null || $cartItemId === null) {
            // 驗證必要參數
            if (!isset($_POST['account_id']) || empty($_POST['account_id'])) {
                return array('status' => 400, 'message' => '缺少必要參數: account_id');
            }
            
            if (!isset($_POST['cart_item_id']) || empty($_POST['cart_item_id'])) {
                return array('status' => 400, 'message' => '缺少必要參數: cart_item_id');
            }
            
            $accountId = $_POST['account_id'];
            $cartItemId = $_POST['cart_item_id'];
        }
        
        // 1. 驗證購物車項目是否屬於該用戶
        $verifyResult = $this->cm->verifyCartItemOwnership($cartItemId, $accountId);
        
        if ($verifyResult['status'] !== 200 || count($verifyResult['result']) === 0) {
            return array(
                'status' => 404,
                'message' => '購物車項目不存在或無權限操作'
            );
        }
        
        // 2. 刪除項目
        $deleteResult = $this->cm->deleteCartItem($cartItemId);
        
        if ($deleteResult['status'] === 200) {
            return array(
                'status' => 200,
                'message' => '商品已從購物車移除'
            );
        } else {
            return array(
                'status' => 500,
                'message' => '移除失敗'
            );
        }
    }
    
    public function clearCart(){
        // 驗證必要參數
        if (!isset($_POST['account_id']) || empty($_POST['account_id'])) {
            return array('status' => 400, 'message' => '缺少必要參數: account_id');
        }
        
        $accountId = $_POST['account_id'];
        
        // 1. 獲取用戶的活躍購物車
        $cartResult = $this->getOrCreateActiveCart($accountId);
        if ($cartResult['status'] !== 200) {
            return $cartResult;
        }
        
        $cartId = $cartResult['cart_id'];
        
        // 2. 刪除所有購物車項目
        $deleteResult = $this->cm->deleteAllCartItems($cartId);
        
        if ($deleteResult['status'] === 200) {
            return array(
                'status' => 200,
                'message' => '購物車已清空'
            );
        } else {
            return array(
                'status' => 500,
                'message' => '清空購物車失敗'
            );
        }
    }
    
    // 取得購物車統計資料
    public function getCartStatistics(){
        // 驗證必要參數
        if (!isset($_POST['account_id']) || empty($_POST['account_id'])) {
            return array('status' => 400, 'message' => '缺少必要參數: account_id');
        }
        
        $accountId = $_POST['account_id'];
        
        // 查詢購物車統計資訊
        $result = $this->cm->getCartStatisticsData($accountId);
        
        if ($result['status'] === 200) {
            if (count($result['result']) > 0) {
                return array(
                    'status' => 200,
                    'result' => $result['result'][0]
                );
            } else {
                // 沒有購物車，返回空統計
                return array(
                    'status' => 200,
                    'result' => array(
                        'total_items' => 0,
                        'total_quantity' => 0,
                        'total_amount' => 0,
                        'created_at' => null,
                        'updated_at' => null
                    )
                );
            }
        }
        
        return $result;
    }
}
?> 