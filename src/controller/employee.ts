import { createToken } from './../middleware/authontication';
import { Employee } from '../models/employee';
import EmployeSchema from "../db/employee.model"
import { from, Observable, of, forkJoin, tap } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import bcrypt from "bcrypt"
export class EmployeeConteoller {


  public static addEmployee(body): Observable<any> {
    const emp = new Employee(body)

    return of(emp).pipe(
      mergeMap((m) => from(bcrypt.hash(m.password, 10))),
      mergeMap((m) => from(EmployeSchema.create({ ...emp, password: m }))),
      map((m) => {
        return { token: createToken({ ...m, type: "employee", }), id: m._id }
      })
    )
  }
  //--------------------------------------------------------------------------------------------------------------------------------------------------------
  public static findEmployee(id: string, viewrID?: boolean): Observable<any> {
    return of(true).pipe(
      mergeMap(() => {
        if (viewrID) {
          return from(EmployeSchema.findOneAndUpdate({ _id: id }, { $addToSet: { 'views': viewrID } }, { new: true }).select("-password"))
        } else {
          return from(EmployeSchema.findById(id))
        }
      })
    )
  }
  //--------------------------------------------------------------------------------------------------------------------------------------------------------
  public static getAllEmployeesPg(pg: number): Observable<any> {
    return of(true).pipe(
      mergeMap(() => {
        return forkJoin([
          from(EmployeSchema.find({}).skip((pg - 1) * 10).limit(10).select("-password")),
          from(EmployeSchema.find({}).count())
        ])
      }),
      map((m: any[]) => ({
        data: m[0],
        colSize: m[1]
      }))

    )
  }
}