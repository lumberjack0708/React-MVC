-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2025-03-23 08:40:35
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
-- 資料庫： `erp`
--

-- --------------------------------------------------------

--
-- 資料表結構 `product`
--

CREATE TABLE `product` (
  `pid` int(11) NOT NULL,
  `p_name` varchar(50) NOT NULL,
  `cost` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `stock` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `product`
--

INSERT INTO `product` (`pid`, `p_name`, `cost`, `price`, `stock`) VALUES
(2, '賓士F1模擬器方向盤', 15000, 45000, 8),
(3, '法拉利2025年式cap帽', 500, 1900, 653),
(4, 'Lewis Hamilton 2020七冠車模', 6000, 16000, 152);

-- --------------------------------------------------------

--
-- 資料表結構 `role`
--

CREATE TABLE `role` (
  `role_id` int(11) NOT NULL,
  `role_name` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `role`
--

INSERT INTO `role` (`role_id`, `role_name`, `created_at`) VALUES
(1, 'root', '2025-03-17 11:47:43'),
(3, '小丑', '2025-03-17 12:56:51'),
(5, '小丑2.1', '2025-03-23 05:15:18');

-- --------------------------------------------------------

--
-- 資料表結構 `supplier`
--

CREATE TABLE `supplier` (
  `sid` int(11) NOT NULL,
  `s_name` varchar(50) NOT NULL,
  `contact` varchar(50) NOT NULL,
  `tel` varchar(10) NOT NULL,
  `address` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `supplier`
--

INSERT INTO `supplier` (`sid`, `s_name`, `contact`, `tel`, `address`) VALUES
(1, '法拉利車隊', 'Fred Vasseur', '0928412945', 'Via Abetone Inferiore, 4, 41053 Maranello MO, 義大利'),
(2, 'Mercedes-AMG Petronas Formula One Team', 'toto wolff', '0952111548', 'Operations Centre, Lauda Drive, Brackley NN13 7BD');

-- --------------------------------------------------------

--
-- 資料表結構 `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `password` varchar(20) NOT NULL,
  `JoinDate` date DEFAULT NULL,
  `address` varchar(50) NOT NULL DEFAULT '不公開',
  `email` varchar(20) NOT NULL,
  `phone` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `user`
--

INSERT INTO `user` (`id`, `name`, `password`, `JoinDate`, `address`, `email`, `phone`) VALUES
(11, 'Checo Perez', 'checo ', '2025-03-11', '墨西哥', 'Perez@gmail.com', '0911284213'),
(12, 'Kimi Antoneli', 'kimi', '2025-03-09', '義大利monza', 'Antoneli@gmail.com', '0912864327'),
(16, 'Charles Leclerc', 'charles', '2025-03-01', '台北市公館路1號', 'charles@gmail.com', '0918234524'),
(44, 'Lewis Hamilton', 'lewis', '2015-02-04', '高雄市大社區中山路245號', 'hamilton@gmail.com', '0975132552'),
(46, 'Lando Norris', 'Lando', '2017-03-17', '高雄市左營區文天路87號', 'Norris@gmail.com', '0904124821'),
(49, 'test', 'test', '2025-02-26', 'test', 'test', 'test');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`pid`);

--
-- 資料表索引 `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`role_id`);

--
-- 資料表索引 `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`sid`);

--
-- 資料表索引 `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `product`
--
ALTER TABLE `product`
  MODIFY `pid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `role`
--
ALTER TABLE `role`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `supplier`
--
ALTER TABLE `supplier`
  MODIFY `sid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
