import 'package:flutter/material.dart';
import 'package:tien_ve/utils/constants.dart';

class ThemeProvider {
  // Define app theme here
  static ThemeData defaultTheme = ThemeData.light().copyWith(
    textTheme: ThemeData.light().textTheme.apply(fontFamily: 'Quicksand'),
    primaryTextTheme: ThemeData.light().textTheme.apply(fontFamily: 'Quicksand'),

    // Can't use `.sp` here because it is unable to get the size of device at this time
    tabBarTheme: ThemeData.light().tabBarTheme.copyWith(
          labelColor: AppColors.TEXT_BLACK,
          unselectedLabelColor: AppColors.TEXT_GRAY,
          labelPadding: const EdgeInsets.symmetric(vertical: -5.0),
          labelStyle: const TextStyle(
            fontFamily: 'Quicksand',
            fontSize: AppSizes.FS_CONTENT,
            fontWeight: FontWeight.normal,
            color: AppColors.TEXT_BLACK,
          ), //for selected tab
          unselectedLabelStyle: const TextStyle(
            fontFamily: 'Quicksand',
            fontSize: AppSizes.FS_CONTENT,
            fontWeight: FontWeight.normal,
            color: AppColors.TEXT_GRAY,
          ),
        ),
  );
}
