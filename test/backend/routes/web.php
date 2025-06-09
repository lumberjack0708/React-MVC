<?php

// doLogin 由 Main.php 直接處理，不需要在此註冊路由

$router->register(action: 'getUsers', class: 'Employee', method: 'getUsers');
$router->register(action: 'newUser', class: 'Employee', method: 'newUser');
$router->register(action: 'removeUser', class: 'Employee', method: 'removeUser');
$router->register(action: 'updateUser', class: 'Employee', method: 'updateUser');

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
?>