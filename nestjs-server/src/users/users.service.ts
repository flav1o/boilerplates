import { Model } from 'mongoose';
import { ENTITIES_KEYS } from 'src/constants';
import { InjectModel } from '@nestjs/mongoose';
import { Role, User } from 'src/graphql/graphql-schema';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(ENTITIES_KEYS.USERS_MODEL)
    private readonly usersModel: Model<User>,
  ) {}

  async createUser(authCredentials): Promise<void> {
    const { email } = authCredentials;

    const doesEmailExist = await this.usersModel.findOne({ email });

    if (!!doesEmailExist)
      throw new HttpException(
        'USERS.EMAIL_ALREADY_EXISTS',
        HttpStatus.CONFLICT,
      );

    await new this.usersModel({
      ...authCredentials,
      roles: [Role.USER],
    }).save();
  }

  async createUserExternalAuth(email: string): Promise<User> {
    const createUser = await new this.usersModel({
      email,
      password: null,
      confirmed: true,
      confirmationCode: null,
    }).save();

    if (!createUser) {
      throw new HttpException(
        'USERS.COULD_NOT_CREATE_USER_WITH_EXTERNAL_AUTH',
        HttpStatus.CONFLICT,
      );
    }

    return createUser;
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.usersModel.findOne({ email });
  }

  async confirmUser(email: string, token: string): Promise<User> {
    const user = await this.findUserByEmail(email);

    if (!user)
      throw new HttpException('USERS.USER_NOT_FOUND', HttpStatus.NOT_FOUND);

    if (user?.confirmed)
      throw new HttpException(
        'USERS.USER_ALREADY_CONFIRMED',
        HttpStatus.BAD_REQUEST,
      );

    if (user.confirmationCode !== token)
      throw new HttpException('USERS.INVALID_TOKEN', HttpStatus.BAD_REQUEST);

    return await this.usersModel.findByIdAndUpdate(
      { _id: user._id },
      { confirmed: true },
      { new: true },
    );
  }
}
