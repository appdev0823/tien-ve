import { Injectable } from '@nestjs/common';
import { UserDTO } from 'src/dtos';
import { UserEntity } from 'src/entities';
import { BaseService } from 'src/includes';
import { UserRepository } from 'src/repository';
import { Helpers, mapper } from 'src/utils';

@Injectable()
export class UserService extends BaseService {
    /** Constructor */
    constructor(private readonly _userRepo: UserRepository) {
        super();
    }

    public async getByUsername(username: string) {
        if (!Helpers.isString(username)) return null;

        const user = await this._userRepo.findOneBy({ username });
        if (Helpers.isEmptyObject(user)) return null;

        return mapper.map(user, UserEntity, UserDTO);
    }
}
