import { User } from '@src/users/users.entity'

import { UserDataModel } from '../config/data-models/user'

export interface IAuthenticationRepository {
  register(user: User): Promise<void>
}

export class AuthenticationRepository implements IAuthenticationRepository {
  async register(user: User) {
    const userDataModel = await UserDataModel.create(
      UserDataModel.fromDomain(user),
    )
    if (!userDataModel) {
      throw new Error('User was not created')
    }
  }
}
