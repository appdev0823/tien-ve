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
      return APIResponse.success(data: result);
    } catch (e) {
      return APIResponse.error();
    }
  }

  ///Get message list
  static Future<APIResponse<ListResponse<MessageEntity>>> getList({int page = -1}) async {
    try {
      final http = BaseHTTPClient();
      final query = <String, dynamic>{"page": page};
      final response = await http.get(APIRoutes.MESSAGE_LIST, query);
      if (!response.isSuccess) {
        return APIResponse.error(message: response.message, data: ListResponse<MessageEntity>(list: []));
      }

      final list = MessageEntity.fromList(response.data["list"]);
      return APIResponse.success(data: ListResponse(list: list));
    } catch (e) {
      return APIResponse.error(data: ListResponse<MessageEntity>(list: []));
    }
  }
}
