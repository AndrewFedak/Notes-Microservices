import { v4 as uuid } from 'uuid'
import bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'

import { BadRequestException } from '@src/infrastructure/exceptions/bad-request.exception'

import { IUsersRepository } from '@src/users/users.repository'
import { User } from '@src/users/users.entity'

import { IAuthenticationRepository } from '@src/authentication/authentication.repository'

import { SignUpUserDto } from './dto/signup-user.dto'
import { SignInUserDto } from './dto/signin-user.dto'

export class AuthenticationService {
  constructor(
    private _usersRepository: IUsersRepository,
    private _authenticationRepository: IAuthenticationRepository,
  ) {}

  async register(user: SignUpUserDto): Promise<void> {
    const oldUser = await this._usersRepository.getUserByEmail(user.email)
    if (oldUser !== null) {
      throw new BadRequestException('User Already Exist. Please Login')
    }

    const encryptedPassword = await bcrypt.hash(user.password, 10)
    const newUser = new User(uuid(), user.email, encryptedPassword, 'user')
    await this._authenticationRepository.register(newUser)
  }

  async login({ email, password }: SignInUserDto): Promise<string> {
    const user = await this._usersRepository.getUserByEmail(email)
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { id: user.id, email, role: user.role } as User,
        process.env.TOKEN_KEY!,
        {
          expiresIn: '2h',
        },
      )
      return token
    }

    throw new BadRequestException('Invalid Credentials')
  }
}
