import 'package:collection/collection.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:tien_ve/dtos/global_entity.dart';
import 'package:tien_ve/ui/message/message_capture/message_capture.dart';
import 'package:tien_ve/utils/constants.dart';
import 'package:tien_ve/utils/styles.dart';

extension MessageCaptureWidgetUI on MessageCaptureWidgetState {
  Widget buildLayout(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(tr('app_name'), textAlign: TextAlign.center),
        backgroundColor: AppColors.MAIN,
        leading: IconButton(
          icon: const Icon(Icons.logout),
          onPressed: () {
            logout();
            Navigator.pop(context); // This is the default back button behavior
          },
        ),
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
                  child: Text(
                    GlobalEntity.isListeningSMS ? tr('label.listening_to_sms') : tr('label.stop_listening_to_sms'),
                    style: const TextStyle().title(),
                  ),
                ),
                Switch(
                  value: GlobalEntity.isListeningSMS,
                  onChanged: onIsListeningToggled,
                )
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
                                textAlign: TextAlign.left,
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
