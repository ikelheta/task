import * as jwt from "jsonwebtoken"
import { Request, Response , NextFunction} from "express"

export class Authentication {
  static async customerAuth (req: Request, res: Response, next) {
    try {
      let token = req.headers.authorization?.split(' ')[1];
      if (token) {
        const payload: any = jwt.verify(token, process.env.CUSTOMER_JWT_SECRET || "customerSecret")
        req.user = payload
        next()
      } else {
        res.sendStatus(401)
      }
    } catch (error) {
      res.status(401).json({ error })
    }
  }

  static async driverAuth (req: Request, res: Response, next : NextFunction) {
    try {
      let token = req.headers.authorization?.split(' ')[1];
      if (token) {
        const payload: any = jwt.verify(token, process.env.DRIVER_JWT_SECRET || "driverSecret")
     
        req.user = payload
      } else {
        res.sendStatus(401)
      }
    } catch (error) {
      res.status(401).json({ error })
    }
  }
}



export const createDriverToken = (user: any) => {
 
  return jwt.sign(user, process.env.DRIVER_JWT_SECRET || "driverSecret", {
    expiresIn: '30d',
  })
}

export const createCustomerToken = (user: any) => {
 
  return jwt.sign(user, process.env.CUSTOMER_JWT_SECRET || "customerSecret", {
    expiresIn: '30d',
  })
}