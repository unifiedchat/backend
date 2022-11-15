import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from '@modules/user/etc/user.schema';
import { CreateUserDto } from './etc/create-user.dto';
import { RoleType } from '@enums/role.enum';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly model: Model<User>) {}

  async create(dto: CreateUserDto): Promise<boolean> {
    dto.username = dto.username.toLowerCase();
    const exist = await this.model.findOne({ username: dto.username });
    if (exist) throw new ConflictException('Username already exists');

    const user = new this.model(dto);
    user.role = RoleType.USER;
    user.password = await bcrypt.hash(user.password, 10);

    await user.save();

    return true;
  }

  async getById(id: string): Promise<User> {
    return await this.model.findById(id);
  }

  async getByUsername(username: string) {
    return await this.model.findOne({ username });
  }
}
