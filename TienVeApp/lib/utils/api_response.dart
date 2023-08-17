import 'package:tien_ve/utils/constants.dart';

class APIResponse<T> {
  bool isSuccess = false;
  String message = "";
  T? data;
  Map<String, String>? errors;

  APIResponse({
    required this.isSuccess,
    required this.message,
    this.data,
    this.errors,
  });

  APIResponse.fromJson(Map<String, dynamic> parsedJson) {
    isSuccess = parsedJson["is_success"] ? true : false;
    if (parsedJson["message"] is String) {
      message = parsedJson["message"];
    }
    data = parsedJson["data"];
    errors = parsedJson["errors"];
  }

  static List<APIResponse> fromList(List<Map<String, dynamic>> list) {
    return list.map((map) => APIResponse.fromJson(map)).toList();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> json = <String, dynamic>{};
    json["is_success"] = isSuccess;
    json["message"] = message;
    json["data"] = data;
    json["errors"] = errors;
    return json;
  }

  static success<T>(String message, {T? data}) {
    return APIResponse(
      isSuccess: true,
      message: message,
      data: data,
    );
  }

  static error<T>({String message = CONSTANTS.ERR_UNKNOWN_MSG_KEY, T? data, Map<String, String>? errors}) {
    return APIResponse(
      isSuccess: true,
      message: message,
      data: data,
      errors: errors,
    );
  }
}
