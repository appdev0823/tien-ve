import 'dart:io';

import 'package:tien_ve/dtos/global_entity.dart';
import 'package:tien_ve/dtos/message_dto.dart';
import 'package:tien_ve/dtos/user_dto.dart';
import 'package:tien_ve/utils/api_response.dart';
import 'package:tien_ve/utils/constants.dart';
import 'package:tien_ve/utils/http.dart';

class MessageService {
  ///Create a message
  static Future<APIResponse<void>> create(
    String address,
    String phone,
    String body,
    int sendTimestamp,
    int receiveTimestamp,
  ) async {
    try {
      final httpOpts = await HTTPOptions.create(shouldShowLoading: false);
      final http = BaseHTTPClient();

      final reqBody = <String, dynamic>{
        "address": address,
        "phone": phone,
        "body": body,
        "send_date": sendTimestamp,
        "receive_date": receiveTimestamp,
      };
      final response = await http.post(APIRoutes.MESSAGE_CREATE, reqBody, httpOptions: httpOpts);
      if (!response.isSuccess) {
        return APIResponse.error(message: response.message, data: null);
      }
      return APIResponse.success(data: null);
    } catch (e) {
      return APIResponse.error();
    }
  }

  ///Get message list
  static Future<APIResponse<ListResponse<MessageDTO>>> getList({int page = -1}) async {
    try {
      final http = BaseHTTPClient();
      final query = <String, dynamic>{"page": page};
      final response = await http.get(APIRoutes.MESSAGE_LIST, query);
      if (!response.isSuccess) {
        return APIResponse.error(message: response.message, data: ListResponse<MessageDTO>(list: []));
      }

      final list = MessageDTO.fromList(response.data["list"]);
      return APIResponse.success(data: ListResponse(list: list));
    } catch (e) {
      return APIResponse.error(data: ListResponse<MessageDTO>(list: []));
    }
  }
}
