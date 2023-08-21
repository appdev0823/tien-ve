import 'dart:convert' as convert;
import 'dart:io';

import 'package:http/http.dart' as http;
import 'package:tien_ve/utils/api_response.dart';
import 'package:tien_ve/utils/constants.dart';
import 'package:tien_ve/utils/extensions.dart';
import 'package:tien_ve/utils/helpers.dart';

class BaseHTTPClient {
  final _headers = <String, String>{"content-type": "application/json"};

  ///Should show loading or not
  bool shouldShowLoading = true;

  BaseHTTPClient({this.shouldShowLoading = true});

  ///Construct a POST request
  ///
  ///[route] Defined in Constants.dart
  ///
  ///[body] The body of the POST request
  Future<APIResponse<dynamic>> post(APIRoutes route, Map<String, dynamic>? body) async {
    try {
      if (shouldShowLoading) Helpers.showLoading();

      final uri = Uri.parse("${CONSTANTS.API_URL}/${route.value}");
      final response = await http.post(uri, headers: _headers, body: convert.jsonEncode(body)).timeout(const Duration(seconds: CONSTANTS.POST_TIMEOUT), onTimeout: () {
        if (shouldShowLoading) Helpers.hideLoading();
        final timeoutErrRes = APIResponse.error(message: 'timeout');
        return http.Response(convert.jsonEncode(timeoutErrRes.toJson()), 200);
      });

      final resMap = convert.jsonDecode(response.body);
      if (resMap is! Map<String, dynamic>) {
        if (shouldShowLoading) Helpers.hideLoading();
        return APIResponse.error();
      }

      if (shouldShowLoading) Helpers.hideLoading();

      return APIResponse.success(message: resMap["message"], data: resMap["data"]);
    } catch (e) {
      print(e);
      if (shouldShowLoading) Helpers.hideLoading();
      return APIResponse.error();
    }
  }

  ///Construct a GET request
  ///
  ///[route] Defined in Constants.dart
  ///
  ///[query] The body of the GET request
  Future<APIResponse<dynamic>> get(APIRoutes route, Map<String, dynamic>? query) async {
    try {
      if (shouldShowLoading) Helpers.showLoading();

      String url = "${CONSTANTS.API_URL}/${route.value}";
      if (query != null) {
        final queryStr = query.toQueryString();
        url = "$url?$queryStr";
      }
      final uri = Uri.parse(url);
      final response = await http.get(uri, headers: _headers).timeout(const Duration(seconds: CONSTANTS.POST_TIMEOUT), onTimeout: () {
        if (shouldShowLoading) Helpers.hideLoading();
        final timeoutErrRes = APIResponse.error(message: 'timeout');
        return http.Response(convert.jsonEncode(timeoutErrRes.toJson()), 200);
      });

      final resMap = convert.jsonDecode(response.body);
      if (resMap is! Map<String, dynamic>) {
        if (shouldShowLoading) Helpers.hideLoading();
        return APIResponse.error();
      }

      if (shouldShowLoading) Helpers.hideLoading();

      return APIResponse.success(message: resMap["message"], data: resMap["data"]);
    } catch (e) {
      print(e);
      if (shouldShowLoading) Helpers.hideLoading();
      return APIResponse.error();
    }
  }
}

class MHttpOverrides extends HttpOverrides {
  @override
  HttpClient createHttpClient(SecurityContext? context) {
    return super.createHttpClient(context)..badCertificateCallback = (X509Certificate cert, String host, int port) => true;
  }
}
