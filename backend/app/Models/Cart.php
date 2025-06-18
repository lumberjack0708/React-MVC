<?php
namespace Models;
use Vendor\DB;

class Cart {
    
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
    
    // 取得用戶的活躍購物車
    public function getActiveCartByAccountId($accountId) {
        $sql = "SELECT cart_id FROM shopping_cart WHERE account_id = ? AND status = 'active'";
        return DB::select($sql, array($accountId));
    }
    
    // 創建新的購物車
    public function createCart($accountId) {
        $insertSql = "INSERT INTO shopping_cart (account_id, status) VALUES (?, 'active')";
        $insertResult = DB::insert($insertSql, array($accountId));
        
        if ($insertResult['status'] === 200) {
            $cartId = isset($insertResult['insert_id']) ? $insertResult['insert_id'] : null;
            if ($cartId === null) {
                // 如果無法獲取 insert_id，嘗試查詢剛才插入的記錄
                $findSql = "SELECT cart_id 
                            FROM shopping_cart 
                            WHERE account_id = ? 
                            AND status = 'active' 
                            ORDER BY created_at DESC 
                            LIMIT 1";
                $findResult = DB::select($findSql, array($accountId));
                if ($findResult['status'] === 200 && count($findResult['result']) > 0) {
                    $cartId = $findResult['result'][0]['cart_id'];
                }
            }
            
            return array(
                'status' => 200,
                'cart_id' => $cartId
            );
        }
        
        return $insertResult;
    }
    
    // 取得商品資訊
    public function getProductById($productId) {
        $sql = "SELECT product_id, name, price, stock 
                FROM product 
                WHERE product_id = ? 
                AND p_status = 'active'";
        return DB::select($sql, array($productId));
    }
    
    // 取得購物車詳細資訊（不含統計計算）
    public function getCartDetailsByCartId($cartId) {
        $sql = "SELECT 
                    shopping_cart.cart_id,
                    cart_items.cart_item_id,
                    cart_items.product_id,
                    product.name AS product_name,
                    product.category,
                    product.image_url,
                    cart_items.quantity,
                    cart_items.unit_price,
                    product.price AS current_price,
                    (cart_items.quantity * cart_items.unit_price) AS item_total,
                    cart_items.added_at,
                    cart_items.updated_at,
                    (product.price != cart_items.unit_price) AS price_changed
                FROM shopping_cart
                JOIN cart_items ON shopping_cart.cart_id = cart_items.cart_id
                JOIN product ON cart_items.product_id = product.product_id
                WHERE shopping_cart.cart_id = ? AND shopping_cart.status = 'active'
                ORDER BY cart_items.added_at DESC";
        
        return DB::select($sql, array($cartId));
    }
    

    // 檢查商品是否已在購物車中
    public function getCartItemByCartAndProduct($cartId, $productId) {
        $sql = "SELECT cart_item_id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?";
        return DB::select($sql, array($cartId, $productId));
    }
    
    // 更新購物車項目數量
    public function updateCartItemQuantity($cartItemId, $quantity) {
        $sql = "UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE cart_item_id = ?";
        return DB::update($sql, array($quantity, $cartItemId));
    }
    
    // 新增商品到購物車
    public function insertCartItem($cartId, $productId, $quantity, $unitPrice) {
        $sql = "INSERT INTO cart_items (cart_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)";
        return DB::insert($sql, array($cartId, $productId, $quantity, $unitPrice));
    }
    

    // 驗證購物車項目是否屬於該用戶
    public function verifyCartItemOwnership($cartItemId, $accountId) {
        $sql = "SELECT cart_items.cart_item_id, cart_items.product_id, cart_items.quantity, shopping_cart.account_id 
                FROM cart_items 
                JOIN shopping_cart ON cart_items.cart_id = shopping_cart.cart_id 
                WHERE cart_items.cart_item_id = ? AND shopping_cart.account_id = ? AND shopping_cart.status = 'active'";
        
        return DB::select($sql, array($cartItemId, $accountId));
    }
    
    
    // 刪除購物車項目
    public function deleteCartItem($cartItemId) {
        $sql = "DELETE FROM cart_items WHERE cart_item_id = ?";
        return DB::delete($sql, array($cartItemId));
    }
    
    
    // 刪除購物車所有項目
    public function deleteAllCartItems($cartId) {
        $sql = "DELETE FROM cart_items WHERE cart_id = ?";
        return DB::delete($sql, array($cartId));
    }
    
    
    // 取得購物車統計資訊（原始資料）
    public function getCartStatisticsData($accountId) {
        $sql = "SELECT 
                    shopping_cart.cart_id,
                    shopping_cart.account_id,
                    COUNT(cart_items.cart_item_id) AS total_items,
                    COALESCE(SUM(cart_items.quantity), 0) AS total_quantity,
                    COALESCE(SUM(cart_items.quantity * cart_items.unit_price), 0) AS total_amount,
                    shopping_cart.created_at,
                    shopping_cart.updated_at
                FROM shopping_cart
                LEFT JOIN cart_items ON shopping_cart.cart_id = cart_items.cart_id
                WHERE shopping_cart.account_id = ? AND shopping_cart.status = 'active'
                GROUP BY shopping_cart.cart_id, shopping_cart.account_id, shopping_cart.created_at, shopping_cart.updated_at";
        
        return DB::select($sql, array($accountId));
    }
}
?> 