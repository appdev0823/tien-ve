import 'dart:io';

import 'package:easy_localization/easy_localization.dart';

extension MNum on num {
  String format() {
    return NumberFormat.decimalPattern("en-US").format(this);
  }
}

extension MList<T> on List<T> {
  ///Di chuyển một phần từ trong mảng từ `oldIndex` sang `newIndex`
  ///
  ///Return lại phần tử được di chuyển, `null` nếu có error hoặc mảng rỗng
  ///
  ///nguyen.luu 14-05-2023 01:11
  T? move(int oldIndex, int newIndex) {
    if (oldIndex < 0 || oldIndex >= length) {
      return null;
    }

    if (newIndex < 0 || newIndex >= length) {
      return null;
    }

    if (oldIndex == newIndex) {
      return this[oldIndex]; // No change needed
    }

    final element = this[oldIndex];
    removeAt(oldIndex);

    if (newIndex > oldIndex) {
      newIndex -= 1; // Adjust newIndex due to element removal
    }

    insert(newIndex, element);

    return element;
  }
}

extension MDateTime on DateTime {
  ///Format DateTime thành date string, format mặc định là yyyy-MM-dd HH:mm:ss (MySQL)
  ///
  ///nguyen.luu 16-05-2023 15:52
  String format({String format = 'yyyy-MM-dd HH:mm:ss'}) {
    final DateFormat formatter = DateFormat(format);
    return formatter.format(this);
  }
}
