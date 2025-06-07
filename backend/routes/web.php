<?php
// $router->register(action: 'getUsers', class: 'Employee', method: 'getUsers');
// $router->register(action: 'newUser', class: 'Employee', method: 'newUser');
// $router->register(action: 'removeUser', class: 'Employee', method: 'removeUser');
// $router->register(action: 'updateUser', class: 'Employee', method: 'updateUser');

// 產品相關路由
$router->register(action: 'getProducts', class: 'Product',method: 'getProducts');
$router->register(action: 'newProduct', class: 'Product', method: 'newProduct');
$router->register(action: 'removeProduct', class: 'Product', method: 'removeProduct');
$router->register(action: 'updateProduct', class: 'Product', method: 'updateProduct');

// 角色相關路由
$router->register(action: 'getRoles', class: 'Role', method: 'getRoles');
$router->register(action: 'newRole', class: 'Role', method: 'newRole');
$router->register(action: 'removeRole', class: 'Role', method: 'removeRole');
$router->register(action: 'updateRole', class: 'Role', method: 'updateRole');

// 供應商相關路由
$router->register(action: 'getSuppliers', class: 'Supplier', method: 'getSuppliers');
$router->register(action: 'newSupplier', class: 'Supplier', method: 'newSupplier');
$router->register(action: 'removeSupplier', class: 'Supplier', method:'removeSupplier');
$router->register(action: 'updateSupplier', class: 'Supplier', method:'updateSupplier');

// 使用者帳戶資料相關路由 (已更新為 Account class)
$router->register(action: 'getUsers', class: 'Account', method: 'getUsers');
$router->register(action: 'newUser', class: 'Account', method: 'newUser');
$router->register(action: 'removeUser', class: 'Account', method: 'removeUser');
$router->register(action: 'updateUser', class: 'Account', method: 'updateUser');

// 訂單管理相關路由
$router->register(action: 'getOrders', class: 'Order', method: 'getOrders');
$router->register(action: 'getOrder', class: 'Order', method: 'getOrder');
$router->register(action: 'getOrderStatistics', class: 'Order', method: 'getOrderStatistics');      # 顧客端：獲取該帳號的訂單統計資料
$router->register(action: 'newOrder', class: 'Order', method: 'newOrder');
$router->register(action: 'removeOrder', class: 'Order', method: 'removeOrder');
$router->register(action: 'updateOrder', class: 'Order', method: 'updateOrder');
$router->register(action: 'getOrderDetail', class: 'Order', method: 'getOrderDetail');
$router->register(action: 'updateOrderStatus', class: 'Order', method: 'updateOrderStatus');    # 更新訂單狀態
?>