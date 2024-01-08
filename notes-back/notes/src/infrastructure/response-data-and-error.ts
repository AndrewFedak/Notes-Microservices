export class ResponseDataAndError {
  static format(data: unknown, error: unknown = null) {
    return {
      data,
      error,
    }
  }
}
