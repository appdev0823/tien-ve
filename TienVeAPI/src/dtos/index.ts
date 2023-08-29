import { createMap } from '@automapper/core';

import { MessageEntity, OtpEntity, UserEntity } from 'src/entities';
import { mapper } from 'src/utils/mapper';

import { MessageDTO } from './message.dto';
import { OtpDTO } from './otp.dto';
import { UserDTO } from './user.dto';

export * from './message.dto';
export * from './user.dto';
export * from './otp.dto';

/**
 * Initialize mapper
 */
export const initMapper = () => {
    createMap(mapper, UserEntity, UserDTO);
    createMap(mapper, UserDTO, UserEntity);

    createMap(mapper, MessageEntity, MessageDTO);
    createMap(mapper, MessageDTO, MessageEntity);

    createMap(mapper, OtpEntity, OtpDTO);
    createMap(mapper, OtpDTO, OtpEntity);
};
