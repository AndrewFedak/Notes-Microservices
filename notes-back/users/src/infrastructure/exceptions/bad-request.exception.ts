import { HttpStatus } from './http-statuses.js'
import { HttpException } from './http.exceptions.js'

export class BadRequestException extends HttpException {
  constructor(message = 'Bad Request') {
    super(message, HttpStatus.BAD_REQUEST)
  }
}
