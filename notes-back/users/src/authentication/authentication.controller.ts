import express, { Router, RequestHandler } from 'express'

import { ResponseDataAndError } from '@src/infrastructure/response-data-and-error'
import { errorWrapper } from '@src/infrastructure/exceptions/handler-wrapper'

import { AuthenticationService } from './authentication.service'

import { SignUpUserDto } from './dto/signup-user.dto'
import { SignInUserDto } from './dto/signin-user.dto'

export class AuthenticationController {
  constructor(private _authenticationService: AuthenticationService) {}

  static init(authenticationService: AuthenticationService): Router {
    const router = express.Router()
    const authenticationController = new AuthenticationController(
      authenticationService,
    )

    router.post(`/register`, authenticationController.register)
    router.post(`/login`, authenticationController.login)
    return router
  }

  register: RequestHandler = errorWrapper(async (req, res) => {
    const signUpUser = new SignUpUserDto(req.body.email, req.body.password)
    await this._authenticationService.register(signUpUser)
    res.status(201).send('User successfully registered')
  })

  login: RequestHandler = errorWrapper(async (req, res) => {
    const signInUser = new SignInUserDto(req.body.email, req.body.password)
    const token = await this._authenticationService.login(signInUser)
    res.status(200).json(ResponseDataAndError.format({ token }))
  })
}
