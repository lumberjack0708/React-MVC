<?php
// 產品相關路由
$router->register(action: 'getProducts', class: 'Product',method: 'getProducts');           // 顧客端：只取得上架中的商品
$router->register(action: 'getAllProducts', class: 'Product',method: 'getAllProducts');     // 管理員：取得所有商品(包含下架)
$router->register(action: 'newProduct', class: 'Product', method: 'newProduct');
$router->register(action: 'removeProduct', class: 'Product', method: 'removeProduct');
$router->register(action: 'updateProduct', class: 'Product', method: 'updateProduct');

// 角色相關路由
// $router->register(action: 'getRoles', class: 'Role', method: 'getRoles');
// $router->register(action: 'newRole', class: 'Role', method: 'newRole');
// $router->register(action: 'removeRole', class: 'Role', method: 'removeRole');
// $router->register(action: 'updateRole', class: 'Role', method: 'updateRole');

// 使用者帳戶資料相關路由 (Account)
$router->register(action: 'getUsers', class: 'Account', method: 'getUsers');
$router->register(action: 'getUser', class: 'Account', method: 'getUser');
$router->register(action: 'newUser', class: 'Account', method: 'newUser');
$router->register(action: 'removeUser', class: 'Account', method: 'removeUser');
$router->register(action: 'updateUser', class: 'Account', method: 'updateUser');

// 訂單管理相關路由
$router->register(action: 'getOrders', class: 'Order', method: 'getOrders');
$router->register(action: 'getOrder', class: 'Order', method: 'getOrder'); 
$router->register(action: 'getOrderStatistics', class: 'Order', method: 'getOrderStatistics');      # 顧客端：獲取該帳號的訂單統計資料
$router->register(action: 'newOrder', class: 'Order', method: 'newOrder');
$router->register(action: 'removeOrder', class: 'Order', method: 'removeOrder');    # 取消訂單(會回滾)
$router->register(action: 'updateOrder', class: 'Order', method: 'updateOrder'); //沒在用
$router->register(action: 'getOrderDetail', class: 'Order', method: 'getOrderDetail');
$router->register(action: 'updateOrderStatus', class: 'Order', method: 'updateOrderStatus');    # 更新訂單狀態(會回滾)

// 購物車相關路由
$router->register(action: 'getCart', class: 'Cart', method: 'getCart');
$router->register(action: 'addToCart', class: 'Cart', method: 'addToCart');
$router->register(action: 'removeFromCart', class: 'Cart', method: 'removeFromCart');
$router->register(action: 'updateCartItem', class: 'Cart', method: 'updateCartItem');
$router->register(action: 'clearCart', class: 'Cart', method: 'clearCart');
$router->register(action: 'getCartStatistics', class: 'Cart', method: 'getCartStatistics');     # 顧客端：獲取該帳號的購物車統計資料


?>