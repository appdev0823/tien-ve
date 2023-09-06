import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:tien_ve/utils/constants.dart';

class ToastrService {
  ///Toast success message
  ///
  ///[msgKey] key of `message` group in translation files
  static success({msgKey = CONSTANTS.SUCCESS_MSG_KEY}) {
    Fluttertoast.showToast(
      msg: tr("message.$msgKey"),
      backgroundColor: Colors.green,
      textColor: Colors.white,
      fontSize: 15.sp,
    );
  }

  ///Toast error message
  ///
  ///[msgKey] key of `message` group in translation files
  ///
  ///[showFull] `true` => Hiện hoàn toàn message mà ko translate
  static error({msgKey = CONSTANTS.ERR_UNKNOWN_MSG_KEY, showFull = false}) {
    Fluttertoast.showToast(
      msg: !showFull ? tr("message.$msgKey") : msgKey,
      backgroundColor: Colors.red,
      textColor: Colors.white,
      fontSize: 15.sp,
    );
  }
}
