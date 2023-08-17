import 'dart:io';

import 'package:tien_ve/entities/message_entity.dart';
import 'package:tien_ve/utils/api_response.dart';
import 'package:tien_ve/utils/constants.dart';
import 'package:tien_ve/utils/http.dart';

class MessageService {
  ///Create a message
  static Future<APIResponse<MessageEntity>> create(String address, String body, String sendDate) async {
    try {
      final http = BaseHTTPClient();
      http.shouldShowLoading = false;
      final reqBody = <String, dynamic>{
        "address": address,
        "body": body,
        "send_date": sendDate,
      };
      final response = await http.post(APIRoutes.MESSAGE_CREATE, reqBody);
      if (!response.isSuccess) {
        return APIResponse.error(message: response.message);
      }
      final result = MessageEntity.fromJson(response.data);
      return APIResponse.success('success', data: result);
    } catch (e) {
      return APIResponse.error();
    }
  }
}
