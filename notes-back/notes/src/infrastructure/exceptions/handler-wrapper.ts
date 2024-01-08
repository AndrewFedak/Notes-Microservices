import { RequestHandler, Request, Response } from 'express'

export const errorWrapper = (
  handler: (req: Request, res: Response) => Promise<void>,
): RequestHandler => {
  return async (req, res, next) => {
    try {
      await handler(req, res)
    } catch (err) {
      next(err)
    }
  }
}
