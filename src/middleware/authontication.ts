import * as jwt from "jsonwebtoken"
import { Request, Response } from "express"

export const isTokenValid = async (req: Request, res: Response, next) => {
  try {
    let token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const payload: any = jwt.verify(token, process.env.JWT_SECRET || "secret")
      const t = { id: payload.id, type: payload.type, email: payload.email }
      req.user = t
      next()
    } else {
      res.sendStatus(401)
    }
  } catch (error) {
    res.status(401).json({ error })
  }
}

export const createToken = (user: any) => {
  const id = user._doc._id
  const type = user.type
  const email = user._doc.email
  return jwt.sign({ id, email, type }, process.env.JWT_SECRET || "secret", {
    expiresIn: '30d',
  })
}