import { Employeer } from '../models/employeer';
import EmployeerSchema from "../db/employeer"
import { Observable, of, throwError, tap, from } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { createToken } from '../middleware/authontication';
import bcrypt from "bcrypt"
import EmployeSchema from "../db/employee.model"

export class LoginController {
  public static employeeLogin(body): Observable<any> {
    const { email, password } = body
    let user;
    return of(true).pipe(
      mergeMap(() => from(EmployeSchema.findOne({ email }))),
      tap((t) => user = t),
      mergeMap((m: any) => from(bcrypt.compare(password, m.password))),
      mergeMap((m) => m ? of({ token: createToken({ ...user, type: "employee", }), id: user._id }) : throwError(() => 401))
    )
  }
  //-----------------------------------------------------------------------------------------------------------------------------------------------------
  public static employeerLogin(body): Observable<any> {
    const { email, password } = body
    let user;
    return of(true).pipe(
      mergeMap(() => from(EmployeerSchema.findOne({ email }))),
      tap((t) => user = t),
      mergeMap((m: any) => from(bcrypt.compare(password, m.password))),
      mergeMap((m) => m ? of({ token: createToken({ ...user, type: "employeer" }), id: user._id }) : throwError(() => 401))
    )
  }
}