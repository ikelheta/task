import { Employeer } from '../models/employeer';
import EmployeerSchema from "../db/employeer"
import { from, Observable, of, forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { createToken } from '../middleware/authontication';
import bcrypt from "bcrypt"



export class EmployeerController {
  public static addEmployeer(body): Observable<any> {
    const employeer = new Employeer(body)
    return of(employeer).pipe(
      mergeMap((m) => from(bcrypt.hash(m.password, 10))),
      mergeMap((m) => from(EmployeerSchema.create({ ...employeer, password: m }))),
      map((m) => {
        return { token: createToken({ ...m, type: "employeer" }), id: m._id }
      })
    )
  }
  //--------------------------------------------------------------------------------------------------------------------------------------------------------
  public static getEmployeer(id: string): Observable<any> {
    return of(true).pipe(
      mergeMap(() => from(EmployeerSchema.findById(id).select("-password"))),
    )
  }
  //--------------------------------------------------------------------------------------------------------------------------------------------------------
  public static getAllEmployeer(pn: number): Observable<any> {
    return of(true).pipe(
      mergeMap(() => {
        return forkJoin([
          from(EmployeerSchema.find({}).skip((pn - 1) * 10).limit(10).select("-password")),
          from(EmployeerSchema.find({}).count())
        ])
      }),
      map((m) => ({
        data: m[0],
        colSize: m[1]
      }))
    )
  }
}