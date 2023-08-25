import 'package:tien_ve/entities/base_entity.dart';

class MessageEntity extends BaseEntity {
  int id = 0;
  String address = '';
  String phone = '';
  String body = '';
  String sendDate = '';
  String receiveDate = '';
  int isDeleted = 0;

  MessageEntity({
    required this.id,
    required this.address,
    required this.phone,
    required this.body,
    required this.sendDate,
    required this.receiveDate,
    required this.isDeleted,
  });

  MessageEntity.fromJson(Map<String, dynamic> json) {
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

  static List<MessageEntity> fromList(List<dynamic> list) {
    return list.map((map) => MessageEntity.fromJson(map)).toList();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> _data = <String, dynamic>{};
    _data["id"] = id;
    _data["address"] = address;
    _data["phone"] = phone;
    _data["body"] = body;
    _data["send_date"] = sendDate;
    _data["receive_date"] = receiveDate;
    _data["is_deleted"] = isDeleted;
    _data["created_date"] = createdDate;
    _data["updated_date"] = updatedDate;
    return _data;
  }

  MessageEntity copyWith({
    int id = 0,
    String address = '',
    String phone = '',
    String body = '',
    String sendDate = '',
    String receiveDate = '',
    int isDeleted = 0,
  }) =>
      MessageEntity(
        id: id,
        address: address,
        phone: phone,
        body: body,
        sendDate: sendDate,
        receiveDate: receiveDate,
        isDeleted: isDeleted,
      );
}
