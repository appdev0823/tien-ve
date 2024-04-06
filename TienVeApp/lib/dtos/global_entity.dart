import 'package:tien_ve/dtos/user_dto.dart';

class GlobalEntity {
  /// `true` if app is listening to SMS messages
  static bool isListeningSMS = true;

  ///Access token
  static String? accessToken;

  ///Current login user
  static LoginUserDTO? loginUser;
}
