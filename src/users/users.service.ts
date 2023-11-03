import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private usersModel: Model<UserDocument>,
    ) {}

    create(createUserDto: CreateUserDto) {
        return this.usersModel.create(createUserDto);
    }

    findAll(limit: number) {
        return this.usersModel.find().limit(limit);
    }

    findOne(id: string) {
        return this.usersModel.findById(id);
    }
}
