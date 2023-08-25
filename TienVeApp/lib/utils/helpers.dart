import 'dart:convert';

import 'package:basic_utils/basic_utils.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:crypto/crypto.dart';
import 'package:mobile_number/mobile_number.dart';

class Helpers {
  ///Check if a string is not blank or null
  static isString(dynamic str) {
    return str != null && !StringUtils.isNullOrEmpty(str.toString()) && str.toString().trim() != "" && str.toString().trim() != "null";
  }

  ///Check if variable is a `List` and not empty
  static isFilledList(dynamic arr) => arr != null && arr is List && arr.isNotEmpty;

  static encodeMd5(String str) {
    if (!Helpers.isString(str)) {
      return "";
    }
    var bytes = utf8.encode(str);
    var md5Hash = md5.convert(bytes);
    return md5Hash.toString();
  }

  static void showLoading() {
    EasyLoading.show();
  }

  static void hideLoading() {
    EasyLoading.dismiss();
  }

  static Future<String> getDevicePhoneNumber() async {
    try {
      final hasPermission = await MobileNumber.hasPhonePermission;
      if (!hasPermission) return '';
      return await MobileNumber.mobileNumber ?? '';
    } catch (e) {
      print(e);
      return '';
    }
  }
}
