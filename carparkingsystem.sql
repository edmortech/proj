-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 02, 2025 at 01:40 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `carparkingsystem`
--

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `location_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `zip_code` varchar(10) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `contact_phone` varchar(20) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `parking_type` enum('garage','lot','street') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`location_id`, `name`, `address`, `city`, `state`, `zip_code`, `latitude`, `longitude`, `description`, `contact_phone`, `user_id`, `parking_type`) VALUES
(1, 'Nairobi', 'Kenyatta Avenue', 'Nairobi city', 'Nairobi County', '00100', -1.28638900, 36.81722300, 'Secure parking in the heart of Nairobi', '+254712345678', NULL, 'garage'),
(2, 'Mombasa', 'Moi Avenue', 'Mombasa', 'Mombasa County', '80100', -4.04347700, 39.66820600, 'Spacious parking near the beach', '+254723456789', NULL, 'lot'),
(3, 'Kisumu', 'Oginga Odinga Street', 'Kisumu', 'Kisumu County', '40100', -0.10220600, 34.76171100, 'Lake-side parking with 24/7 security', '+254734567890', NULL, 'street'),
(4, 'Nakuru', 'Mburu Gichua Road', 'Nakuru', 'Nakuru County', '20100', -0.30309900, 36.08002600, 'Convenient parking near CBD', '+254745678901', NULL, 'garage'),
(5, 'Eldoret', 'Oloo Street', 'Eldoret', 'Uasin Gishu County', '30100', 0.51427700, 35.26977900, 'Secure parking in Eldoret CBD', '+254756789012', NULL, 'lot'),
(6, 'Thika', 'Uhuru Street', 'Thika', 'Kiambu County', '01000', -1.03326200, 37.06932800, 'Safe and affordable parking', '+254767890123', NULL, 'street'),
(7, 'Machakos', 'Syokimau Avenue', 'Machakos', 'Machakos County', '90100', -1.51768300, 37.26341400, 'Spacious lot near town center', '+254778901234', NULL, 'garage'),
(8, 'Nyeri', 'Gakere Road', 'Nyeri', 'Nyeri County', '10100', -0.41689800, 36.95187400, 'Well-lit and secure parking', '+254789012345', NULL, 'lot'),
(9, 'Meru', 'Njuri Ncheke Street', 'Meru', 'Meru County', '60200', 0.04713800, 37.64980300, 'Near Meru market, 24/7 surveillance', '+254790123456', NULL, 'street'),
(12, 'Garissa', 'Posta Road', 'Garissa', 'Garissa County', '70100', -0.45500000, 39.64600000, 'Secure parking near town center', '+254711223344', NULL, 'lot'),
(13, 'Wajir', 'Government Road', 'Wajir', 'Wajir County', '70200', 1.74700000, 40.05700000, 'Spacious parking area', '+254722334455', NULL, 'garage'),
(14, 'Mandera', 'Main Street', 'Mandera', 'Mandera County', '70300', 3.93800000, 41.85600000, 'Safe parking near CBD', '+254733445566', NULL, 'street'),
(15, 'Marsabit', 'Hospital Road', 'Marsabit', 'Marsabit County', '60500', 2.32700000, 37.98900000, '24-hour parking facility', '+254744556677', NULL, 'garage'),
(16, 'Isiolo', 'Market Road', 'Isiolo', 'Isiolo County', '60300', 0.35400000, 37.58200000, 'Secure parking near bus station', '+254755667788', NULL, 'lot'),
(17, 'Embu', 'Kenyatta Street', 'Embu', 'Embu County', '60100', -0.53900000, 37.45900000, 'Affordable and secure parking', '+254766778899', NULL, 'street'),
(18, 'Kerugoya Town', 'Kutus Road', 'Kerugoya', 'Kirinyaga County', '10300', -0.49800000, 37.28000000, 'Spacious lot for private vehicles', '+254777889900', NULL, 'garage'),
(19, 'Chuka Town Parking', 'Chuka Market', 'Chuka', 'Tharaka Nithi County', '60400', -0.33300000, 37.64500000, 'Well-lit and secure parking', '+254788990011', NULL, 'lot'),
(20, 'Nanyuki', 'CBD Road', 'Nanyuki', 'Laikipia County', '10400', 0.01300000, 37.07200000, '24/7 parking services', '+254799001122', NULL, 'street'),
(21, 'Kutus', 'kutus upper', 'kutus', 'kirinyaga county', '10300', 99.99999999, 999.99999999, 'safety guaranteed', '11111111111', NULL, 'garage'),
(22, 'Nanyuki', '1 avenue', 'Nanyuki', 'Laikipia county', '1400', 0.00000000, 0.00000000, '24/7 parking services', '22222222', NULL, 'lot');

-- --------------------------------------------------------

--
-- Table structure for table `logs`
--

CREATE TABLE `logs` (
  `log_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `parkingslots`
--

CREATE TABLE `parkingslots` (
  `slot_id` int(11) NOT NULL,
  `location_id` int(11) DEFAULT NULL,
  `lot_number` varchar(50) DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `parkingslots`
--

INSERT INTO `parkingslots` (`slot_id`, `location_id`, `lot_number`, `is_available`) VALUES
(1, 1, 'A1', 1),
(2, 1, 'A2', 1),
(3, 2, 'B1', 0),
(4, 2, 'B2', 1),
(5, 3, 'C1', 1),
(6, 3, 'C2', 0),
(7, 4, 'D1', 1),
(8, 4, 'D2', 1),
(9, 5, 'E1', 0),
(10, 5, 'E2', 1),
(11, 6, 'F1', 1),
(12, 6, 'F2', 0),
(13, 7, 'G1', 1),
(14, 7, 'G2', 1),
(15, 8, 'H1', 0),
(16, 8, 'H2', 1),
(17, 9, 'I1', 1),
(18, 9, 'I2', 0),
(21, 3, 'c3', 1),
(22, 1, 'A3', 1),
(23, 1, 'A4', 1),
(24, 1, 'Nairobi-G3', 1),
(25, 1, 'Nairobi-G4', 1),
(26, 1, 'Nairobi-G5', 1),
(28, 4, 'Nakuru-G2', 1),
(29, 4, 'Nakuru-G3', 1),
(30, 4, 'Nakuru-G4', 1),
(31, 4, 'Nakuru-G5', 1),
(32, 7, 'Machakos-G1', 1),
(33, 7, 'Machakos-G2', 1),
(34, 7, 'Machakos-G3', 1),
(35, 7, 'Machakos-G4', 1),
(36, 7, 'Machakos-G5', 1),
(37, 13, 'Wajir-G1', 1),
(38, 13, 'Wajir-G2', 1),
(39, 13, 'Wajir-G3', 1),
(40, 13, 'Wajir-G4', 1),
(41, 13, 'Wajir-G5', 1),
(42, 15, 'Marsabit-G1', 1),
(43, 15, 'Marsabit-G2', 1),
(44, 15, 'Marsabit-G3', 1),
(45, 15, 'Marsabit-G4', 1),
(46, 15, 'Marsabit-G5', 1),
(47, 18, 'Kerugoya Town-G1', 1),
(48, 18, 'Kerugoya Town-G2', 1),
(49, 18, 'Kerugoya Town-G3', 1),
(50, 18, 'Kerugoya Town-G4', 1),
(51, 18, 'Kerugoya Town-G5', 1),
(53, 2, 'Mombasa-L1', 1),
(54, 2, 'Mombasa-L2', 1),
(55, 2, 'Mombasa-L3', 1),
(56, 2, 'Mombasa-L4', 1),
(57, 2, 'Mombasa-L5', 1),
(58, 5, 'Eldoret-L1', 1),
(59, 5, 'Eldoret-L2', 1),
(60, 5, 'Eldoret-L3', 1),
(61, 5, 'Eldoret-L4', 1),
(62, 5, 'Eldoret-L5', 1),
(63, 8, 'Nyeri-L1', 1),
(64, 8, 'Nyeri-L2', 1),
(65, 8, 'Nyeri-L3', 1),
(66, 8, 'Nyeri-L4', 1),
(67, 8, 'Nyeri-L5', 1),
(68, 12, 'Garissa-L1', 1),
(69, 12, 'Garissa-L2', 1),
(70, 12, 'Garissa-L3', 1),
(71, 12, 'Garissa-L4', 1),
(72, 12, 'Garissa-L5', 1),
(73, 16, 'Isiolo-L1', 1),
(74, 16, 'Isiolo-L2', 1),
(75, 16, 'Isiolo-L3', 1),
(76, 16, 'Isiolo-L4', 1),
(77, 16, 'Isiolo-L5', 1),
(78, 19, 'Chuka Town Parking-L1', 1),
(79, 19, 'Chuka Town Parking-L2', 1),
(80, 19, 'Chuka Town Parking-L3', 1),
(81, 19, 'Chuka Town Parking-L4', 1),
(82, 19, 'Chuka Town Parking-L5', 1),
(84, 3, 'Kisumu-S1', 1),
(85, 3, 'Kisumu-S2', 1),
(86, 3, 'Kisumu-S3', 1),
(87, 3, 'Kisumu-S4', 1),
(88, 3, 'Kisumu-S5', 1),
(89, 6, 'Thika-S1', 1),
(90, 6, 'Thika-S2', 1),
(91, 6, 'Thika-S3', 1),
(92, 6, 'Thika-S4', 1),
(93, 6, 'Thika-S5', 1),
(94, 9, 'Meru-S1', 1),
(95, 9, 'Meru-S2', 1),
(96, 9, 'Meru-S3', 1),
(97, 9, 'Meru-S4', 1),
(98, 9, 'Meru-S5', 1),
(99, 14, 'Mandera-S1', 1),
(100, 14, 'Mandera-S2', 1),
(101, 14, 'Mandera-S3', 1),
(102, 14, 'Mandera-S4', 1),
(103, 14, 'Mandera-S5', 1),
(104, 17, 'Embu-S1', 1),
(105, 17, 'Embu-S2', 1),
(106, 17, 'Embu-S3', 1),
(107, 17, 'Embu-S4', 1),
(108, 17, 'Embu-S5', 1),
(109, 20, 'S1', 1),
(110, 20, 'S2', 1),
(111, 20, 'S3', 1),
(112, 20, 'S4', 1),
(113, 20, 'S5', 1),
(115, 21, 'KT1', 1),
(116, 22, 'NY2', 1);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `reservation_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_status` varchar(50) NOT NULL,
  `payment_date` datetime NOT NULL,
  `paymethod_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`payment_id`, `user_id`, `reservation_id`, `amount`, `payment_status`, `payment_date`, `paymethod_id`) VALUES
(19, 15, 30, 4900.00, 'success', '2025-03-07 14:47:24', 1),
(20, 15, 31, 4900.00, 'success', '2025-03-07 14:47:38', 2),
(21, 15, 32, 20.00, 'success', '2025-03-08 15:15:19', 19),
(22, 15, 33, 25.00, 'success', '2025-03-08 15:15:29', 19),
(23, 15, 34, 50.00, 'success', '2025-03-09 11:21:36', 2),
(25, 15, 36, 1527.50, 'success', '2025-03-10 17:13:33', 3),
(26, 15, 37, 60.00, 'success', '2025-03-10 18:21:53', 19),
(38, 22, 49, 60.00, 'success', '2025-03-11 11:08:24', 29),
(39, 15, 50, 60.00, 'success', '2025-03-18 19:16:01', 19),
(40, 22, 51, 816.00, 'success', '2025-03-23 08:45:50', 29),
(41, 22, 52, 60.00, 'success', '2025-03-23 08:48:15', 29),
(42, 22, 53, 34.00, 'success', '2025-03-23 08:50:03', 29),
(43, 16, 54, 40.00, 'success', '2025-03-23 09:04:20', 6),
(44, 22, 55, 220.00, 'success', '2025-03-23 19:09:03', 29);

-- --------------------------------------------------------

--
-- Table structure for table `payment_methods`
--

CREATE TABLE `payment_methods` (
  `paymethod_id` int(11) NOT NULL,
  `method_name` varchar(100) NOT NULL,
  `provider` varchar(100) DEFAULT NULL,
  `account_number` varchar(255) DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment_methods`
--

INSERT INTO `payment_methods` (`paymethod_id`, `method_name`, `provider`, `account_number`, `expiry_date`, `created_at`, `user_id`) VALUES
(1, 'Credit Card', 'Visa', '11184', '2026-12-31', '2025-03-03 19:21:14', 15),
(2, 'Mobile Money', 'M-Pesa', '5671', NULL, '2025-03-03 19:21:14', 15),
(3, 'PayPal', 'PayPal', 'user15@example.com', NULL, '2025-03-03 19:21:14', 15),
(4, 'Credit Card', 'MasterCard', '**** **** **** 2222', '2025-11-30', '2025-03-03 19:21:14', 16),
(5, 'Mobile Money', 'Airtel Money', '254723456789', NULL, '2025-03-03 19:21:14', 16),
(6, 'Bank Transfer', 'Equity Bank', 'EQTY-0011223344', NULL, '2025-03-03 19:21:14', 16),
(19, 'Mobile Money', 'M-Pesa (Kenya)', 'jjhjukiiukjkiltiuyjyh', NULL, '2025-03-07 14:13:12', 15),
(20, 'Mobile Money', 'M-Pesa (Kenya)', 'rtrerres', NULL, '2025-03-07 14:25:19', 15),
(22, 'Mobile Money', 'M-Pesa (Kenya)', '767578787654545', NULL, '2025-03-10 12:22:16', 15),
(23, 'Mobile Money', 'M-Pesa (Kenya)', '767578787654545', NULL, '2025-03-10 12:22:32', 15),
(24, 'Mobile Money', 'M-Pesa (Kenya)', '767578787654545', NULL, '2025-03-10 12:22:33', 15),
(25, 'Mobile Money', 'M-Pesa (Kenya)', '767578787654545', NULL, '2025-03-10 12:22:33', 15),
(29, 'Mobile Money', 'M-Pesa (Kenya)', '222312332322', NULL, '2025-03-10 21:20:07', 22),
(30, 'Mobile Money', 'M-Pesa (Kenya)', '7777777777777', NULL, '2025-03-23 05:40:53', 22);

-- --------------------------------------------------------

--
-- Table structure for table `prices`
--

CREATE TABLE `prices` (
  `price_id` int(11) NOT NULL,
  `slot_id` int(11) DEFAULT NULL,
  `hourly` decimal(5,2) DEFAULT NULL,
  `monthly` decimal(7,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `prices`
--

INSERT INTO `prices` (`price_id`, `slot_id`, `hourly`, `monthly`) VALUES
(1, NULL, 50.00, 5000.00),
(2, NULL, 50.00, 5500.00),
(3, NULL, 55.00, 4500.00),
(4, NULL, 65.00, 5200.00),
(5, 5, 40.00, 4000.00),
(6, 6, 50.00, 4800.00),
(7, 7, 65.00, 6000.00),
(8, 8, 70.00, 6500.00),
(9, 9, 55.00, 5300.00),
(10, 10, 60.00, 5800.00),
(11, 11, 50.00, 4900.00),
(12, 12, 45.00, 4600.00),
(13, 13, 55.00, 5000.00),
(14, 14, 65.00, 6200.00),
(15, 15, 40.00, 4000.00),
(16, 16, 50.00, 4700.00),
(17, 17, 60.00, 5500.00),
(18, 18, 70.00, 7000.00),
(21, 115, 30.00, 3000.00),
(22, 109, 34.00, 5434.00),
(23, 110, 43.00, 4000.00),
(24, 111, 45.00, 4545.00),
(25, 112, 55.00, 5000.00),
(26, 113, 35.00, 4500.00),
(27, 116, 40.00, 5000.00);

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `reservation_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `slot_id` int(11) DEFAULT NULL,
  `enter_after` time DEFAULT NULL,
  `exit_before` time DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `package_type` enum('hourly','monthly') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`reservation_id`, `user_id`, `slot_id`, `enter_after`, `exit_before`, `total_price`, `created_at`, `start_date`, `end_date`, `package_type`) VALUES
(30, 15, 11, '00:00:00', '00:30:00', 4900.00, '2025-03-07 11:47:24', '2025-03-18', '2025-03-18', 'monthly'),
(31, 15, 11, '00:00:00', '00:30:00', 4900.00, '2025-03-07 11:47:38', '2025-03-18', '2025-03-19', 'monthly'),
(32, 15, 5, '00:30:00', '01:00:00', 20.00, '2025-03-08 12:15:19', '2025-03-18', '2025-03-18', 'hourly'),
(33, 15, 6, '00:30:00', '01:00:00', 25.00, '2025-03-08 12:15:29', '2025-03-18', '2025-03-18', 'hourly'),
(34, 15, 11, '22:00:00', '23:00:00', 50.00, '2025-03-09 08:21:36', '2025-03-18', '2025-03-18', 'hourly'),
(36, 15, 7, '01:00:00', '00:30:00', 1527.50, '2025-03-10 14:13:33', '2025-03-26', '2025-03-27', 'hourly'),
(37, 15, 5, '00:30:00', '02:00:00', 60.00, '2025-03-10 15:21:53', '2025-03-26', '2025-03-26', 'hourly'),
(49, 22, 5, '00:00:00', '01:30:00', 60.00, '2025-03-11 08:08:24', '2025-03-20', '2025-03-20', 'hourly'),
(50, 15, 17, '00:30:00', '01:30:00', 60.00, '2025-03-18 16:16:01', '2025-03-25', '2025-03-25', 'hourly'),
(51, 22, 109, '01:00:00', '01:00:00', 816.00, '2025-03-23 05:45:50', '2025-03-26', '2025-03-27', 'hourly'),
(52, 22, 17, '00:00:00', '01:00:00', 60.00, '2025-03-23 05:48:15', '2025-03-27', '2025-03-27', 'hourly'),
(53, 22, 109, '00:00:00', '01:00:00', 34.00, '2025-03-23 05:50:03', '2025-03-25', '2025-03-25', 'hourly'),
(54, 16, 116, '00:00:00', '01:00:00', 40.00, '2025-03-23 06:04:20', '2025-03-25', '2025-03-25', 'hourly'),
(55, 22, 116, '01:00:00', '06:30:00', 220.00, '2025-03-23 16:09:03', '2025-03-27', '2025-03-27', 'hourly');

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `ticket_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `reservation_id` int(11) NOT NULL,
  `ticket_content` text NOT NULL,
  `ticket_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`ticket_id`, `user_id`, `reservation_id`, `ticket_content`, `ticket_date`) VALUES
(9, 15, 32, '\n   <!DOCTYPE html>\n   <html>\n   <head>\n       <title>Parking Ticket</title>\n   </head>\n   <body>\n       <h1>Parking Ticket</h1>\n       <p><strong>Reservation ID:</strong> 32</p>\n       <p><strong>Lot Number:</strong> C1</p>\n       <p><strong>Start Date:</strong> Tue Mar 18 2025 00:00:00 GMT+0300 (East Africa Time)</p>\n       <p><strong>End Date:</strong> Tue Mar 18 2025 00:00:00 GMT+0300 (East Africa Time)</p>\n       <p><strong>User:</strong> Moris murwng (kimathimoris@gmail.com)</p>\n       <div id=\"qrcode\"></div>\n   </body>\n   </html>\n   ', '2025-03-08 12:15:19'),
(10, 15, 33, '\n   <!DOCTYPE html>\n   <html>\n   <head>\n       <title>Parking Ticket</title>\n   </head>\n   <body>\n       <h1>Parking Ticket</h1>\n       <p><strong>Reservation ID:</strong> 33</p>\n       <p><strong>Lot Number:</strong> C2</p>\n       <p><strong>Start Date:</strong> Tue Mar 18 2025 00:00:00 GMT+0300 (East Africa Time)</p>\n       <p><strong>End Date:</strong> Tue Mar 18 2025 00:00:00 GMT+0300 (East Africa Time)</p>\n       <p><strong>User:</strong> Moris murwng (kimathimoris@gmail.com)</p>\n       <div id=\"qrcode\"></div>\n   </body>\n   </html>\n   ', '2025-03-08 12:15:29'),
(11, 15, 34, '\n   <!DOCTYPE html>\n   <html>\n   <head>\n       <title>Parking Ticket</title>\n   </head>\n   <body>\n       <h1>Parking Ticket</h1>\n       <p><strong>Reservation ID:</strong> 34</p>\n       <p><strong>Lot Number:</strong> F1</p>\n       <p><strong>Start Date:</strong> Tue Mar 18 2025 00:00:00 GMT+0300 (East Africa Time)</p>\n       <p><strong>End Date:</strong> Tue Mar 18 2025 00:00:00 GMT+0300 (East Africa Time)</p>\n       <p><strong>User:</strong> Moris murwng (kimathimoris@gmail.com)</p>\n       <div id=\"qrcode\"></div>\n   </body>\n   </html>\n   ', '2025-03-09 08:21:36'),
(13, 15, 36, '\n   <!DOCTYPE html>\n   <html>\n   <head>\n       <title>Parking Ticket</title>\n   </head>\n   <body>\n       <h1>Parking Ticket</h1>\n       <p><strong>Reservation ID:</strong> 36</p>\n       <p><strong>Lot Number:</strong> D1</p>\n       <p><strong>Start Date:</strong> Wed Mar 26 2025 00:00:00 GMT+0300 (East Africa Time)</p>\n       <p><strong>End Date:</strong> Thu Mar 27 2025 00:00:00 GMT+0300 (East Africa Time)</p>\n       <p><strong>User:</strong> Moris murangiri (kimathimoris@gmail.com)</p>\n       <div id=\"qrcode\"></div>\n   </body>\n   </html>\n   ', '2025-03-10 14:13:33'),
(14, 15, 37, '\n   <!DOCTYPE html>\n   <html>\n   <head>\n       <title>Parking Ticket</title>\n   </head>\n   <body>\n       <h1>Parking Ticket</h1>\n       <p><strong>Reservation ID:</strong> 37</p>\n       <p><strong>Lot Number:</strong> C1</p>\n       <p><strong>Start Date:</strong> Wed Mar 26 2025 00:00:00 GMT+0300 (East Africa Time)</p>\n       <p><strong>End Date:</strong> Wed Mar 26 2025 00:00:00 GMT+0300 (East Africa Time)</p>\n       <p><strong>User:</strong> Moris murangiri (kimathimoris@gmail.com)</p>\n       <div id=\"qrcode\"></div>\n   </body>\n   </html>\n   ', '2025-03-10 15:21:53'),
(26, 22, 49, '\n   <!DOCTYPE html>\n   <html>\n   <head>\n       <title>Parking Ticket</title>\n   </head>\n   <body>\n       <h1>Parking Ticket</h1>\n       <p><strong>Reservation ID:</strong> 49</p>\n       <p><strong>Lot Number:</strong> C1</p>\n       <p><strong>Start Date:</strong> Thu Mar 20 2025 00:00:00 GMT+0300 (East Africa Time)</p>\n       <p><strong>End Date:</strong> Thu Mar 20 2025 00:00:00 GMT+0300 (East Africa Time)</p>\n       <p><strong>User:</strong> e (edtech@gmail.com)</p>\n       <div id=\"qrcode\"></div>\n   </body>\n   </html>\n   ', '2025-03-11 08:08:24'),
(27, 15, 50, '\n   <!DOCTYPE html>\n   <html>\n   <head>\n       <title>Parking Ticket</title>\n   </head>\n   <body>\n       <h1>Parking Ticket</h1>\n       <p><strong>Reservation ID:</strong> 50</p>\n       <p><strong>Lot Number:</strong> I1</p>\n       <p><strong>Start Date:</strong> Tue Mar 25 2025 00:00:00 GMT+0300 (East Africa Time)</p>\n       <p><strong>End Date:</strong> Tue Mar 25 2025 00:00:00 GMT+0300 (East Africa Time)</p>\n       <p><strong>User:</strong> Moris murangiri (kimathimoris@gmail.com)</p>\n       <div id=\"qrcode\"></div>\n   </body>\n   </html>\n   ', '2025-03-18 16:16:01'),
(28, 22, 51, '\n   <!DOCTYPE html>\n   <html>\n   <head>\n       <title>Parking Ticket</title>\n   </head>\n   <body>\n       <h1>Parking Ticket</h1>\n       <p><strong>Reservation ID:</strong> 51</p>\n       <p><strong>Lot Number:</strong> S1</p>\n       <p><strong>Start Date:</strong> Wed Mar 26 2025 00:00:00 GMT+0300 (East Africa Time)</p>\n       <p><strong>End Date:</strong> Thu Mar 27 2025 00:00:00 GMT+0300 (East Africa Time)</p>\n       <p><strong>User:</strong> e (edtech@gmail.com)</p>\n       <div id=\"qrcode\"></div>\n   </body>\n   </html>\n   ', '2025-03-23 05:45:50'),
(29, 22, 52, '\n   <!DOCTYPE html>\n   <html>\n   <head>\n       <title>Parking Ticket</title>\n   </head>\n   <body>\n       <h1>Parking Ticket</h1>\n       <p><strong>Reservation ID:</strong> 52</p>\n       <p><strong>Lot Number:</strong> I1</p>\n       <p><strong>Start Date:</strong> Thu Mar 27 2025 00:00:00 GMT+0300 (East Africa Time)</p>\n       <p><strong>End Date:</strong> Thu Mar 27 2025 00:00:00 GMT+0300 (East Africa Time)</p>\n       <p><strong>User:</strong> e (edtech@gmail.com)</p>\n       <div id=\"qrcode\"></div>\n   </body>\n   </html>\n   ', '2025-03-23 05:48:15'),
(30, 22, 53, '\n   <!DOCTYPE html>\n   <html>\n   <head>\n       <title>Parking Ticket</title>\n   </head>\n   <body>\n       <h1>Parking Ticket</h1>\n       <p><strong>Reservation ID:</strong> 53</p>\n       <p><strong>Lot Number:</strong> S1</p>\n       <p><strong>Start Date:</strong> Tue Mar 25 2025 00:00:00 GMT+0300 (East Africa Time)</p>\n       <p><strong>End Date:</strong> Tue Mar 25 2025 00:00:00 GMT+0300 (East Africa Time)</p>\n       <p><strong>User:</strong> e (edtech@gmail.com)</p>\n       <div id=\"qrcode\"></div>\n   </body>\n   </html>\n   ', '2025-03-23 05:50:03'),
(31, 16, 54, '\n   <!DOCTYPE html>\n   <html>\n   <head>\n       <title>Parking Ticket</title>\n   </head>\n   <body>\n       <h1>Parking Ticket</h1>\n       <p><strong>Reservation ID:</strong> 54</p>\n       <p><strong>Lot Number:</strong> NY2</p>\n       <p><strong>Start Date:</strong> Tue Mar 25 2025 00:00:00 GMT+0300 (East Africa Time)</p>\n       <p><strong>End Date:</strong> Tue Mar 25 2025 00:00:00 GMT+0300 (East Africa Time)</p>\n       <p><strong>User:</strong> Moris murangiri (kimathimoriss@gmail.com)</p>\n       <div id=\"qrcode\"></div>\n   </body>\n   </html>\n   ', '2025-03-23 06:04:20'),
(32, 22, 55, '\n   <!DOCTYPE html>\n   <html>\n   <head>\n       <title>Parking Ticket</title>\n   </head>\n   <body>\n       <h1>Parking Ticket</h1>\n       <p><strong>Reservation ID:</strong> 55</p>\n       <p><strong>Lot Number:</strong> NY2</p>\n       <p><strong>Start Date:</strong> Thu Mar 27 2025 00:00:00 GMT+0300 (East Africa Time)</p>\n       <p><strong>End Date:</strong> Thu Mar 27 2025 00:00:00 GMT+0300 (East Africa Time)</p>\n       <p><strong>User:</strong> e (edtech@gmail.com)</p>\n       <div id=\"qrcode\"></div>\n   </body>\n   </html>\n   ', '2025-03-23 16:09:03');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `full_names` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `full_names`, `email`, `phone_number`, `password`, `role`) VALUES
(15, 'moris', 'Moris murangiri', 'kimathimoris@gmail.com', '0752254291', '$2b$10$.DWmoWB9QJfLhxCYuWROweysBYw1fv0WYGZW0nhlbXq8sgFT/LfwO', 'user'),
(16, 'Admin', 'Moris murangiri', 'kimathimoriss@gmail.com', '0752254222', '$2b$10$lv2wlPFpQSZpX9SUWYeZMOZ2IFw7ZIqE1Izp6bH9jeUaJ8pSiAnZe', 'admin'),
(22, 'ed', 'e', 'edtech@gmail.com', '0712345678', '$2b$10$okNxJ.fTYB7a5utVNc.K3.eBGCr.BDc.8wC4AeR6iR9JgNdS3kGY.', 'user'),
(25, 'edpark', 'ed park', 'edpark060@gmail.com', '0111111111', '$2b$10$VItT4Z4Ok6hdpB.0tUyjLO.MtiVrpEMrCNTW2C/3K44o4QT8JVCuS', 'user'),
(26, 'eedpark', 'ed park', 'eedpark@gmail.com', '1111111111', '$2b$10$KGLORblsIFhyNbNnBJD/5.Z/zPHu05owx.GNjipsLgCDrQSi6DzK6', 'user'),
(27, 'mmoris', 'mmoris kim', 'mmorkim@gmail.com', '6464738726', '$2b$10$RyyQWRDEijop0O/Cz747MOio5xJ6erFDaJPXUjMqlwXII1wiap66a', 'user'),
(29, 'Mungai', 'mungai brian', 'mungaibrain22@gmail.com', '0106560487', '$2b$10$HkG/X.Opcad9gUqRSuY22uRsbI/SAP1SHpIV7OPY7PS37g9UVLoAW', 'user'),
(30, 'dave', 'dave kim', 'davekim@gmail.com', '1111333333', '$2b$10$XciZTS4l8BpoPxIOM1tkmesyhnYq/0aQkgs8nt24D8802XO8VKhry', 'user'),
(31, 'davej', 'dave j', 'davej@gmail.com', '4433333355', '$2b$10$wwa5rmPKd10tFOkWRIaFoOc4ZE24CKZKT8vXLa3fEEkKC5pZdHmcm', 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`location_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `parkingslots`
--
ALTER TABLE `parkingslots`
  ADD PRIMARY KEY (`slot_id`),
  ADD KEY `location_id` (`location_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `reservation_id` (`reservation_id`),
  ADD KEY `paymethod_id` (`paymethod_id`),
  ADD KEY `idx_user_id` (`user_id`);

--
-- Indexes for table `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD PRIMARY KEY (`paymethod_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `prices`
--
ALTER TABLE `prices`
  ADD PRIMARY KEY (`price_id`),
  ADD UNIQUE KEY `slot_id` (`slot_id`);

--
-- Indexes for table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`reservation_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `slot_id` (`slot_id`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`ticket_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `reservation_id` (`reservation_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `location_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `logs`
--
ALTER TABLE `logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `parkingslots`
--
ALTER TABLE `parkingslots`
  MODIFY `slot_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=117;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `paymethod_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `prices`
--
ALTER TABLE `prices`
  MODIFY `price_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `reservation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `ticket_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `locations`
--
ALTER TABLE `locations`
  ADD CONSTRAINT `locations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

--
-- Constraints for table `logs`
--
ALTER TABLE `logs`
  ADD CONSTRAINT `logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `parkingslots`
--
ALTER TABLE `parkingslots`
  ADD CONSTRAINT `parkingslots_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `locations` (`location_id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`reservation_id`),
  ADD CONSTRAINT `payments_ibfk_3` FOREIGN KEY (`paymethod_id`) REFERENCES `payment_methods` (`paymethod_id`);

--
-- Constraints for table `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD CONSTRAINT `payment_methods_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `prices`
--
ALTER TABLE `prices`
  ADD CONSTRAINT `prices_ibfk_1` FOREIGN KEY (`slot_id`) REFERENCES `parkingslots` (`slot_id`) ON DELETE CASCADE;

--
-- Constraints for table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`slot_id`) REFERENCES `parkingslots` (`slot_id`) ON DELETE CASCADE;

--
-- Constraints for table `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`reservation_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
