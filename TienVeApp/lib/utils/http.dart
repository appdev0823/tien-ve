import 'dart:convert' as convert;
import 'dart:io';

import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:tien_ve/dtos/user_dto.dart';
import 'package:tien_ve/services/user_service.dart';
import 'package:tien_ve/utils/api_response.dart';
import 'package:tien_ve/utils/constants.dart';
import 'package:tien_ve/utils/extensions.dart';
import 'package:tien_ve/utils/helpers.dart';

class HTTPOptions {
  /// HTTP headers
  final headers = <String, String>{"content-type": "application/json"};

  /// Should show loading or not
  bool shouldShowLoading = true;

  /// Attach access token to request headers or not
  bool useAccessToken = true;

  /// Every requests in App can reauthenticate
  bool canReauthenticate = true;

  static Future<HTTPOptions> create({
    shouldShowLoading = true,
    useAccessToken = true,
  }) async {
    final opts = HTTPOptions();
    opts.shouldShowLoading = shouldShowLoading;
    opts.useAccessToken = useAccessToken;

    if (useAccessToken) {
      LoginUserDTO? user = await LoginUserDTO.get();
      if (user != null && Helpers.isString(user.accessToken)) {
        opts.headers['Authorization'] = "Bearer ${user.accessToken}";
      }
    }

    return opts;
  }
}

class BaseHTTPClient {
  final _successStatusCodeList = [
    HttpStatuses.OK.value,
    HttpStatuses.CREATED.value,
    HttpStatuses.ACCEPTED.value,
    HttpStatuses.NON_AUTHORITATIVE_INFORMATION.value,
    HttpStatuses.NO_CONTENT.value,
    HttpStatuses.RESET_CONTENT.value,
    HttpStatuses.PARTIAL_CONTENT.value
  ];

  /// `true` if re-authentication is did before
  bool _reauthenticated = false;

  BaseHTTPClient();

  ///Construct a POST request
  ///
  ///[route] Defined in Constants.dart
  ///
  ///[body] The body of the POST request
  Future<APIResponse<dynamic>> post(APIRoutes route, Map<String, dynamic>? body, {HTTPOptions? httpOptions}) async {
    HTTPOptions opts = httpOptions ?? await HTTPOptions.create();
    try {
      if (opts.shouldShowLoading) Helpers.showLoading();

      final uri = Uri.parse("${CONSTANTS.API_URL}/${route.value}");
      final response = await http.post(uri, headers: opts.headers, body: convert.jsonEncode(body)).timeout(const Duration(seconds: CONSTANTS.POST_TIMEOUT), onTimeout: () {
        if (opts.shouldShowLoading) Helpers.hideLoading();
        final timeoutErrRes = APIResponse.error(message: 'timeout');
        return http.Response(convert.jsonEncode(timeoutErrRes.toJson()), 200);
      });

      if (opts.shouldShowLoading) Helpers.hideLoading();

      final resMap = convert.jsonDecode(response.body);
      if (resMap is! Map<String, dynamic>) {
        return APIResponse.error();
      }

      // Reauthenticate and retry if allowed and not reauthenticate before
      print("=========== _reauthenticated: ${_reauthenticated}");
      print("=========== response.statusCode: ${response.statusCode}");
      if (response.statusCode == HttpStatuses.UNAUTHORIZED.value && opts.canReauthenticate) {
        if (_reauthenticated) {
          return APIResponse.error(message: resMap["message"]);
        }

        _reauthenticated = true;

        await reauthenticate();

        return post(route, body, httpOptions: httpOptions);
      }

      if (!_successStatusCodeList.contains(response.statusCode)) {
        return APIResponse.error(message: resMap["message"], data: resMap["data"]);
      }

      return APIResponse.success(message: resMap["message"], data: resMap["data"]);
    } catch (e) {
      print(e);
      if (opts.shouldShowLoading) Helpers.hideLoading();
      return APIResponse.error();
    }
  }

  /// Reauthenticate
  Future<void> reauthenticate() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    String emailPhone = prefs.getString(DeviceStorageKeys.EMAIL_PHONE.value) ?? '';
    String password = prefs.getString(DeviceStorageKeys.PASSWORD.value) ?? '';
    final result = await UserService.login(emailPhone, Helpers.encodeMd5(password));
    final user = result.data;
    if (!result.isSuccess || user == null) {
      return;
    }

    LoginUserDTO.setToStorage(user);
    LoginUserDTO.setToGlobal(user);
  }

  ///Construct a GET request
  ///
  ///[route] Defined in Constants.dart
  ///
  ///[query] The body of the GET request
  Future<APIResponse<dynamic>> get(APIRoutes route, Map<String, dynamic>? query, {HTTPOptions? httpOptions}) async {
    HTTPOptions opts = httpOptions ?? await HTTPOptions.create();
    try {
      if (opts.shouldShowLoading) Helpers.showLoading();

      String url = "${CONSTANTS.API_URL}/${route.value}";
      if (query != null) {
        final queryStr = query.toQueryString();
        url = "$url?$queryStr";
      }
      final uri = Uri.parse(url);
      final response = await http.get(uri, headers: opts.headers).timeout(const Duration(seconds: CONSTANTS.POST_TIMEOUT), onTimeout: () {
        if (opts.shouldShowLoading) Helpers.hideLoading();
        final timeoutErrRes = APIResponse.error(message: 'timeout');
        return http.Response(convert.jsonEncode(timeoutErrRes.toJson()), 200);
      });

      if (opts.shouldShowLoading) Helpers.hideLoading();

      final resMap = convert.jsonDecode(response.body);
      if (resMap is! Map<String, dynamic>) {
        return APIResponse.error();
      }

      // Reauthenticate and retry if allowed and not reauthenticate before
      print("=========== _reauthenticated: ${_reauthenticated}");
      print("=========== response.statusCode: ${response.statusCode}");
      if (response.statusCode == HttpStatuses.UNAUTHORIZED.value && opts.canReauthenticate) {
        if (_reauthenticated) {
          return APIResponse.error(message: resMap["message"]);
        }

        _reauthenticated = true;

        await reauthenticate();

        return get(route, query, httpOptions: httpOptions);
      }

      if (!_successStatusCodeList.contains(response.statusCode)) {
        return APIResponse.error(message: resMap["message"], data: resMap["data"]);
      }

      if (opts.shouldShowLoading) Helpers.hideLoading();

      return APIResponse.success(message: resMap["message"], data: resMap["data"]);
    } catch (e) {
      print(e);
      if (opts.shouldShowLoading) Helpers.hideLoading();
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
