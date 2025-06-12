<?php
namespace Models;
use Vendor\DB;

class Cart {
    
    // 獲取或創建用戶的活躍購物車
    private function getOrCreateActiveCart($accountId) {
        // 先查詢是否有活躍的購物車
        $sql = "SELECT cart_id FROM shopping_cart WHERE account_id = ? AND status = 'active'";
        $result = DB::select($sql, array($accountId));
        
        if ($result['status'] === 200 && count($result['result']) > 0) {
            // 已有活躍購物車
            return array(
                'status' => 200,
                'cart_id' => $result['result'][0]['cart_id']
            );
        } else {
            // 創建新的購物車
            $insertSql = "INSERT INTO shopping_cart (account_id, status) VALUES (?, 'active')";
            $insertResult = DB::insert($insertSql, array($accountId));
            
            if ($insertResult['status'] === 200) {
                $cartId = isset($insertResult['insert_id']) ? $insertResult['insert_id'] : null;
                if ($cartId === null) {
                    // 如果無法獲取 insert_id，嘗試查詢剛才插入的記錄
                    $findSql = "SELECT cart_id FROM shopping_cart WHERE account_id = ? AND status = 'active' ORDER BY created_at DESC LIMIT 1";
                    $findResult = DB::select($findSql, array($accountId));
                    if ($findResult['status'] === 200 && count($findResult['result']) > 0) {
                        $cartId = $findResult['result'][0]['cart_id'];
                    }
                }
                
                return array(
                    'status' => 200,
                    'cart_id' => $cartId
                );
            } else {
                return array(
                    'status' => 500,
                    'message' => '創建購物車失敗'
                );
            }
        }
    }
    
    
    // 驗證商品是否存在且有足夠庫存
    private function validateProduct($productId, $requestedQuantity) {
        $sql = "SELECT product_id, name, price, stock FROM product WHERE product_id = ?";
        $result = DB::select($sql, array($productId));
        
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
    
    // 獲取用戶購物車詳細資訊
    public function getUserCart($accountId) {
        // 先確保用戶有活躍購物車
        $cartResult = $this->getOrCreateActiveCart($accountId);
        if ($cartResult['status'] !== 200) {
            return $cartResult;
        }
        
        $cartId = $cartResult['cart_id'];
        
        // 使用 JOIN 查詢購物車詳細資訊
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
        
        $result = DB::select($sql, array($cartId));
        
        if ($result['status'] === 200) {
            // 計算統計資訊
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
    

    // 加入購物車
    public function addToCart($accountId, $productId, $quantity) {
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
        $checkSql = "SELECT cart_item_id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?";
        $checkResult = DB::select($checkSql, array($cartId, $productId));
        
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
            $updateSql = "UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE cart_item_id = ?";
            $updateResult = DB::update($updateSql, array($newQuantity, $existingItem['cart_item_id']));
            
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
            $insertSql = "INSERT INTO cart_items (cart_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)";
            $insertResult = DB::insert($insertSql, array($cartId, $productId, $quantity, $product['price']));
            
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
    

    // 更新購物車商品數量
    public function updateCartItem($accountId, $cartItemId, $quantity) {
        // 1. 驗證購物車項目是否屬於該用戶
        $verifySql = "SELECT cart_items.cart_item_id, cart_items.product_id, cart_items.quantity, shopping_cart.account_id 
                        FROM cart_items 
                        JOIN shopping_cart ON cart_items.cart_id = shopping_cart.cart_id 
                        WHERE cart_items.cart_item_id = ? AND shopping_cart.account_id = ? AND shopping_cart.status = 'active'";
        
        $verifyResult = DB::select($verifySql, array($cartItemId, $accountId));
        
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
        $updateSql = "UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE cart_item_id = ?";
        $updateResult = DB::update($updateSql, array($quantity, $cartItemId));
        
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
    
    
    // 移除購物車商品
    public function removeFromCart($accountId, $cartItemId) {
        // 1. 驗證購物車項目是否屬於該用戶
        $verifySql = "SELECT cart_items.cart_item_id 
                      FROM cart_items 
                      JOIN shopping_cart ON cart_items.cart_id = shopping_cart.cart_id 
                      WHERE cart_items.cart_item_id = ? AND shopping_cart.account_id = ? AND shopping_cart.status = 'active'";
        
        $verifyResult = DB::select($verifySql, array($cartItemId, $accountId));
        
        if ($verifyResult['status'] !== 200 || count($verifyResult['result']) === 0) {
            return array(
                'status' => 404,
                'message' => '購物車項目不存在或無權限操作'
            );
        }
        
        // 2. 刪除項目
        $deleteSql = "DELETE FROM cart_items WHERE cart_item_id = ?";
        $deleteResult = DB::delete($deleteSql, array($cartItemId));
        
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
    
    
    // 清空購物車
    public function clearCart($accountId) {
        // 1. 獲取用戶的活躍購物車
        $cartResult = $this->getOrCreateActiveCart($accountId);
        if ($cartResult['status'] !== 200) {
            return $cartResult;
        }
        
        $cartId = $cartResult['cart_id'];
        
        // 2. 刪除所有購物車項目
        $deleteSql = "DELETE FROM cart_items WHERE cart_id = ?";
        $deleteResult = DB::delete($deleteSql, array($cartId));
        
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
    
    
    // 購物車統計
    public function getCartStatistics($accountId) {
        // 查詢購物車統計資訊
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
        
        $result = DB::select($sql, array($accountId));
        
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
    
    
    // 購物車轉訂單
    public function convertCartToOrder($accountId) {
        // 這個方法可以在訂單創建時調用(暫時還沒用到)
        // 將購物車狀態改為 'converted'
        $updateSql = "UPDATE shopping_cart SET status = 'converted' WHERE account_id = ? AND status = 'active'";
        return DB::update($updateSql, array($accountId));
    }
}
?> 