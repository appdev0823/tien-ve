import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:tien_ve/ui/auth/login/login.dart';
import 'package:tien_ve/utils/constants.dart';

extension LoginWidgetUI on LoginWidgetState {
  Widget buildLayout(BuildContext context) {
    var loginBoxWidth = 360.0.sp;
    var loginBoxHeight = 500.0.sp;

    return Scaffold(
      resizeToAvoidBottomInset: false,
      body: Center(
        child: SafeArea(
          child: SizedBox(
            height: loginBoxHeight,
            width: loginBoxWidth,
            child: SizedBox(
              width: double.infinity,
              child: Form(
                key: formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Container(
                      margin: EdgeInsets.symmetric(vertical: AppSizes.SPACING_X_LARGE.sp),
                      child: Center(
                        child: Text(
                          tr('label.welcome_title'),
                          textAlign: TextAlign.center,
                          style: TextStyle(fontSize: AppSizes.FS_LG_TITLE.sp, fontWeight: FontWeight.w600),
                        ),
                      ),
                    ),
                    Container(
                      width: loginBoxWidth * 0.9,
                      margin: EdgeInsets.symmetric(vertical: AppSizes.SPACING_SMALL.sp),
                      height: 80,
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Expanded(
                            child: TextFormField(
                              validator: ((value) {
                                return (value == null || value.isEmpty) ? tr('validation.required', namedArgs: {'field': tr('label.email').toLowerCase()}) : null;
                              }),
                              onSaved: (value) => setState(() => emailPhone = value!),
                              decoration: InputDecoration(
                                labelText: tr('label.email'),
                                labelStyle: TextStyle(fontSize: AppSizes.FS_CONTENT.sp),
                                border: OutlineInputBorder(
                                  borderSide: const BorderSide(
                                    color: AppColors.INPUT_BORDER_COLOR,
                                    width: 1.0,
                                  ),
                                  borderRadius: BorderRadius.circular(AppSizes.BORDER_RADIUS),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      width: loginBoxWidth * 0.9,
                      margin: EdgeInsets.symmetric(vertical: AppSizes.SPACING_SMALL.sp),
                      height: 80,
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Expanded(
                            child: Stack(
                              alignment: Alignment.centerRight,
                              children: [
                                TextFormField(
                                  obscureText: obscureText,
                                  enableSuggestions: false,
                                  autocorrect: false,
                                  validator: ((value) {
                                    return (value == null || value.isEmpty) ? tr('validation.required', namedArgs: {'field': tr('label.password').toLowerCase()}) : null;
                                  }),
                                  onSaved: (value) => setState(() => password = value!),
                                  decoration: InputDecoration(
                                    labelText: tr('label.password'),
                                    labelStyle: TextStyle(fontSize: AppSizes.FS_CONTENT.sp),
                                    border: OutlineInputBorder(
                                      borderSide: const BorderSide(
                                        color: AppColors.INPUT_BORDER_COLOR,
                                        width: 1.0,
                                      ),
                                      borderRadius: BorderRadius.circular(AppSizes.BORDER_RADIUS),
                                    ),
                                  ),
                                ),
                                IconButton(
                                  icon: Icon(
                                    obscureText ? Icons.visibility_off : Icons.visibility,
                                  ),
                                  onPressed: toggleObscureText,
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    Padding(padding: EdgeInsets.only(top: AppSizes.SPACING_LARGE.sp)),
                    Container(
                      alignment: Alignment.center,
                      child: Container(
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            begin: Alignment.centerLeft,
                            end: Alignment.centerRight,
                            colors: [
                              Color(0xFFD82D8B), // rgb(216, 45, 139)
                              Color(0xFFF69063), // rgb(246, 144, 99)
                            ],
                          ),
                          borderRadius: BorderRadius.circular(AppSizes.BORDER_RADIUS.sp),
                        ),
                        child: ElevatedButton(
                          style: ButtonStyle(
                            shape: MaterialStateProperty.all<RoundedRectangleBorder>(
                              RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(AppSizes.BORDER_RADIUS.sp),
                              ),
                            ),
                            backgroundColor: MaterialStateProperty.all(Colors.transparent),
                            shadowColor: MaterialStateProperty.all(Colors.transparent),
                          ),
                          onPressed: login,
                          child: Padding(
                            padding: EdgeInsets.symmetric(horizontal: AppSizes.SPACING_MEDIUM.sp),
                            child: Text(
                              tr('label.login'),
                              style: TextStyle(
                                fontSize: AppSizes.FS_CONTENT.sp,
                                color: Colors.white,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
