import { HttpStatus } from './http-statuses'

export class HttpException extends Error {
  constructor(
    public message = 'Ooops, something went wrong',
    public status = HttpStatus.INTERNAL_ERROR,
  ) {
    super(message)
  }

  toJSON() {
    return {
      message: this.message,
    }
  }
}
