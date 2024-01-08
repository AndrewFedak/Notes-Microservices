import { Schema, model } from 'mongoose'

import { ROLES, User as UserEntity } from '@src/users/users.entity'

interface IUser {
  _id: string
  email: string
  password: string
  role: ROLES
}
const userSchema = new Schema<IUser>({
  _id: { type: 'String' },
  email: { type: 'String', unique: true },
  password: { type: 'String' },
  role: { type: 'String', enum: ['admin', 'user'] },
})
const User = model<IUser>('User', userSchema)

export class UserDataModel extends User {
  constructor(data: IUser) {
    super(data)
  }

  static toDomain({ _id, email, password, role }: IUser): UserEntity {
    return new UserEntity(_id, email, password, role)
  }

  static fromDomain({ id, email, password, role }: UserEntity): IUser {
    return new User<IUser>({ _id: id, email, password, role })
  }
}
