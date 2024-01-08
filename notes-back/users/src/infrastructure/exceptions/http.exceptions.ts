import { HttpStatus } from './http-statuses'

export class HttpException {
  constructor(
    public message = 'Ooops, something went wrong',
    public status = HttpStatus.INTERNAL_ERROR,
  ) {}

  toJSON() {
    return {
      message: this.message,
    }
  }
}
