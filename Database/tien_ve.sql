/*
 Navicat Premium Data Transfer

 Source Server         : TienVe PROD
 Source Server Type    : MySQL
 Source Server Version : 50735
 Source Host           : 137.59.106.207:3306
 Source Schema         : uibkw03j4feq_tien_ve

 Target Server Type    : MySQL
 Target Server Version : 50735
 File Encoding         : 65001

 Date: 02/04/2024 21:52:46
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for d_bank_accounts
-- ----------------------------
DROP TABLE IF EXISTS `d_bank_accounts`;
CREATE TABLE `d_bank_accounts` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `bank_id` bigint(20) NOT NULL COMMENT 'Mã ngân hàng',
  `user_id` bigint(20) NOT NULL COMMENT 'Mã users',
  `branch_name` varchar(255) NOT NULL COMMENT 'Tên chi nhánh',
  `card_owner` varchar(255) NOT NULL COMMENT 'Tên chủ tài khoản',
  `account_number` varchar(20) NOT NULL COMMENT 'Số tài khoản',
  `name` varchar(255) DEFAULT NULL COMMENT 'Tên gợi nhớ',
  `phone` varchar(10) CHARACTER SET utf8mb4 NOT NULL COMMENT 'Số điện thoại',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '-1: Ngừng kích hoạt, 0: Chưa kích hoạt, 1: Đã kích hoạt',
  `last_message_id` bigint(20) NOT NULL DEFAULT '0' COMMENT 'ID của message cuối cùng liên quan đến tài khoản',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL,
  `updated_date` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for d_debts
-- ----------------------------
DROP TABLE IF EXISTS `d_debts`;
CREATE TABLE `d_debts` (
  `id` varchar(25) NOT NULL COMMENT 'TV-DDMMYY-0000{{user_id}}-0000{{increment}}',
  `user_id` bigint(20) NOT NULL COMMENT 'Mã user tạo công nợ',
  `bank_account_id` bigint(20) NOT NULL COMMENT 'Mã tài khoản ngân hàng nhận tiền',
  `payer_name` varchar(255) NOT NULL COMMENT 'Tên người trả tiền',
  `payer_phone` varchar(10) NOT NULL COMMENT 'SDT người trả tiền',
  `amount` decimal(15,3) NOT NULL COMMENT 'Số tiền nợ',
  `remind_count` int(11) NOT NULL DEFAULT '0' COMMENT 'Số lần nhắc nợ',
  `note` varchar(255) DEFAULT NULL COMMENT 'Ghi chú',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL,
  `updated_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for d_messages
-- ----------------------------
DROP TABLE IF EXISTS `d_messages`;
CREATE TABLE `d_messages` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `address` varchar(255) NOT NULL COMMENT 'Địa chỉ gửi SMS, thường là brandname của các banks',
  `phone` varchar(20) NOT NULL COMMENT 'SDT nhận SMS',
  `body` text NOT NULL COMMENT 'Nội dung tin nhắn',
  `send_date` datetime NOT NULL COMMENT 'Thời gian gửi tin nhắn',
  `receive_date` datetime NOT NULL COMMENT 'Thời gian nhận tin nhắn',
  `amount` decimal(15,3) NOT NULL DEFAULT '0.000' COMMENT 'Số tiền bóc tách được trong nội dung SMS',
  `balance` decimal(15,3) NOT NULL DEFAULT '0.000' COMMENT 'Số dư của tài khoản',
  `sign` tinyint(1) NOT NULL COMMENT 'Biến động tăng (1) / giảm (-1) của tài khoản nhận tiền',
  `debt_id` varchar(25) DEFAULT NULL COMMENT 'TV-DDMMYY-0000{{user_id}}-0000{{increment}}',
  `bank_account_id` bigint(20) NOT NULL DEFAULT '0' COMMENT 'Số tài khoản trích xuất được từ trong SMS',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL,
  `updated_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for d_otps
-- ----------------------------
DROP TABLE IF EXISTS `d_otps`;
CREATE TABLE `d_otps` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `otp` varchar(6) NOT NULL,
  `receive_address` varchar(255) NOT NULL,
  `type` tinyint(1) NOT NULL COMMENT '1: email, 2: phone',
  `expired_date` datetime NOT NULL,
  `is_used` tinyint(1) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL,
  `updated_date` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `otp` (`otp`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for d_remind_messages
-- ----------------------------
DROP TABLE IF EXISTS `d_remind_messages`;
CREATE TABLE `d_remind_messages` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `receiver_name` varchar(255) NOT NULL COMMENT 'Tên người nhận',
  `phone` varchar(20) NOT NULL COMMENT 'SDT nhận SMS',
  `body` text NOT NULL COMMENT 'Nội dung tin nhắn',
  `debt_id` varchar(25) NOT NULL COMMENT 'TV-DDMMYY-0000{{user_id}}-0000{{increment}}',
  `channel_type` tinyint(4) NOT NULL COMMENT '1: Zalo, 2: SMS',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '-1: Thất bại, 0: Đang gửi, 1: Gửi thành công',
  `fail_reason` varchar(255) DEFAULT NULL COMMENT 'Lý do gửi tin nhắn thất bại',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL,
  `updated_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for m_banks
-- ----------------------------
DROP TABLE IF EXISTS `m_banks`;
CREATE TABLE `m_banks` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Mã ngân hàng',
  `brand_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Brand name của ngân hàng',
  `name` varchar(255) NOT NULL COMMENT 'Tên ngân hàng',
  `account_number_start` varchar(100) NOT NULL COMMENT 'String đánh dấu vị trí của số tài khoản trong SMS của ngân hàng',
  `balance_start` varchar(100) NOT NULL COMMENT 'String đánh dấu vị trí của số dư trong SMS của ngân hàng',
  `img_path` varchar(255) NOT NULL COMMENT 'Đường dẫn hình ảnh của ngân hàng',
  `is_deleted` tinyint(4) NOT NULL DEFAULT '1' COMMENT '0: not deleted, 1: deleted',
  `created_date` datetime NOT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of m_banks
-- ----------------------------
BEGIN;
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (1, 'VPBank', 'Ngân hàng Việt Nam Thịnh Vượng', 'TK: ', 'SD:', 'VPBank.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:35');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (2, 'BIDV', 'Ngân hàng Đầu tư và Phát triển Việt Nam', 'TK: ', 'SD:', 'BIDV.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:35');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (3, 'VietinBank', 'Ngân hàng Công thương Việt Nam', 'TK: ', 'SD:', 'VietinBank.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:35');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (4, 'Vietcombank', 'Ngân hàng Ngoại Thương Việt Nam', 'TK: ', 'SD:', 'Vietcombank.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:35');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (5, 'MBBANK', 'Ngân hàng Quân Đội', 'TK: ', 'SD:', 'MBBANK.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:35');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (6, 'Techcombank', 'Ngân hàng Kỹ Thương', 'TK: ', 'SD:', 'Techcombank.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:35');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (7, 'Agribank', 'Ngân hàng NN&PT Nông thôn Việt Nam', 'TK: ', 'SD:', 'Agribank.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:35');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (8, 'ACB', 'Ngân hàng Á Châu', 'TK: ', 'SD:', 'ACB.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:35');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (9, 'SHB', 'Ngân hàng Sài Gòn - Hà Nội', 'TK: ', 'SD:', 'SHB.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:35');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (10, 'VIB', 'Ngân hàng Quốc Tế', 'TK: ', 'SD:', 'VIB.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:35');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (11, 'HDBank', 'Ngân hàng Phát triển Thành phố Hồ Chí Minh', 'TK: ', 'SD:', 'HDBank.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:35');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (12, 'SeABank', 'Ngân hàng Đông Nam Á', 'TK: ', 'SD:', 'SeABank.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:35');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (13, 'VBSP', 'Ngân hàng Chính sách xã hội Việt Nam', 'TK: ', 'SD:', 'VBSP.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:35');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (14, 'Sacombank', 'Ngân hàng Sài Gòn Thương Tín', 'TK: ', 'So du kha dung:', 'Sacombank.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:35');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (15, 'LienVietPostBank', 'Ngân hàng Bưu điện Liên Việt', 'TK: ', 'SD:', 'LienVietPostBank.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:36');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (16, 'MSB', 'Ngân hàng Hàng Hải', 'TK: ', 'SD:', 'MSB.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:36');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (17, 'SCB', 'Ngân hàng Sài Gòn', 'TK: ', 'SD:', 'SCB.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:36');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (18, 'VDB', 'Ngân hàng Phát triển Việt Nam', 'TK: ', 'SD:', 'VDB.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:36');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (19, 'OCB', 'Ngân hàng Phương Đông', 'TK: ', 'SD:', 'OCB.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:36');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (20, 'Eximbank', 'Ngân hàng Xuất Nhập Khẩu', 'TK: ', 'SD:', 'Eximbank.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:36');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (21, 'TPBank', 'Ngân hàng Tiên Phong', 'TK: ', 'SD:', 'TPBank.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:36');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (22, 'PVcomBank', 'Ngân hàng Đại Chúng Việt Nam', 'TK: ', 'SD:', 'PVcomBank.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:36');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (23, 'BacABank', 'Ngân hàng TMCP Bắc Á', 'TK: ', 'SD:', 'BacABank.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:36');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (24, 'Woori', 'Ngân hàng Woori Việt Nam', 'TK: ', 'SD:', 'Woori.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:36');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (25, 'HSBC', 'Ngân hàng HSBC Việt Nam', 'TK: ', 'SD:', 'HSBC.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:36');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (26, 'SCBVL', 'Ngân hàng Standard Chartered Việt Nam', 'TK: ', 'SD:', 'SCBVL.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:36');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (27, 'PBVN', 'Ngân hàng Public Bank Việt Nam', 'TK: ', 'SD:', 'PBVN.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:36');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (28, 'ABBANK', 'Ngân hàng An Bình', 'TK: ', 'SD:', 'ABBANK.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:36');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (29, 'SHBVN', 'Ngân hàng Shinhan Việt Nam', 'TK: ', 'SD:', 'SHBVN.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:36');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (30, 'NCB', 'Ngân hàng Quốc dân', 'TK: ', 'SD:', 'NCB.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:36');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (31, 'VietABank', 'Ngân hàng Việt Á', 'TK: ', 'SD:', 'VietABank.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:36');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (32, 'DongABank', 'Ngân hàng Đông Á', 'TK: ', 'SD:', 'DongABank.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:36');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (33, 'UOB', 'Ngân hàng UOB Việt Nam', 'TK: ', 'SD:', 'UOB.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:37');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (34, 'Vietbank', 'Ngân hàng Việt Nam Thương Tín', 'TK: ', 'SD:', 'Vietbank.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:37');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (35, 'NamABank', 'Ngân hàng Nam Á', 'TK: ', 'SD:', 'NamABank.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:37');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (36, 'ANZVL', 'Ngân hàng ANZ Việt Nam', 'TK: ', 'SD:', 'ANZVL.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:37');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (37, 'OceanBank', 'Ngân hàng Đại Dương', 'TK: ', 'SD:', 'OceanBank.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:37');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (38, 'CIMB', 'Ngân hàng CIMB Việt Nam', 'TK: ', 'SD:', 'CIMB.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:37');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (39, 'VietCapitalBank', 'Ngân hàng Bản Việt', 'TK: ', 'SD:', 'VietCapitalBank.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:37');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (40, 'Kienlongbank', 'Ngân hàng Kiên Long', 'TK: ', 'SD:', 'Kienlongbank.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:37');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (41, 'IVB', 'Ngân hàng Indovina', 'TK: ', 'SD:', 'IVB.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:37');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (42, 'BAOVIETBank', 'Ngân hàng Bảo Việt', 'TK: ', 'SD:', 'BAOVIETBank.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:37');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (43, 'SAIGONBANK', 'Ngân hàng Sài Gòn Công Thương', 'TK: ', 'SD:', 'SAIGONBANK.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:37');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (44, 'Co-opBank', 'Ngân hàng Hợp tác xã Việt Nam', 'TK: ', 'SD:', 'Co-opBank.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:37');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (45, 'GPBank', 'Ngân hàng Dầu khí toàn cầu', 'TK: ', 'SD:', 'GPBank.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:37');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (46, 'VRB', 'Ngân hàng Việt Nga', 'TK: ', 'SD:', 'VRB.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:37');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (47, 'CB', 'Ngân hàng Xây dựng', 'TK: ', 'SD:', 'CB.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:37');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (48, 'PGBank', 'Ngân hàng Xăng dầu Petrolimex', 'TK: ', 'SD:', 'PGBank.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:37');
INSERT INTO `m_banks` (`id`, `brand_name`, `name`, `account_number_start`, `balance_start`, `img_path`, `is_deleted`, `created_date`, `updated_date`) VALUES (49, 'HLBVN', 'Ngân hàng Hong Leong Việt Nam', 'TK: ', 'SD:', 'HLBVN.png', 0, '2023-08-30 00:00:00', '2024-03-15 23:05:37');
COMMIT;

-- ----------------------------
-- Table structure for m_settings
-- ----------------------------
DROP TABLE IF EXISTS `m_settings`;
CREATE TABLE `m_settings` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `field_name` varchar(100) NOT NULL,
  `value` text NOT NULL,
  `note` varchar(300) DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL,
  `updated_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of m_settings
-- ----------------------------
BEGIN;
INSERT INTO `m_settings` (`id`, `field_name`, `value`, `note`, `is_deleted`, `created_date`, `updated_date`) VALUES (1, 'upgrade_note', 'Để nâng cấp premium, hãy liên hệ hotline <strong class=\"text-primary\">093XXXXXXX</strong> để được hướng dẫn và hỗ trợ.', NULL, 0, '2023-10-05 23:35:11', '2023-10-06 00:15:04');
INSERT INTO `m_settings` (`id`, `field_name`, `value`, `note`, `is_deleted`, `created_date`, `updated_date`) VALUES (2, 'remind_message_template', 'Mong {{receiver_name}} có một ngày tốt lành. Xin gửi lời nhắc nhở về việc thanh toán công nợ.\nSố tiền cần thanh toán: {{amount}} VND\nVui lòng thanh toán trước ngày hết hạn.', 'Template nhắc nợ', 0, '2023-10-12 18:07:06', '2023-10-12 22:45:43');
INSERT INTO `m_settings` (`id`, `field_name`, `value`, `note`, `is_deleted`, `created_date`, `updated_date`) VALUES (3, 'app_link', 'https://tienve.cloud/assets/download/tien-ve.apk', 'App Download Link', 0, '2023-10-15 01:19:17', '2023-11-16 22:57:55');
COMMIT;

-- ----------------------------
-- Table structure for m_users
-- ----------------------------
DROP TABLE IF EXISTS `m_users`;
CREATE TABLE `m_users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(10) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `remind_count` int(11) NOT NULL DEFAULT '0' COMMENT 'Số lần nhắc nợ mà user đã gửi',
  `max_remind_count` int(11) NOT NULL DEFAULT '10' COMMENT 'Số lần nhắc nợ nhiều nhất có thể sử dụng',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_date` datetime NOT NULL,
  `updated_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;

SET FOREIGN_KEY_CHECKS = 1;
