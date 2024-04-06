import 'package:collection/collection.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:tien_ve/dtos/global_entity.dart';
import 'package:tien_ve/ui/message/message_capture/message_capture.dart';
import 'package:tien_ve/utils/constants.dart';
import 'package:tien_ve/utils/extensions.dart';
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
                        child: Column(
                          children: [
                            MessageInfoRow(label: tr('label.sms_id'), content: sms.id.toString()),
                            MessageInfoRow(label: tr('label.sms_address'), content: sms.address),
                            MessageInfoRow(label: tr('label.sms_body'), content: "\n${sms.body.toString()}"),
                            MessageInfoRow(label: tr('label.sms_send_date'), content: sms.sendDate),
                            MessageInfoRow(label: tr('label.sms_receive_date'), content: sms.receiveDate),
                            MessageInfoRow(
                              label: tr('label.sms_amount'),
                              content: "${sms.sign > 0 ? '+' : '-'}${sms.amount.format()} VND",
                              labelStyle: const TextStyle().content(fontWeight: FontWeight.bold),
                              contentStyle: const TextStyle().content(color: sms.sign > 0 ? AppColors.GREEN : AppColors.RED),
                            ),
                            MessageInfoRow(label: tr('label.sms_balance'), content: "${sms.balance.format()} VND"),
                            MessageInfoRow(
                              label: tr('label.sms_debt_id'),
                              content: sms.debtId,
                              contentStyle: const TextStyle().content(
                                fontWeight: FontWeight.bold,
                                color: AppColors.MAIN,
                              ),
                            ),
                            MessageInfoRow(label: tr('label.sms_bank_account_number'), content: sms.bankAccountNumber),
                            MessageInfoRow(label: tr('label.sms_bank_brand_name'), content: sms.bankBrandName),
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

class MessageInfoRow extends StatelessWidget {
  final String label;
  final TextStyle? labelStyle;
  final String content;
  final TextStyle? contentStyle;

  const MessageInfoRow({
    Key? key,
    required this.label,
    required this.content,
    this.labelStyle,
    this.contentStyle,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        ConstrainedBox( // Make text wrapped
          constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width - AppSizes.SPACING_SMALL.sp * 2),
          child: RichText(
            textAlign: TextAlign.left,
            text: TextSpan(
              text: "$label: ",
              style: labelStyle ?? const TextStyle().content(fontWeight: FontWeight.bold),
              children: [
                TextSpan(
                  text: content,
                  style: contentStyle ?? const TextStyle().content(fontWeight: FontWeight.normal),
                )
              ],
            ),
            maxLines: 30,
          ),
        ),
      ],
    );
  }
}
