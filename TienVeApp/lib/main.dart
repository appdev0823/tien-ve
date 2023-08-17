import 'dart:io';

import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:get/route_manager.dart';
import 'package:telephony/telephony.dart';
import 'package:tien_ve/services/message_service.dart';
import 'package:tien_ve/services/toastr_service.dart';
import 'package:tien_ve/utils/constants.dart';
import 'package:tien_ve/utils/helpers.dart';
import 'package:tien_ve/utils/http.dart';
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
  List<SmsMessage> smsList = [];
  Telephony telephony = Telephony.instance;

  @override
  void initState() {
    telephony.listenIncomingSms(
      onNewMessage: messageHandler,
      onBackgroundMessage: backgroundMessageHandler,
      listenInBackground: true,
    );
    super.initState();
  }

  void messageHandler(SmsMessage message) async {
    final address = Helpers.isString(message.address) ? message.address.toString() : '';
    final body = Helpers.isString(message.body) ? message.body.toString() : '';
    final date = message.date != null ? message.date.toString() : '';

    print("====== Listen in foreground:");
    print("====== Listen in foreground: ${address}");
    print("====== Listen in foreground: ${body}");
    print("====== Listen in foreground: ${date}");

    setState(() {
      smsList.add(message);
    });

    final result = await MessageService.create(address, body, date);
    if (!result.isSuccess) {
      ToastrService.error(result.message);
      return;
    }

    ToastrService.success('success');
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
              "SMS nhận được khi App ở Foreground",
              style: TextStyle(fontSize: AppSizes.FS_TITLE.sp),
            ),
            const Divider(),
            for (int i = 0; i < smsList.length; i++)
              Padding(
                padding: EdgeInsets.symmetric(vertical: AppSizes.SPACING_SMALL.sp),
                child: Row(
                  children: [
                    Text(
                      smsList[i].address.toString(),
                      style: TextStyle(fontSize: AppSizes.FS_CONTENT.sp),
                    ),
                    Padding(
                      padding: EdgeInsets.symmetric(horizontal: AppSizes.SPACING_SMALL.sp),
                      child: Icon(
                        Icons.send,
                        size: AppSizes.ICON_SIZE_MD.sp,
                      ),
                    ),
                    Text(
                      smsList[i].body.toString(),
                      style: TextStyle(fontSize: AppSizes.FS_CONTENT.sp),
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
