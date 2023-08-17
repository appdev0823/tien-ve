import 'package:tien_ve/entities/base_entity.dart';

class MessageEntity extends BaseEntity {
  int id = 0;
  String address = '';
  String body = '';
  String sendDate = '';
  int isDeleted = 0;

  MessageEntity({
    required this.id,
    required this.address,
    required this.body,
    required this.sendDate,
    required this.isDeleted,
  });

  MessageEntity.fromJson(Map<String, dynamic> json) {
    if (json["id"] is num) {
      id = (json["id"] as num).toInt();
    }
    if (json["address"] is String) {
      address = json["address"];
    }
    if (json["body"] is String) {
      body = json["body"];
    }
    if (json["send_date"] is String) {
      sendDate = json["send_date"];
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
    _data["body"] = body;
    _data["send_date"] = sendDate;
    _data["is_deleted"] = isDeleted;
    _data["created_date"] = createdDate;
    _data["updated_date"] = updatedDate;
    return _data;
  }

  MessageEntity copyWith({
    int id = 0,
    String address = '',
    String body = '',
    String sendDate = '',
    int isDeleted = 0,
  }) =>
      MessageEntity(
        id: id,
        address: address,
        body: body,
        sendDate: sendDate,
        isDeleted: isDeleted,
      );
}
