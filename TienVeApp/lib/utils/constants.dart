// ignore_for_file: constant_identifier_names
import 'package:flutter/material.dart';

class AppColors {
  static const MAIN = Color.fromRGBO(173, 0, 108, 1);
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
  // static const API_URL = 'http://192.168.1.7:3000';
  static const API_URL = 'https://tien-ve-stag-870680f060fb.herokuapp.com';

  /// Thời gian (s) timeout cho một POST request
  static const POST_TIMEOUT = 20;

  /// Thời `gian (s) timeout cho một Multipart POST request
  static const MULTIPART_POST_TIMEOUT = 60;

  static const SUCCESS_MSG_KEY = 'success';
  static const ERR_UNKNOWN_MSG_KEY = 'err_unknown';
}

///Values of this must not contains leading `/`
enum APIRoutes {
  // ========== [START] Auth [START] ==========
  AUTH_LOGIN('auth/login'),
  // ========== [END] Auth [END] ==========

  // ========== [START] Message [START] ==========
  MESSAGE_CREATE('message'),
  MESSAGE_LIST('message');
  // ========== [END] Message [END] ==========

  const APIRoutes(this.value);
  final String value;
}

///Keys of values stored in device storage
enum DeviceStorageKeys {
  ///Device phone number
  DEVICE_PHONE('phone');

  const DeviceStorageKeys(this.value);
  final String value;
}

enum HttpStatuses {
  CONTINUE(100),
  SWITCHING_PROTOCOLS(101),
  PROCESSING(102),
  EARLYHINTS(103),
  OK(200),
  CREATED(201),
  ACCEPTED(202),
  NON_AUTHORITATIVE_INFORMATION(203),
  NO_CONTENT(204),
  RESET_CONTENT(205),
  PARTIAL_CONTENT(206),
  AMBIGUOUS(300),
  MOVED_PERMANENTLY(301),
  FOUND(302),
  SEE_OTHER(303),
  NOT_MODIFIED(304),
  TEMPORARY_REDIRECT(307),
  PERMANENT_REDIRECT(308),
  BAD_REQUEST(400),
  UNAUTHORIZED(401),
  PAYMENT_REQUIRED(402),
  FORBIDDEN(403),
  NOT_FOUND(404),
  METHOD_NOT_ALLOWED(405),
  NOT_ACCEPTABLE(406),
  PROXY_AUTHENTICATION_REQUIRED(407),
  REQUEST_TIMEOUT(408),
  CONFLICT(409),
  GONE(410),
  LENGTH_REQUIRED(411),
  PRECONDITION_FAILED(412),
  PAYLOAD_TOO_LARGE(413),
  URI_TOO_LONG(414),
  UNSUPPORTED_MEDIA_TYPE(415),
  REQUESTED_RANGE_NOT_SATISFIABLE(416),
  EXPECTATION_FAILED(417),
  I_AM_A_TEAPOT(418),
  MISDIRECTED(421),
  UNPROCESSABLE_ENTITY(422),
  FAILED_DEPENDENCY(424),
  PRECONDITION_REQUIRED(428),
  TOO_MANY_REQUESTS(429),
  INTERNAL_SERVER_ERROR(500),
  NOT_IMPLEMENTED(501),
  BAD_GATEWAY(502),
  SERVICE_UNAVAILABLE(503),
  GATEWAY_TIMEOUT(504),
  HTTP_VERSION_NOT_SUPPORTED(505);

  const HttpStatuses(this.value);
  final int value;
}
