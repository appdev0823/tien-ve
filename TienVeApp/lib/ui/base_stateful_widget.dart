import 'package:flutter/material.dart';
import 'package:tien_ve/utils/helpers.dart';

class BaseStatefulWidget extends StatefulWidget {
  const BaseStatefulWidget({super.key});

  @override
  State<BaseStatefulWidget> createState() => BaseStatefulWidgetState();
}

class BaseStatefulWidgetState<T extends BaseStatefulWidget> extends State<T> {
  bool isSearching = false;
  bool isPageLoaded = false;

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    Helpers.initScreenUtil(context);
    return Container();
  }
}
