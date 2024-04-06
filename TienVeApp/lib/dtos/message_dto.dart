import 'package:tien_ve/dtos/base_dto.dart';

class MessageDTO extends BaseDTO {
  int id = 0;
  String userId = '';
  String address = '';
  String phone = '';
  String body = '';
  String sendDate = '';
  String receiveDate = '';
  double amount = 0.0;
  double balance = 0.0;
  int sign = 1;
  String debtId = '';
  String bankAccountId = '';
  int isDeleted = 0;
  String bankAccountNumber = '';
  String bankBrandName = '';

  MessageDTO({
    this.id = 0,
    this.userId = '',
    this.address = '',
    this.phone = '',
    this.body = '',
    this.sendDate = '',
    this.receiveDate = '',
    this.amount = 0.0,
    this.balance = 0.0,
    this.sign = 1,
    this.debtId = '',
    this.bankAccountId = '',
    this.isDeleted = 0,
    this.bankAccountNumber = '',
    this.bankBrandName = '',
    createdDate = '',
    updatedDate = '',
  }) : super(createdDate: createdDate, updatedDate: updatedDate);

  MessageDTO.fromJson(Map<String, dynamic> json) {
    if (json["id"] is int || json["id"] is String) {
      id = int.parse(json["id"]);
    }
    if (json["user_id"] is String) {
      userId = json["user_id"];
    }
    if (json["address"] is String) {
      address = json["address"];
    }
    if (json["phone"] is String) {
      phone = json["phone"];
    }
    if (json["body"] is String) {
      body = json["body"];
    }
    if (json["send_date"] is String) {
      sendDate = json["send_date"];
    }
    if (json["receive_date"] is String) {
      receiveDate = json["receive_date"];
    }
    if (json["amount"] is double || json["amount"] is String) {
      amount = double.parse(json["amount"]);
    }
    if (json["balance"] is double || json["balance"] is String) {
      balance = double.parse(json["balance"]);
    }
    if (json["sign"] is int) {
      sign = json["sign"];
    }
    if (json["debt_id"] is String) {
      debtId = json["debt_id"];
    }
    if (json["bank_account_id"] is String) {
      bankAccountId = json["bank_account_id"];
    }
    if (json["is_deleted"] is int) {
      isDeleted = json["is_deleted"];
    }
    if (json["created_date"] is String) {
      createdDate = json["created_date"];
    }
    if (json["updated_date"] is String) {
      updatedDate = json["updated_date"];
    }
    if (json["bank_account_number"] is String) {
      bankAccountNumber = json["bank_account_number"];
    }
    if (json["bank_brand_name"] is String) {
      bankBrandName = json["bank_brand_name"];
    }
  }

  static List<MessageDTO> fromList(List<dynamic> list) {
    return list.map((map) => MessageDTO.fromJson(map)).toList();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> _data = <String, dynamic>{};
    _data["id"] = id;
    _data["user_id"] = userId;
    _data["address"] = address;
    _data["phone"] = phone;
    _data["body"] = body;
    _data["send_date"] = sendDate;
    _data["receive_date"] = receiveDate;
    _data["amount"] = amount;
    _data["balance"] = balance;
    _data["sign"] = sign;
    _data["debt_id"] = debtId;
    _data["bank_account_id"] = bankAccountId;
    _data["is_deleted"] = isDeleted;
    _data["created_date"] = createdDate;
    _data["updated_date"] = updatedDate;
    _data["bank_account_number"] = bankAccountNumber;
    _data["bank_brand_name"] = bankBrandName;
    return _data;
  }

  MessageDTO copyWith({
    int id = 0,
    String userId = '',
    String address = '',
    String phone = '',
    String body = '',
    String sendDate = '',
    String receiveDate = '',
    double amount = 0.0,
    double balance = 0.0,
    int sign = 1,
    String debtId = '',
    String bankAccountId = '',
    int isDeleted = 0,
    String createdDate = '',
    String updatedDate = '',
    String bankAccountNumber = '',
    String bankBrandName = '',
  }) =>
      MessageDTO(
        id: id,
        userId: userId,
        address: address,
        phone: phone,
        body: body,
        sendDate: sendDate,
        receiveDate: receiveDate,
        amount: amount,
        balance: balance,
        sign: sign,
        debtId: debtId,
        bankAccountId: bankAccountId,
        isDeleted: isDeleted,
        createdDate: createdDate,
        updatedDate: updatedDate,
        bankAccountNumber: bankAccountNumber,
        bankBrandName: bankBrandName,
      );
}
