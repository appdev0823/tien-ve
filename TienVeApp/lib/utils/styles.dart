import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:tien_ve/utils/constants.dart';

extension MTextStyle on TextStyle {
  ///Get content text style
  TextStyle content({
    Color? color,
    double? fontSize,
    FontWeight? fontWeight,
    FontStyle? fontStyle,
  }) {
    return TextStyle(
      color: color ?? Colors.black,
      fontFamily: 'assets/fonts/Quicksand.ttf',
      fontSize: fontSize ?? AppSizes.FS_CONTENT.sp,
      fontWeight: fontWeight,
      fontStyle: fontStyle,
    );
  }

  ///Get title text style
  TextStyle title({
    Color? color,
    double? fontSize,
    FontWeight? fontWeight = FontWeight.bold,
  }) {
    return TextStyle(
      color: color ?? Colors.black,
      fontFamily: 'assets/fonts/Quicksand.ttf',
      fontWeight: fontWeight,
      fontSize: fontSize ?? AppSizes.FS_TITLE.sp,
    );
  }

  ///Get placeholder text style
  TextStyle placeholder() {
    return TextStyle(
      color: AppColors.TEXT_GRAY,
      fontFamily: 'assets/fonts/Quicksand.ttf',
      fontSize: AppSizes.FS_CONTENT.sp,
    );
  }
}

extension MInputDecoration on InputDecoration {
  InputDecoration common({
    required String hintText,
    EdgeInsets contentPadding = const EdgeInsets.all(0),
    IconData? icon,
    Widget? suffixIcon,
  }) {
    return icon != null
        ? InputDecoration(
            prefixIcon: Padding(
              padding: const EdgeInsets.all(0),
              child: Icon(icon, color: AppColors.TEXT_GRAY),
            ),
            contentPadding: contentPadding,
            hintText: hintText,
            hintStyle: const TextStyle().placeholder(),
            focusedBorder: OutlineInputBorder(borderSide: BorderSide(width: 1.sp, color: AppColors.TEXT_GRAY)),
            enabledBorder: OutlineInputBorder(borderSide: BorderSide(width: 1.sp, color: AppColors.TEXT_GRAY)),
            filled: true,
            fillColor: AppColors.TEXT_WHITE,
            suffixIcon: suffixIcon,
            errorBorder: OutlineInputBorder(borderSide: BorderSide(width: 1.sp, color: AppColors.RED)),
            focusedErrorBorder: OutlineInputBorder(borderSide: BorderSide(width: 1.sp, color: AppColors.RED)),
          )
        : InputDecoration(
            contentPadding: contentPadding,
            hintText: hintText,
            hintStyle: const TextStyle().placeholder(),
            focusedBorder: OutlineInputBorder(borderSide: BorderSide(width: 1.sp, color: AppColors.TEXT_GRAY)),
            enabledBorder: OutlineInputBorder(borderSide: BorderSide(width: 1.sp, color: AppColors.TEXT_GRAY)),
            filled: true,
            fillColor: AppColors.TEXT_WHITE,
            suffixIcon: suffixIcon,
            errorBorder: OutlineInputBorder(borderSide: BorderSide(width: 1.sp, color: AppColors.RED)),
            focusedErrorBorder: OutlineInputBorder(borderSide: BorderSide(width: 1.sp, color: AppColors.RED)),
          );
  }
}
