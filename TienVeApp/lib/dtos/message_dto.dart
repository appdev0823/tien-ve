import 'package:tien_ve/dtos/base_dto.dart';

class MessageDTO extends BaseDTO {
  int id = 0;
  String address = '';
  String phone = '';
  String body = '';
  String sendDate = '';
  String receiveDate = '';
  int isDeleted = 0;

  MessageDTO({
    this.id = 0,
    this.address = '',
    this.phone = '',
    this.body = '',
    this.sendDate = '',
    this.receiveDate = '',
    this.isDeleted = 0,
    createdDate = '',
    updatedDate = '',
  }) : super(
          createdDate: createdDate,
          updatedDate: updatedDate,
        );

  MessageDTO.fromJson(Map<String, dynamic> json) {
    if (json["id"] is num) {
      id = (json["id"] as num).toInt();
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
    if (json["is_deleted"] is num) {
      isDeleted = (json["is_deleted"] as num).toInt();
    }
    if (json["created_date"] is String) {
      createdDate = json["created_date"];
    }
    if (json["updated_date"] is String) {
      updatedDate = json["updated_date"];
    }
  }

  static List<MessageDTO> fromList(List<dynamic> list) {
    return list.map((map) => MessageDTO.fromJson(map)).toList();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data["id"] = id;
    data["address"] = address;
    data["phone"] = phone;
    data["body"] = body;
    data["send_date"] = sendDate;
    data["receive_date"] = receiveDate;
    data["is_deleted"] = isDeleted;
    data["created_date"] = createdDate;
    data["updated_date"] = updatedDate;
    return data;
  }

  MessageDTO copyWith({
    int id = 0,
    String address = '',
    String phone = '',
    String body = '',
    String sendDate = '',
    String receiveDate = '',
    int isDeleted = 0,
    String createdDate = '',
    String updatedDate = '',
  }) =>
      MessageDTO(
        id: id,
        address: address,
        phone: phone,
        body: body,
        sendDate: sendDate,
        receiveDate: receiveDate,
        isDeleted: isDeleted,
        createdDate: createdDate,
        updatedDate: updatedDate,
      );
}
