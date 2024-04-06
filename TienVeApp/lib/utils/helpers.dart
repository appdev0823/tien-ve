import 'dart:convert';

import 'package:basic_utils/basic_utils.dart';
import 'package:crypto/crypto.dart';
import 'package:flutter/material.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:mobile_number/mobile_number.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:tien_ve/utils/constants.dart';

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

  /// Get device phone number
  static Future<String> getDevicePhoneNumber() async {
    try {
      // Get from local storage first
      final prefs = await SharedPreferences.getInstance();
      final localPhoneNumber = prefs.getString(DeviceStorageKeys.DEVICE_PHONE.value);
      if (localPhoneNumber != null && Helpers.isString(localPhoneNumber)) return localPhoneNumber;

      // Use library to get phone number
      final hasPermission = await MobileNumber.hasPhonePermission;
      if (!hasPermission) {
        await MobileNumber.requestPhonePermission;
      }
      return await MobileNumber.mobileNumber ?? '';
    } catch (e) {
      print(e);
      return '';
    }
  }

  /// Check if device is tablet
  static bool isTablet() {
    bool isTab = false;
    final deviceData = MediaQueryData.fromWindow(WidgetsBinding.instance.window);
    final shortestSide = deviceData.size.shortestSide;
    if (shortestSide > 600) {
      isTab = true;
    } else {
      isTab = false;
    }
    return isTab;
  }

  ///Initialize ScreenUtil
  static void initScreenUtil(BuildContext context) {
    const stdTabletSize = Size(901, 1394); //APEX A10
    const stdPhoneSize = Size(360, 712); //Nokia X5

    // Set standard design size for tablet / phone. ScreenUtil will take care of the rest of responsive works based on these 2 sizes
    ScreenUtil.init(
      context,
      designSize: isTablet() ? stdTabletSize : stdPhoneSize,
      minTextAdapt: true,
      splitScreenMode: true,
    );
  }
}
