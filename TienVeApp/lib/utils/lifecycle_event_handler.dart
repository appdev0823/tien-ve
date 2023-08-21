import 'package:flutter/material.dart';

class LifecycleEventHandler extends WidgetsBindingObserver {
  final Function resumedCallBack;

  LifecycleEventHandler({
    required this.resumedCallBack,
  });

  @override
  Future<void> didChangeAppLifecycleState(AppLifecycleState state) async {
    switch (state) {
      case AppLifecycleState.resumed:
        resumedCallBack();
        break;
      case AppLifecycleState.inactive:
      case AppLifecycleState.paused:
      case AppLifecycleState.detached:
        break;
    }
  }
}
