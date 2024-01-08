import { RequestHandler } from 'express'
import * as jwt from 'jsonwebtoken'

import { User } from '@src/users/users.entity'

import { UnauthorizedRequestException } from '@src/infrastructure/exceptions/unauthorized-request.exception'

export class AuthenticateUser {
  static authenticate = (token: string) => {
    return jwt.verify(token, process.env.TOKEN_KEY!) as User
  }
}

export class AuthenticationMiddleware {
  static authenticate: RequestHandler = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization
      if (!authHeader) {
        throw new UnauthorizedRequestException('Token is required')
      }

      const [tokenType, token] = authHeader.split(' ')

      if (tokenType !== 'Bearer') {
        throw new UnauthorizedRequestException('Invalid Token')
      }
      req.user = AuthenticateUser.authenticate(token)
    } catch (err) {
      return next(err)
    }
    return next()
  }
}
