import { HttpStatus } from './http-statuses'
import { HttpException } from './http.exceptions'

export class NotFoundException extends HttpException {
  constructor(message = 'Not Found') {
    super(message, HttpStatus.NOT_FOUND)
  }
}
