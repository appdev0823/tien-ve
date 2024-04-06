import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';
import 'package:tien_ve/dtos/base_dto.dart';
import 'package:tien_ve/dtos/global_entity.dart';
import 'package:tien_ve/utils/constants.dart';
import 'package:tien_ve/utils/helpers.dart';

class UserDTO extends BaseDTO {
  int id = 0;
  String email = '';
  String phone = '';
  String name = '';
  String password = '';
  int remindCount = 0;
  int maxRemindCount = 0;
  int isActive = 0;

  UserDTO({
    this.id = 0,
    this.email = '',
    this.phone = '',
    this.name = '',
    this.password = '',
    this.remindCount = 0,
    this.maxRemindCount = 0,
    this.isActive = 0,
    createdDate = '',
    updatedDate = '',
  }) : super(
          createdDate: createdDate,
          updatedDate: updatedDate,
        );

  UserDTO.fromJson(Map<String, dynamic> json) {
    if (json["id"] is int) {
      id = json["id"];
    }
    if (json["email"] is String) {
      email = json["email"];
    }
    if (json["phone"] is String) {
      phone = json["phone"];
    }
    if (json["name"] is String) {
      name = json["name"];
    }
    if (json["password"] is String) {
      password = json["password"];
    }
    if (json["remind_count"] is int) {
      remindCount = json["remind_count"];
    }
    if (json["max_remind_count"] is int) {
      maxRemindCount = json["max_remind_count"];
    }
    if (json["is_active"] is int) {
      isActive = json["is_active"];
    }
    if (json["created_date"] is String) {
      createdDate = json["created_date"];
    }
    if (json["updated_date"] is String) {
      updatedDate = json["updated_date"];
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> _data = <String, dynamic>{};
    _data["id"] = id;
    _data["email"] = email;
    _data["phone"] = phone;
    _data["name"] = name;
    _data["password"] = password;
    _data["remind_count"] = remindCount;
    _data["max_remind_count"] = maxRemindCount;
    _data["is_active"] = isActive;
    _data["created_date"] = createdDate;
    _data["updated_date"] = updatedDate;
    return _data;
  }

  UserDTO copyWith({
    int id = 0,
    String email = '',
    String phone = '',
    String name = '',
    String password = '',
    int remindCount = 0,
    int maxRemindCount = 0,
    int isActive = 0,
    String createdDate = '',
    String updatedDate = '',
  }) =>
      UserDTO(
        id: id,
        email: email,
        phone: phone,
        name: name,
        password: password,
        remindCount: remindCount,
        maxRemindCount: maxRemindCount,
        isActive: isActive,
        createdDate: createdDate,
        updatedDate: updatedDate,
      );
}

class LoginUserDTO extends UserDTO {
  String accessToken = '';

  LoginUserDTO({
    this.accessToken = '',
    id = 0,
    email = '',
    phone = '',
    name = '',
    password = '',
    remindCount = 0,
    maxRemindCount = 0,
    isActive = 0,
    createdDate = '',
    updatedDate = '',
  }) : super(
          id: id,
          email: email,
          phone: phone,
          name: name,
          password: password,
          remindCount: remindCount,
          maxRemindCount: maxRemindCount,
          isActive: isActive,
          createdDate: createdDate,
          updatedDate: updatedDate,
        );

  LoginUserDTO.fromJson(Map<String, dynamic> json) {
    if (json["access_token"] is String) {
      accessToken = json["access_token"];
    }
    if (json["id"] is int) {
      id = json["id"];
    }
    if (json["email"] is String) {
      email = json["email"];
    }
    if (json["phone"] is String) {
      phone = json["phone"];
    }
    if (json["name"] is String) {
      name = json["name"];
    }
    if (json["password"] is String) {
      password = json["password"];
    }
    if (json["remind_count"] is int) {
      remindCount = json["remind_count"];
    }
    if (json["max_remind_count"] is int) {
      maxRemindCount = json["max_remind_count"];
    }
    if (json["is_active"] is int) {
      isActive = json["is_active"];
    }
    if (json["created_date"] is String) {
      createdDate = json["created_date"];
    }
    if (json["updated_date"] is String) {
      updatedDate = json["updated_date"];
    }
  }

  @override
  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data["access_token"] = accessToken;
    data["id"] = id;
    data["email"] = email;
    data["phone"] = phone;
    data["name"] = name;
    data["password"] = password;
    data["remind_count"] = remindCount;
    data["max_remind_count"] = maxRemindCount;
    data["is_active"] = isActive;
    data["created_date"] = createdDate;
    data["updated_date"] = updatedDate;
    return data;
  }

  @override
  LoginUserDTO copyWith({
    String accessToken = '',
    int id = 0,
    String email = '',
    String phone = '',
    String name = '',
    String password = '',
    int remindCount = 0,
    int maxRemindCount = 0,
    int isActive = 0,
    String createdDate = '',
    String updatedDate = '',
  }) =>
      LoginUserDTO(
        accessToken: accessToken,
        id: id,
        email: email,
        phone: phone,
        name: name,
        password: password,
        remindCount: remindCount,
        maxRemindCount: maxRemindCount,
        isActive: isActive,
        createdDate: createdDate,
        updatedDate: updatedDate,
      );

  ///Set login user data to device storage
  static void setToStorage(LoginUserDTO user) async {
    try {
      final SharedPreferences prefs = await SharedPreferences.getInstance();
      prefs.setString(DeviceStorageKeys.LOGIN_USER.value, jsonEncode(user));
    } catch (e) {
      return;
    }
  }

  ///Set login user data to global data
  static void setToGlobal(LoginUserDTO user) {
    GlobalEntity.loginUser = user;
    GlobalEntity.accessToken = user.accessToken;
  }

  ///Get login user data from device storage
  static Future<LoginUserDTO?> getFromStorage() async {
    try {
      final SharedPreferences prefs = await SharedPreferences.getInstance();
      final curUserStr = prefs.getString(DeviceStorageKeys.LOGIN_USER.value);
      if (curUserStr == null || !Helpers.isString(curUserStr)) return null;

      final curUserJSON = jsonDecode(curUserStr);
      return LoginUserDTO.fromJson(curUserJSON);
    } catch (e) {
      return null;
    }
  }

  ///Clear login user data in device storage
  static clearStorage() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.remove(DeviceStorageKeys.LOGIN_USER.value);
  }

  ///Clear login user data in global data
  static clearGlobal() async {
    GlobalEntity.loginUser = null;
    GlobalEntity.accessToken = '';
  }

  /// Get login user entity from any available sources
  static Future<LoginUserDTO?> get() async {
    return GlobalEntity.loginUser ?? await getFromStorage();
  }
}
