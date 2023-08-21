import 'dart:io';

import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/route_manager.dart';
import 'package:telephony/telephony.dart';
import 'package:tien_ve/entities/message_entity.dart';
import 'package:tien_ve/services/message_service.dart';
import 'package:tien_ve/services/toastr_service.dart';
import 'package:tien_ve/utils/constants.dart';
import 'package:tien_ve/utils/helpers.dart';
import 'package:tien_ve/utils/http.dart';
import 'package:tien_ve/utils/lifecycle_event_handler.dart';
import 'package:tien_ve/utils/styles.dart';
import 'package:tien_ve/utils/theme_provider.dart';

@pragma('vm:entry-point')
void backgroundMessageHandler(SmsMessage message) async {
  final address = Helpers.isString(message.address) ? message.address.toString() : '';
  final body = Helpers.isString(message.body) ? message.body.toString() : '';
  final date = message.date != null ? message.date.toString() : '';

  print("====== Listen in background:");
  print("====== Listen in background: ${address}");
  print("====== Listen in background: ${body}");
  print("====== Listen in background: ${date}");

  await MessageService.create(address, body, date);
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

class HomeState extends State<Home> {
  List<MessageEntity> smsList = [];
  Telephony telephony = Telephony.instance;

  @override
  void initState() {
    telephony.listenIncomingSms(
      onNewMessage: messageHandler,
      onBackgroundMessage: backgroundMessageHandler,
      listenInBackground: true,
    );
    super.initState();

    WidgetsBinding.instance.addObserver(LifecycleEventHandler(
      resumedCallBack: () async => setState(() {
        getList();
      }),
    ));

    getList();
  }

  void messageHandler(SmsMessage message) async {
    final address = Helpers.isString(message.address) ? message.address.toString() : '';
    final body = Helpers.isString(message.body) ? message.body.toString() : '';
    final date = message.date != null ? message.date.toString() : '';

    print("====== Listen in foreground:");
    print("====== Listen in foreground: ${address}");
    print("====== Listen in foreground: ${body}");
    print("====== Listen in foreground: ${date}");

    final result = await MessageService.create(address, body, date);
    if (!result.isSuccess) {
      ToastrService.error(result.message);
      return;
    }

    ToastrService.success('success');

    getList();
  }

  void getList() async {
    final result = await MessageService.getList();
    final data = result.data;
    if (!result.isSuccess || data == null) {
      ToastrService.error(result.message);
      return;
    }

    setState(() {
      smsList = data.list;
    });
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
            Text(
              "SMS mà TienVe nhận được:",
              style: const TextStyle().title(),
            ),
            const Divider(),
            for (int i = 0; i < smsList.length; i++)
              Padding(
                padding: EdgeInsets.symmetric(vertical: AppSizes.SPACING_SMALL.sp),
                child: Row(
                  children: [
                    Expanded(
                      child: RichText(
                        text: TextSpan(
                          text: "${smsList[i].address.toString()} (${smsList[i].sendDate.toString()})",
                          style: const TextStyle().content(),
                          children: [
                            WidgetSpan(
                              child: Padding(
                                padding: EdgeInsets.symmetric(horizontal: AppSizes.SPACING_SMALL.sp),
                                child: Icon(Icons.send, size: AppSizes.ICON_SIZE_MD.sp),
                              ),
                            ),
                            TextSpan(
                              text: smsList[i].body.toString(),
                              style: const TextStyle().content(),
                            ),
                          ],
                        ),
                        maxLines: 8,
                      ),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}
