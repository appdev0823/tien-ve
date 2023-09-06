import 'dart:io';

import 'package:collection/collection.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/route_manager.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:telephony/telephony.dart';
import 'package:tien_ve/entities/global_entity.dart';
import 'package:tien_ve/entities/message_entity.dart';
import 'package:tien_ve/services/message_service.dart';
import 'package:tien_ve/services/toastr_service.dart';
import 'package:tien_ve/utils/constants.dart';
import 'package:tien_ve/utils/helpers.dart';
import 'package:tien_ve/utils/http.dart';
import 'package:tien_ve/utils/styles.dart';
import 'package:tien_ve/utils/theme_provider.dart';

/// Has to leave it here for working in release mode
@pragma('vm:entry-point')
void backgroundMessageHandler(SmsMessage message) async {
  final address = Helpers.isString(message.address) ? message.address.toString() : '';
  final body = Helpers.isString(message.body) ? message.body.toString() : '';
  final sendTimestamp = message.date ?? 0;

  print("====== Listen in background:");
  print("====== Listen in background: ${address}");
  print("====== Listen in background: ${body}");
  print("====== Listen in background: ${sendTimestamp}");
  final receiveTimestamp = DateTime.now().millisecondsSinceEpoch;
  print("====== Listen in background: ${receiveTimestamp}");
  final prefs = await SharedPreferences.getInstance();
  final devicePhoneNumber = prefs.getString(DeviceStorageKeys.DEVICE_PHONE.value) ?? '';
  print("====== Listen in background: ${devicePhoneNumber}");

  await MessageService.create(address, devicePhoneNumber, body, sendTimestamp, receiveTimestamp);
}

@pragma('vm:entry-point')
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await EasyLocalization.ensureInitialized();

  HttpOverrides.global = MHttpOverrides();
  await ScreenUtil.ensureScreenSize();

  runApp(
    EasyLocalization(
      supportedLocales: const [Locale('vi')],
      path: 'assets/translations',
      fallbackLocale: const Locale('vi'),
      child: const App(),
    ),
  );
}

void onDidReceiveNotificationResponse(NotificationResponse res) {
  print("=========== res.toString(): ${res.toString()}");
}

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeProvider.defaultTheme,
      localizationsDelegates: context.localizationDelegates,
      supportedLocales: context.supportedLocales,
      locale: context.locale,
      home: const Home(),
      builder: (context, child) {
        ScreenUtil.init(context);
        return EasyLoading.init()(context, child);
      },
    );
  }
}

class Home extends StatefulWidget {
  const Home({super.key});

  @override
  HomeState createState() => HomeState();
}

class HomeState extends State<Home> with WidgetsBindingObserver {
  List<MessageEntity> smsList = [];

  Telephony telephony = Telephony.instance;

  ScrollController scrollController = ScrollController();

  late FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin;

  @override
  void initState() {
    super.initState();

    WidgetsBinding.instance.addObserver(this);

    initPhoneAndNotification();

    getList();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  Future<void> initPhoneAndNotification() async {
    await setPhoneToStorage();

    await initLocalNotificationPlugin();
  }

  @override
  Future<void> didChangeAppLifecycleState(AppLifecycleState state) async {
    switch (state) {
      case AppLifecycleState.resumed:
        print("=========== resumed");
        getList();
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

  void messageHandler(SmsMessage message) async {
    final address = Helpers.isString(message.address) ? message.address.toString() : '';
    final body = Helpers.isString(message.body) ? message.body.toString() : '';
    final sendTimestamp = message.date ?? 0;

    print("====== Listen in foreground:");
    print("====== Listen in foreground: ${address}");
    print("====== Listen in foreground: ${body}");
    print("====== Listen in foreground: ${sendTimestamp}");
    final receiveTimestamp = DateTime.now().millisecondsSinceEpoch;
    print("====== Listen in foreground: ${receiveTimestamp}");
    final prefs = await SharedPreferences.getInstance();
    final devicePhoneNumber = prefs.getString(DeviceStorageKeys.DEVICE_PHONE.value) ?? '';
    print("====== Listen in foreground: ${devicePhoneNumber}");

    final result = await MessageService.create(address, devicePhoneNumber, body, sendTimestamp, receiveTimestamp);
    if (!result.isSuccess) {
      ToastrService.error(msgKey: result.message);
      return;
    }

    ToastrService.success();

    getList();
  }

  void getList() async {
    final result = await MessageService.getList();
    final data = result.data;
    if (!result.isSuccess || data == null) {
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

  Future<void> initLocalNotificationPlugin() async {
    flutterLocalNotificationsPlugin = FlutterLocalNotificationsPlugin();
    const androidSettings = AndroidInitializationSettings('app_icon');

    const initializationSettings = InitializationSettings(android: androidSettings);

    await flutterLocalNotificationsPlugin.initialize(initializationSettings, onDidReceiveNotificationResponse: onDidReceiveNotificationResponse);

    await flutterLocalNotificationsPlugin.resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>()?.requestPermission();

    startListeningSMS();
  }

  Future<void> setPhoneToStorage() async {
    await telephony.requestPhoneAndSmsPermissions;
    final devicePhoneNumber = await Helpers.getDevicePhoneNumber();
    print("=========== devicePhoneNumber: ${devicePhoneNumber}");

    final prefs = await SharedPreferences.getInstance();
    prefs.setString(DeviceStorageKeys.DEVICE_PHONE.value, devicePhoneNumber);
  }

  void startListeningSMS() async {
    telephony.listenIncomingSms(
      onNewMessage: messageHandler,
      onBackgroundMessage: backgroundMessageHandler,
      listenInBackground: true,
    );

    showListeningNotification();
  }

  void stopListeningSMS() async {
    telephony.listenIncomingSms(onNewMessage: (SmsMessage message) {}, listenInBackground: false);

    cancelListeningNotification();
  }

  void showListeningNotification() async {
    const AndroidNotificationDetails androidNotificationDetails = AndroidNotificationDetails(
      'tien_ve',
      'TienVe',
      channelDescription: 'Đang lắng nghe SMS',
      importance: Importance.max,
      priority: Priority.high,
      ticker: 'ticker',
      ongoing: true,
      autoCancel: false,
    );
    const NotificationDetails notificationDetails = NotificationDetails(android: androidNotificationDetails);
    await flutterLocalNotificationsPlugin.show(0, 'TienVe', 'Đang lắng nghe SMS', notificationDetails);
  }

  void cancelListeningNotification() async {
    await flutterLocalNotificationsPlugin.cancelAll();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Tiền Về", textAlign: TextAlign.center),
        backgroundColor: Colors.redAccent,
      ),
      body: Container(
        padding: EdgeInsets.all(AppSizes.SPACING_LARGE.sp),
        alignment: Alignment.topLeft,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Padding(
                  padding: EdgeInsets.only(right: AppSizes.SPACING_SMALL.sp),
                  child: Text(GlobalEntity.isListeningSMS ? "Đang lắng nghe SMS" : "Dừng lắng nghe SMS", style: const TextStyle().title()),
                ),
                Switch(value: GlobalEntity.isListeningSMS, onChanged: onIsListeningToggled)
              ],
            ),
            const Divider(),
            Expanded(
              child: ListView(
                physics: const BouncingScrollPhysics(),
                controller: scrollController,
                children: smsList
                    .mapIndexed(
                      (index, sms) => Padding(
                        padding: EdgeInsets.symmetric(vertical: AppSizes.SPACING_SMALL.sp),
                        child: Row(
                          children: [
                            Expanded(
                              child: RichText(
                                textAlign: TextAlign.justify,
                                text: TextSpan(
                                  text: "${sms.address.toString()} (${sms.sendDate.toString()})",
                                  style: const TextStyle().content(),
                                  children: [
                                    WidgetSpan(
                                      child: Padding(
                                        padding: EdgeInsets.symmetric(horizontal: AppSizes.SPACING_SMALL.sp),
                                        child: Icon(Icons.send, size: AppSizes.ICON_SIZE_MD.sp),
                                      ),
                                    ),
                                    TextSpan(
                                      text: sms.body.toString(),
                                      style: const TextStyle().content(),
                                    ),
                                  ],
                                ),
                                maxLines: 50,
                              ),
                            ),
                          ],
                        ),
                      ),
                    )
                    .toList(),
              ),
            )
          ],
        ),
      ),
    );
  }
}
