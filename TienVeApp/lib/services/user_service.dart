import 'dart:io';

import 'package:tien_ve/dtos/message_dto.dart';
import 'package:tien_ve/dtos/user_dto.dart';
import 'package:tien_ve/utils/api_response.dart';
import 'package:tien_ve/utils/constants.dart';
import 'package:tien_ve/utils/http.dart';

class UserService {
  ///Login
  ///
  ///[emailPhone]: email or phone number
  ///
  ///[password]: MD5 hashed
  static Future<APIResponse<LoginUserDTO?>> login(
    String emailPhone,
    String password,
  ) async {
    try {
      final http = BaseHTTPClient();
      final reqBody = <String, dynamic>{
        "email_phone": emailPhone,
        "password": password,
      };
      final response = await http.post(APIRoutes.AUTH_LOGIN, reqBody);
      if (!response.isSuccess || response.data == null) {
        return APIResponse.error(message: response.message, data: null);
      }

      final data = LoginUserDTO.fromJson(response.data);
      return APIResponse.success(data: data);
    } catch (e) {
      return APIResponse.error();
    }
  }
}
