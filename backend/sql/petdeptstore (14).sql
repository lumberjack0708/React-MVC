-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2025-06-12 19:06:21
-- 伺服器版本： 10.4.32-MariaDB
-- PHP 版本： 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `petdeptstore`
--

-- --------------------------------------------------------

--
-- 資料表結構 `account`
--

CREATE TABLE `account` (
  `account_id` int(11) NOT NULL,
  `account_code` varchar(10) NOT NULL,
  `role_id` int(11) NOT NULL COMMENT '角色編號 (FK → role.id)',
  `email` varchar(100) NOT NULL COMMENT '電子郵件',
  `password` varchar(255) NOT NULL COMMENT '密碼',
  `full_name` varchar(100) NOT NULL COMMENT '姓名',
  `addr` varchar(255) DEFAULT NULL COMMENT '地址',
  `birth` date DEFAULT NULL COMMENT '生日'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='帳戶資訊表';

--
-- 傾印資料表的資料 `account`
--

INSERT INTO `account` (`account_id`, `account_code`, `role_id`, `email`, `password`, `full_name`, `addr`, `birth`) VALUES
(1, 'ADM1', 1, 'admin@petdept.com', 'jack800', '系統管理者', '台北市中正區中山南路1號', '2000-01-01'),
(2, 'C001', 2, 'alice@petdept.com', 'alice123', 'Alice Chen2', '高雄市鼓山區美術館路12號', '2001-02-14'),
(3, 'C002', 2, 'bob@petdept.com', 'bob123', 'Bob Wu', '台中市西區公益路123號', '1999-08-23'),
(4, 'C003', 2, 'charlie@petdept.com', 'charlie123', 'Charlie Lin', '台北市大安區和平東路1號', '2002-03-05'),
(5, 'C004', 2, 'david@petdept.com', 'david123', 'David Chen', '台南市東區崇學路45號', '2000-07-12'),
(6, 'C005', 2, 'eva@petdept.com', 'eva123', 'Eva Wang', '高雄市三民區民族一路100號', '2003-11-20'),
(7, 'C006', 2, 'frank@petdept.com', 'frank123', 'Frank Ho', '新竹市東區關新路68號', '1998-05-30'),
(8, 'C007', 2, 'grace@petdept.com', 'grace123', 'Grace Liu', '桃園市中壢區中華路二段87號', '2001-09-15');

-- --------------------------------------------------------

--
-- 資料表結構 `action`
--

CREATE TABLE `action` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `action`
--

INSERT INTO `action` (`id`, `name`) VALUES
(1, 'getUsers'),
(2, 'newUser'),
(3, 'getProducts'),
(4, 'removeUser'),
(5, 'updateUser'),
(6, 'newProduct'),
(7, 'removeProduct'),
(8, 'updateProduct'),
(9, 'getOrders'),
(10, 'getOrder'),
(11, 'getOrderStatistics'),
(12, 'newOrder'),
(13, 'removeOrder'),
(14, 'updateOrder'),
(15, 'getOrderDetail'),
(16, 'updateOrderStatus'),
(17, 'getUser'),
(18, 'getUser'),
(19, 'getCart'),
(20, 'addToCart'),
(21, 'updateCartItem'),
(22, 'removeFromCart'),
(23, 'clearCart'),
(24, 'getCartStatistics');

-- --------------------------------------------------------

--
-- 資料表結構 `cart_items`
--

CREATE TABLE `cart_items` (
  `cart_item_id` int(11) NOT NULL COMMENT '購物車商品項目編號 (主鍵)',
  `cart_id` int(11) NOT NULL COMMENT '購物車編號 (FK → shopping_cart.cart_id)',
  `product_id` int(11) NOT NULL COMMENT '商品編號 (FK → product.product_id)',
  `quantity` int(11) NOT NULL DEFAULT 1 COMMENT '商品數量',
  `added_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT '加入購物車時間',
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '最後更新時間',
  `unit_price` decimal(10,2) NOT NULL COMMENT '商品單價 (加入時的價格)'
) ;

--
-- 傾印資料表的資料 `cart_items`
--

INSERT INTO `cart_items` (`cart_item_id`, `cart_id`, `product_id`, `quantity`, `added_at`, `updated_at`, `unit_price`) VALUES
(1, 1, 1, 2, '2025-06-13 00:38:39', '2025-06-13 00:38:39', 350.00),
(2, 1, 3, 1, '2025-06-13 00:38:39', '2025-06-13 00:38:39', 450.00),
(3, 1, 8, 3, '2025-06-13 00:38:39', '2025-06-13 00:38:39', 90.00),
(4, 2, 2, 1, '2025-06-13 00:38:39', '2025-06-13 00:38:39', 120.00),
(5, 2, 6, 2, '2025-06-13 00:38:39', '2025-06-13 00:38:39', 200.00),
(6, 2, 10, 1, '2025-06-13 00:38:39', '2025-06-13 00:38:39', 250.00),
(7, 3, 9, 1, '2025-06-13 00:38:39', '2025-06-13 00:38:39', 1990.00),
(8, 3, 12, 1, '2025-06-13 00:38:39', '2025-06-13 00:38:39', 1680.00),
(9, 3, 11, 2, '2025-06-13 00:38:39', '2025-06-13 00:38:39', 180.00),
(10, 1, 5, 3, '2025-06-13 01:05:38', '2025-06-13 01:05:38', 600.00);

--
-- 觸發器 `cart_items`
--
DELIMITER $$
CREATE TRIGGER `tr_cart_items_delete_cart` AFTER DELETE ON `cart_items` FOR EACH ROW BEGIN
    UPDATE `shopping_cart` 
    SET `updated_at` = CURRENT_TIMESTAMP 
    WHERE `cart_id` = OLD.cart_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `tr_cart_items_insert_cart` AFTER INSERT ON `cart_items` FOR EACH ROW BEGIN
    UPDATE `shopping_cart` 
    SET `updated_at` = CURRENT_TIMESTAMP 
    WHERE `cart_id` = NEW.cart_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `tr_cart_items_update_cart` AFTER UPDATE ON `cart_items` FOR EACH ROW BEGIN
    UPDATE `shopping_cart` 
    SET `updated_at` = CURRENT_TIMESTAMP 
    WHERE `cart_id` = NEW.cart_id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- 資料表結構 `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL COMMENT '整數型自動遞增主鍵',
  `account_id` int(10) NOT NULL COMMENT '帳戶編號 (FK → account.account_id)',
  `order_time` datetime NOT NULL COMMENT '訂購時間',
  `status` varchar(20) NOT NULL DEFAULT 'pending' COMMENT '訂單狀態 (pending, processing, shipped, cancelled)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='訂單表';

--
-- 傾印資料表的資料 `orders`
--

INSERT INTO `orders` (`order_id`, `account_id`, `order_time`, `status`) VALUES
(1, 1, '2025-05-26 09:30:00', 'cancelled'),
(2, 2, '2025-05-26 10:15:00', 'cancelled'),
(5, 1, '2025-06-06 18:34:02', 'cancelled'),
(6, 3, '2025-06-06 19:28:30', 'pending'),
(7, 1, '2025-06-07 14:41:39', 'cancelled'),
(8, 1, '2025-06-07 14:45:44', 'pending'),
(9, 1, '2025-06-07 14:49:57', 'processing'),
(10, 1, '2025-06-07 17:16:30', 'pending'),
(11, 1, '2025-06-07 17:17:36', 'cancelled'),
(12, 1, '2025-06-09 18:14:28', 'pending'),
(13, 2, '2025-06-10 15:27:21', 'cancelled'),
(14, 2, '2025-06-10 15:27:48', 'pending'),
(15, 2, '2025-06-10 15:34:24', 'processing'),
(16, 1, '2025-06-10 15:36:47', 'pending'),
(17, 1, '2025-06-10 15:37:03', 'pending'),
(18, 1, '2025-06-10 15:40:44', 'pending'),
(19, 1, '2025-06-10 15:45:24', 'pending'),
(20, 1, '2025-06-10 15:46:31', 'cancelled'),
(21, 1, '2025-06-10 15:55:33', 'cancelled'),
(22, 2, '2025-06-10 16:19:43', 'shipped'),
(23, 1, '2025-06-10 18:16:03', 'cancelled'),
(24, 2, '2025-06-10 18:58:36', 'shipped'),
(25, 2, '2025-06-10 19:10:03', 'shipped');

-- --------------------------------------------------------

--
-- 資料表結構 `order_detail`
--

CREATE TABLE `order_detail` (
  `order_id` int(11) NOT NULL COMMENT '訂單編號 (對應 orders.order_id)',
  `product_id` int(11) NOT NULL COMMENT '商品編號 (FK → product.product_id)',
  `quantity` int(11) NOT NULL COMMENT '數量'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='訂單明細表';

--
-- 傾印資料表的資料 `order_detail`
--

INSERT INTO `order_detail` (`order_id`, `product_id`, `quantity`) VALUES
(1, 1, 2),
(1, 3, 1),
(2, 2, 3),
(2, 4, 2),
(5, 3, 2),
(6, 3, 2),
(6, 12, 6),
(6, 14, 10),
(7, 1, 2),
(7, 2, 1),
(8, 4, 1),
(8, 7, 1),
(9, 1, 3),
(9, 8, 1),
(9, 18, 1),
(10, 2, 1),
(11, 5, 1),
(11, 19, 1),
(12, 2, 1),
(13, 1, 1),
(13, 5, 1),
(14, 5, 1),
(14, 6, 1),
(15, 1, 1),
(15, 2, 1),
(16, 2, 1),
(16, 3, 1),
(17, 6, 1),
(17, 11, 1),
(18, 10, 1),
(18, 11, 4),
(19, 1, 3),
(19, 16, 2),
(20, 5, 1),
(20, 11, 2),
(21, 2, 1),
(21, 3, 4),
(21, 5, 3),
(22, 1, 1),
(22, 2, 1),
(23, 2, 1),
(24, 6, 3),
(25, 2, 4);

-- --------------------------------------------------------

--
-- 資料表結構 `product`
--

CREATE TABLE `product` (
  `product_id` int(11) NOT NULL COMMENT '商品編號',
  `name` varchar(100) NOT NULL COMMENT '商品名稱',
  `price` decimal(10,2) NOT NULL COMMENT '售價',
  `stock` int(11) NOT NULL COMMENT '存貨量',
  `category` varchar(50) NOT NULL COMMENT '商品類別',
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='商品資訊表';

--
-- 傾印資料表的資料 `product`
--

INSERT INTO `product` (`product_id`, `name`, `price`, `stock`, `category`, `image_url`) VALUES
(1, '犬用飼料 2kg', 350.00, 44, 'food', NULL),
(2, '貓抓板', 120.00, 27, 'toy', NULL),
(3, '寵物睡墊', 450.00, 26, 'accessories', NULL),
(4, '鳥用水樽', 80.00, 45, 'accessories', NULL),
(5, '貓砂盆 附蓋', 600.00, 21, 'accessories', NULL),
(6, '狗狗潔牙骨(10入)', 200.00, 58, 'food', NULL),
(7, '小動物跑輪', 300.00, 24, 'toy', NULL),
(8, '貓咪零食 - 鮪魚條', 90.00, 79, 'food', NULL),
(9, '智能餵食器', 1990.00, 15, 'accessories', NULL),
(10, '犬用牽繩 (紅色)', 250.00, 34, 'accessories', NULL),
(11, '寵物洗毛精 500ml', 180.00, 40, 'accessories', NULL),
(12, '貓跳台 四層', 1680.00, 10, 'accessories', NULL),
(13, '狗狗雨衣 (M號)', 420.00, 20, 'accessories', NULL),
(14, '寵物提籃 (小型犬/貓)', 750.00, 13, 'accessories', NULL),
(15, '兔子飼料 1.5kg', 320.00, 18, 'food', NULL),
(16, '狗狗玩具 - 發聲球', 150.00, 48, 'toy', NULL),
(17, '貓用逗貓棒', 90.00, 70, 'toy', NULL),
(18, '倉鼠木屑 (無塵)', 110.00, 39, 'accessories', NULL),
(19, '水龜濾水器', 1350.00, 16, 'accessories', NULL),
(20, '鳥飼料混合包 1kg', 160.00, 28, 'food', NULL),
(25, '逐鹿燒肉套餐', 690.00, 60, 'food', 'uploads/products/6848100a8492c-IMG_2700.JPEG');

-- --------------------------------------------------------

--
-- 資料表結構 `role`
--

CREATE TABLE `role` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `role`
--

INSERT INTO `role` (`id`, `name`) VALUES
(1, 'admin'),
(2, 'customer');

-- --------------------------------------------------------

--
-- 資料表結構 `role_action`
--

CREATE TABLE `role_action` (
  `id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `action_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `role_action`
--

INSERT INTO `role_action` (`id`, `role_id`, `action_id`) VALUES
(3, 1, 1),
(4, 1, 2),
(5, 1, 4),
(6, 1, 5),
(7, 1, 17),
(8, 1, 3),
(9, 1, 6),
(10, 1, 7),
(11, 1, 8),
(12, 1, 9),
(13, 1, 10),
(14, 1, 11),
(15, 1, 12),
(16, 1, 13),
(17, 1, 14),
(18, 1, 15),
(19, 1, 16),
(20, 2, 5),
(21, 2, 17),
(22, 2, 3),
(23, 2, 11),
(24, 2, 12),
(25, 2, 13),
(26, 2, 15),
(27, 2, 10),
(28, 1, 17),
(29, 1, 18),
(31, 2, 17),
(32, 2, 18),
(33, 2, 19),
(34, 2, 20),
(35, 2, 21),
(36, 2, 22),
(37, 2, 23),
(38, 2, 24),
(39, 1, 19),
(40, 1, 20),
(41, 1, 21),
(42, 1, 22),
(43, 1, 23),
(44, 1, 24);

-- --------------------------------------------------------

--
-- 資料表結構 `shopping_cart`
--

CREATE TABLE `shopping_cart` (
  `cart_id` int(11) NOT NULL COMMENT '購物車編號 (主鍵)',
  `account_id` int(11) NOT NULL COMMENT '帳戶編號 (FK → account.account_id)',
  `created_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT '購物車創建時間',
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '最後更新時間',
  `status` enum('active','abandoned','converted') NOT NULL DEFAULT 'active' COMMENT '購物車狀態: active(活躍), abandoned(已放棄), converted(已轉為訂單)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='購物車主表 - 每個用戶只能有一個活躍的購物車';

--
-- 傾印資料表的資料 `shopping_cart`
--

INSERT INTO `shopping_cart` (`cart_id`, `account_id`, `created_at`, `updated_at`, `status`) VALUES
(1, 2, '2025-06-13 00:38:39', '2025-06-13 01:05:38', 'active'),
(2, 3, '2025-06-13 00:38:39', '2025-06-13 00:38:39', 'active'),
(3, 4, '2025-06-13 00:38:39', '2025-06-13 00:38:39', 'active'),
(4, 1, '2025-06-13 00:56:12', '2025-06-13 00:56:12', 'active');

-- --------------------------------------------------------

--
-- 資料表結構 `user_role`
--

CREATE TABLE `user_role` (
  `id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `user_role`
--

INSERT INTO `user_role` (`id`, `account_id`, `role_id`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 2, 2),
(4, 3, 2),
(5, 4, 2),
(6, 5, 2),
(7, 6, 2),
(8, 7, 2),
(9, 8, 2);

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`account_id`),
  ADD KEY `idx_account_role` (`role_id`);

--
-- 資料表索引 `action`
--
ALTER TABLE `action`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`cart_item_id`),
  ADD UNIQUE KEY `uk_cart_product` (`cart_id`,`product_id`),
  ADD KEY `idx_cart_id` (`cart_id`),
  ADD KEY `idx_product_id` (`product_id`),
  ADD KEY `idx_added_at` (`added_at`),
  ADD KEY `idx_product_added` (`product_id`,`added_at`),
  ADD KEY `idx_cart_updated` (`cart_id`,`updated_at`);

--
-- 資料表索引 `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `idx_account_id` (`account_id`);

--
-- 資料表索引 `order_detail`
--
ALTER TABLE `order_detail`
  ADD PRIMARY KEY (`order_id`,`product_id`),
  ADD KEY `idx_product_id` (`product_id`);

--
-- 資料表索引 `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`product_id`);

--
-- 資料表索引 `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `role_action`
--
ALTER TABLE `role_action`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `action_id` (`action_id`);

--
-- 資料表索引 `shopping_cart`
--
ALTER TABLE `shopping_cart`
  ADD PRIMARY KEY (`cart_id`),
  ADD UNIQUE KEY `uk_account_active_cart` (`account_id`,`status`),
  ADD KEY `idx_account_id` (`account_id`),
  ADD KEY `idx_updated_at` (`updated_at`),
  ADD KEY `idx_status_updated` (`status`,`updated_at`);

--
-- 資料表索引 `user_role`
--
ALTER TABLE `user_role`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_userRole_account` (`account_id`),
  ADD KEY `fk_userRole_role` (`role_id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `account`
--
ALTER TABLE `account`
  MODIFY `account_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `action`
--
ALTER TABLE `action`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `cart_item_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '購物車商品項目編號 (主鍵)';

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '整數型自動遞增主鍵', AUTO_INCREMENT=26;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `product`
--
ALTER TABLE `product`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '商品編號', AUTO_INCREMENT=26;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `role`
--
ALTER TABLE `role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `role_action`
--
ALTER TABLE `role_action`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `shopping_cart`
--
ALTER TABLE `shopping_cart`
  MODIFY `cart_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '購物車編號 (主鍵)', AUTO_INCREMENT=5;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `user_role`
--
ALTER TABLE `user_role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- 已傾印資料表的限制式
--

--
-- 資料表的限制式 `account`
--
ALTER TABLE `account`
  ADD CONSTRAINT `fk_account_role` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON UPDATE CASCADE;

--
-- 資料表的限制式 `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `fk_cartitem_cart` FOREIGN KEY (`cart_id`) REFERENCES `shopping_cart` (`cart_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_cartitem_product` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 資料表的限制式 `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `account` (`account_id`) ON DELETE CASCADE;

--
-- 資料表的限制式 `order_detail`
--
ALTER TABLE `order_detail`
  ADD CONSTRAINT `order_detail_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `order_detail_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON UPDATE CASCADE;

--
-- 資料表的限制式 `role_action`
--
ALTER TABLE `role_action`
  ADD CONSTRAINT `fk_role_action_action` FOREIGN KEY (`action_id`) REFERENCES `action` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_role_action_role` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE;

--
-- 資料表的限制式 `shopping_cart`
--
ALTER TABLE `shopping_cart`
  ADD CONSTRAINT `fk_cart_account` FOREIGN KEY (`account_id`) REFERENCES `account` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 資料表的限制式 `user_role`
--
ALTER TABLE `user_role`
  ADD CONSTRAINT `fk_userRole_account` FOREIGN KEY (`account_id`) REFERENCES `account` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_userRole_role` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
