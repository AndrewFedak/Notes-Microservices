import { HttpStatus } from './http-statuses.js'
import { HttpException } from './http.exceptions.js'

export class UnauthorizedRequestException extends HttpException {
  constructor(message = 'Unauthorized') {
    super(message, HttpStatus.UNAUTHORIZED_REQUEST)
  }
}
