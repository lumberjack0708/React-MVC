-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2025-06-07 09:32:23
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
(2, 'C001', 2, 'alice@petdept.com', 'alice123', 'Alice Chen', '高雄市鼓山區美術館路12號', '2001-02-14'),
(3, 'C002', 2, 'bob@petdept.com', 'bob123', 'Bob Wu', '台中市西區公益路123號', '1999-08-23');

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
(3, 'getProducts');

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
(9, 1, '2025-06-07 14:49:57', 'processing');

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
(9, 18, 1);

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
(1, '犬用飼料 2kg', 350.00, 49, 'food', NULL),
(2, '貓抓板', 120.00, 33, 'toy', NULL),
(3, '寵物睡墊', 450.00, 19, 'accessories', NULL),
(4, '鳥用水樽', 80.00, 45, 'accessories', NULL),
(5, '貓砂盆 附蓋', 600.00, 15, 'accessories', NULL),
(6, '狗狗潔牙骨(10入)', 200.00, 60, 'food', NULL),
(7, '小動物跑輪', 300.00, 24, 'toy', NULL),
(8, '貓咪零食 - 鮪魚條', 90.00, 79, 'food', NULL),
(9, '智能餵食器', 1990.00, 10, 'accessories', NULL),
(10, '犬用牽繩 (紅色)', 250.00, 35, 'accessories', NULL),
(11, '寵物洗毛精 500ml', 180.00, 45, 'accessories', NULL),
(12, '貓跳台 四層', 1680.00, 2, 'accessories', NULL),
(13, '狗狗雨衣 (M號)', 420.00, 20, 'accessories', NULL),
(14, '寵物提籃 (小型犬/貓)', 750.00, 2, 'accessories', NULL),
(15, '兔子飼料 1.5kg', 320.00, 18, 'food', NULL),
(16, '狗狗玩具 - 發聲球', 150.00, 50, 'toy', NULL),
(17, '貓用逗貓棒', 90.00, 70, 'toy', NULL),
(18, '倉鼠木屑 (無塵)', 110.00, 39, 'accessories', NULL),
(19, '水龜濾水器', 1350.00, 8, 'accessories', NULL),
(20, '鳥飼料混合包 1kg', 160.00, 28, 'food', NULL);

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
(1, 1, 1),
(2, 2, 2);

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
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `account`
--
ALTER TABLE `account`
  MODIFY `account_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `action`
--
ALTER TABLE `action`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '整數型自動遞增主鍵', AUTO_INCREMENT=10;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `product`
--
ALTER TABLE `product`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '商品編號', AUTO_INCREMENT=24;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `role`
--
ALTER TABLE `role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `role_action`
--
ALTER TABLE `role_action`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- 已傾印資料表的限制式
--

--
-- 資料表的限制式 `account`
--
ALTER TABLE `account`
  ADD CONSTRAINT `fk_account_role` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON UPDATE CASCADE;

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
