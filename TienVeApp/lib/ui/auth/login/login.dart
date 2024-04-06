import 'package:flutter/material.dart';
import 'package:tien_ve/dtos/user_dto.dart';
import 'package:tien_ve/services/toastr_service.dart';
import 'package:tien_ve/services/user_service.dart';
import 'package:tien_ve/ui/base_stateful_widget.dart';
import 'package:tien_ve/ui/message/message_capture/message_capture.dart';
import 'package:tien_ve/utils/helpers.dart';

import './login_ui.dart';

class LoginWidget extends BaseStatefulWidget {
  const LoginWidget({super.key});

  @override
  BaseStatefulWidgetState<LoginWidget> createState() => LoginWidgetState();
}

class LoginWidgetState extends BaseStatefulWidgetState<LoginWidget> {
  ///This key will be used to identify the state of the form.
  final formKey = GlobalKey<FormState>();
  String emailPhone = '';
  String password = '';

  @override
  void initState() {
    super.initState();

    _checkAuthentication();
  }

  ///Check if there is authentication data. If yes, save global entity and proceed to navbar
  void _checkAuthentication() async {
    final loginUser = await LoginUserDTO.getFromStorage();
    if (loginUser != null) {
      LoginUserDTO.setToGlobal(loginUser);

      Navigator.of(context).push(
        MaterialPageRoute(
          builder: (context) => const MessageCaptureWidget(),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    Helpers.initScreenUtil(context);
    return buildLayout(context);
  }

  ///On login form submitted
  void login() async {
    final isValid = formKey.currentState?.validate();
    if (isValid == null || !isValid) return;
    if (isValid) {
      formKey.currentState?.save();
    }

    final result = await UserService.login(emailPhone, Helpers.encodeMd5(password));
    final user = result.data;
    if (!result.isSuccess || user == null) {
      ToastrService.error(msgKey: 'err_login_failed');
      return;
    }

    LoginUserDTO.setToStorage(user);
    LoginUserDTO.setToGlobal(user);

    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => const MessageCaptureWidget(),
      ),
    );
  }
}
