import 'dart:async';

import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:sms_advanced/sms_advanced.dart';
import 'package:tien_ve/dtos/global_entity.dart';
import 'package:tien_ve/dtos/message_dto.dart';
import 'package:tien_ve/dtos/user_dto.dart';
import 'package:tien_ve/services/message_service.dart';
import 'package:tien_ve/services/toastr_service.dart';
import 'package:tien_ve/ui/base_stateful_widget.dart';
import 'package:tien_ve/utils/constants.dart';
import 'package:tien_ve/utils/helpers.dart';

import './message_capture_ui.dart';

class MessageCaptureWidget extends BaseStatefulWidget {
  const MessageCaptureWidget({super.key});

  @override
  MessageCaptureWidgetState createState() => MessageCaptureWidgetState();
}

class MessageCaptureWidgetState extends State<MessageCaptureWidget> with WidgetsBindingObserver {
  /// Phone number of device
  String _devicePhoneNumber = '';

  /// SMS list of user
  List<MessageDTO> smsList = [];

  /// For capturing SMS
  SmsReceiver receiver = SmsReceiver();

  StreamSubscription<SmsMessage>? smsReceiveListenSubscription;

  ScrollController scrollController = ScrollController();

  FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin = FlutterLocalNotificationsPlugin();

  @override
  void initState() {
    super.initState();

    WidgetsBinding.instance.addObserver(this);

    askPermissions().then((value) {
      initPhoneNumberAndNotification();

      startListeningSMS();

      _getList();
    });
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  /// Ask for necessary permissions
  Future<void> askPermissions() async {
    bool isSuccessAll = true;

    // For retrieving phone number
    PermissionStatus phoneStatus = await Permission.phone.request();
    if (!phoneStatus.isGranted) {
      isSuccessAll = false;
    }

    // For capturing SMS
    PermissionStatus smsStatus = await Permission.sms.request();
    if (!smsStatus.isGranted) {
      isSuccessAll = false;
    }

    if (!isSuccessAll) {
      ToastrService.error(msgKey: 'err_not_grant_permission');
    }
  }

  /// Initialize phone number and notification settings
  Future<void> initPhoneNumberAndNotification() async {
    await initPhoneNumber();
    await initLocalNotificationPlugin();
  }

  @override
  Future<void> didChangeAppLifecycleState(AppLifecycleState state) async {
    switch (state) {
      case AppLifecycleState.resumed:
        print("=========== resumed");
        _getList();
        break;
      case AppLifecycleState.inactive:
        print("=========== inactive");
        break;
      case AppLifecycleState.paused:
        print("=========== paused");
        break;
      case AppLifecycleState.detached:
        print("=========== detached");
        cancelListeningNotification();
        break;
    }
  }

  /// Save captured SMS and refresh list
  void _handleIncomingSMS(SmsMessage message) async {
    final address = Helpers.isString(message.address) ? message.address.toString() : '';
    final body = Helpers.isString(message.body) ? message.body.toString() : '';
    int sendTimestamp = 0;
    DateTime? dateSent = message.dateSent;
    if (dateSent != null) {
      sendTimestamp = dateSent.millisecondsSinceEpoch;
    }

    final receiveTimestamp = DateTime.now().millisecondsSinceEpoch;

    final devicePhoneNumber = await Helpers.getDevicePhoneNumber();

    final result = await MessageService.create(address, devicePhoneNumber, body, sendTimestamp, receiveTimestamp);
    if (!result.isSuccess) {
      // ToastrService.error(msgKey: result.message);
      return;
    }

    _getList();
  }

  void _getList() async {
    final result = await MessageService.getList();
    final data = result.data;
    if (!result.isSuccess || data == null || !Helpers.isFilledList(data.list)) {
      ToastrService.error(msgKey: result.message);
      return;
    }

    setState(() {
      smsList = data.list;
    });
  }

  void onIsListeningToggled(bool isListen) {
    print("=========== isListening: ${isListen}");

    if (isListen) {
      startListeningSMS();
    } else {
      stopListeningSMS();
    }

    setState(() {
      GlobalEntity.isListeningSMS = isListen;
    });
  }

  /// Initialize local notification plugin
  Future<void> initLocalNotificationPlugin() async {
    const androidSettings = AndroidInitializationSettings('app_icon');

    const initializationSettings = InitializationSettings(android: androidSettings);

    await flutterLocalNotificationsPlugin.initialize(initializationSettings, onDidReceiveNotificationResponse: (res) => print("=========== res.toString(): ${res.toString()}"));

    // await flutterLocalNotificationsPlugin.resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>()?.requestPermission();
  }

  /// Get phone number and set to storage
  Future<void> initPhoneNumber() async {
    _devicePhoneNumber = await Helpers.getDevicePhoneNumber();
    print("=========== devicePhoneNumber: ${_devicePhoneNumber}");

    final prefs = await SharedPreferences.getInstance();
    prefs.setString(DeviceStorageKeys.DEVICE_PHONE.value, _devicePhoneNumber);
  }

  /// Start listening to SMS
  void startListeningSMS() async {
    print("startListeningSMS");

    smsReceiveListenSubscription = receiver.onSmsReceived?.listen(_handleIncomingSMS);

    showListeningNotification();
  }

  /// Stop listening to SMS
  void stopListeningSMS() async {
    print("stopListeningSMS");

    if (smsReceiveListenSubscription != null) {
      smsReceiveListenSubscription?.cancel();
    }

    cancelListeningNotification();
  }

  /// Show "Listening to SMS" local notification
  void showListeningNotification() async {
    try {
      AndroidNotificationDetails androidNotificationDetails = AndroidNotificationDetails(
        'tien_ve',
        tr('app_name'),
        channelDescription: tr('label.listening_to_sms'),
        importance: Importance.max,
        priority: Priority.high,
        ticker: 'ticker',
        ongoing: true,
        autoCancel: false,
      );
      NotificationDetails notificationDetails = NotificationDetails(android: androidNotificationDetails);
      await flutterLocalNotificationsPlugin.show(0, tr('app_name'), tr('label.listening_to_sms'), notificationDetails);
    } catch (e) {
      print(e);
    }
  }

  /// Cancel listening notification
  void cancelListeningNotification() async {
    await flutterLocalNotificationsPlugin.cancelAll();
  }

  /// Do logout
  void logout() {
    LoginUserDTO.clearGlobal();
    LoginUserDTO.clearStorage();
    stopListeningSMS();
  }

  @override
  Widget build(BuildContext context) {
    return buildLayout(context);
  }
}
