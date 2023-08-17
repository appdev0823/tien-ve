// ignore_for_file: constant_identifier_names
import 'package:flutter/material.dart';

class AppColors {
  static const MAIN = Color(0xff0e3564);
  static const MAIN_BG = Color(0xffffffff);

  static const RED = Color(0xffdc3545);
  static const BLUE = Color(0xff0d6efd);
  static const GREY = Color(0xff6c757d);
  static const GREEN = Color(0xff198754);
  static const CYAN = Color(0xff17a2b8);

  static const TEXT_BLACK = Color(0xff000000);
  static const TEXT_GRAY = Color(0xff938D8E);
  static const TEXT_WHITE = Color(0xFFFFFFFF);
  static const TEXT_RED = Color(0xFFF6430F);
  static const TEXT_GREEN = Color(0xFF029E0F);
  static const TEXT_BLUE = Color(0xFF07C1FF);
  static const TEXT_YELLOW = Color(0xFFFDAD00);

  static const INPUT_ICON_BG_COLOR = Color(0xffD9D9D9);
  static const INPUT_BORDER_COLOR = Color(0xffced4da);
  static const INPUT_PLACEHOLDER_COLOR = Color(0x00000080);
}

class AppSizes {
  static const SPACING_SMALL = 5.0;
  static const SPACING_MEDIUM = 10.0;
  static const SPACING_LARGE = 15.0;
  static const SPACING_X_LARGE = 20.0;

  static const FS_LG_TITLE = 20.0;
  static const FS_TITLE = 16.0;
  static const FS_CONTENT = 14.0;
  static const FS_SM = 12.0;

  static const ICON_SIZE_MD = 15.0;
  static const ICON_SIZE_LG = 20.0;
  static const ICON_SIZE_XL = 30.0;
  static const ICON_SIZE_XXL = 40.0;

  static const IMG_SIZE_COMMON = 100.0;

  static const BORDER_RADIUS = 5.0;

  static const INPUT_BORDER_WIDTH = 1.0;

  ///Quy định độ bóng mờ (box shadow) chung cho các widget sử dụng `elevation`
  static const ELEVATION_COMMON = 5.0;
}

class CONSTANTS {
  static const API_URL = 'http://192.168.1.9:3000';

  /// Thời gian (s) timeout cho một POST request
  static const POST_TIMEOUT = 20;

  /// Thời `gian (s) timeout cho một Multipart POST request
  static const MULTIPART_POST_TIMEOUT = 60;

  static const ERR_UNKNOWN_MSG_KEY = 'err_unknown';
}

///Values of this must not contains leading `/`
enum APIRoutes {
  // ========== [START] Auth [START] ==========
  AUTH_LOGIN('auth/login'),
  // ========== [END] Auth [END] ==========

  // ========== [START] Message [START] ==========
  MESSAGE_CREATE('message');
  // ========== [END] Message [END] ==========

  const APIRoutes(this.value);
  final String value;
}
