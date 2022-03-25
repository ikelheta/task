import { SearchController } from './search';
import { Jobs } from '../models/jobs';
import JobsSchema from "../db/jobs"
import { from, Observable, of, forkJoin, tap, take } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import EmployeeSchema from '../db/employee.model';
import { sendAccept, sendRefuse, transporter, sendSimilarity, transporter2 } from "../notifications/nodemailer"
import { application } from 'express';

export class JobsController {
  public static postJob(body, createdBy): Observable<any> {
    const job = new Jobs(body)
    return of(true).pipe(
      mergeMap(() => from(JobsSchema.create({ ...body, createdBy: createdBy }))),
      tap((m) => {
        const p = SearchController.similarity(m).pipe(take(1)).subscribe({
          next: (r: any[]) => {
            r.map((ele) => {
              transporter.sendMail(sendSimilarity(ele.email, m.position, m.company), (error, ifo) => {
                if (error) {
                  console.log(error)
                } else {
                  console.log("similarity mail sent")
                }
              })
            })
          }
        })

      })
    )
  }
  //-------------------------------------------------------------------------------------------------------------------------------------------------------- 
  public static getJobForUser(id): Observable<any> {
    return of(true).pipe(
      mergeMap(() => from(JobsSchema.findOne({ _id: id, status: "open" }).select("-rejected -accepted"))),
    )
  }
  //-------------------------------------------------------------------------------------------------------------------------------------------------------- 
  public static getJobForEmployeer(jobid, createdBy): Observable<any> {
    return of(true).pipe(
      mergeMap(() => from(JobsSchema.findOne({ _id: jobid, createdBy: createdBy }).populate({ path: "applications", select: ["-password"] }))),
    )
  }
  //-------------------------------------------------------------------------------------------------------------------------------------------------------- 
  public static getAllJobForEmployeer(pn: number, id: string): Observable<any> {
    return of(true).pipe(
      mergeMap(() => from(JobsSchema.find({ createdBy: id }).skip((pn - 1) * 10).limit(10).select("-rejected -accepted"))),
      mergeMap((m) => {
        return forkJoin([
          of(m),
          from(JobsSchema.find({ createdBy: id }).count())
        ])
      }),
      map((m: any[]) => ({ data: m[0], colSize: m[1] }))
    )
  }
  //--------------------------------------------------------------------------------------------------------------------------------------------------------  
  public static getAllJobs(pn: number): Observable<any> {
    return of(true).pipe(
      mergeMap(() => from(JobsSchema.find({ status: "open" }).skip((pn - 1) * 10).limit(10).select("-rejected -accepted").populate({ path: "createdBy", select: ["-password"] }))),
      mergeMap((m) => {
        return forkJoin([
          of(m),
          from(JobsSchema.find({ status: "open" }).count())
        ])
      }),
      map((m: any[]) => ({ data: m[0], colSize: m[1] }))
    )
  }
  //--------------------------------------------------------------------------------------------------------------------------------------------------------  
  public static applyForJob(jobid: string, aplicationId: string): Observable<any> {
    return of(true).pipe(
      mergeMap(() => from(JobsSchema.findOneAndUpdate(
        {
          _id: jobid,
          applications: { "$ne": aplicationId },
          rejected: { "$ne": aplicationId }
        },
        { $push: { applications: aplicationId } },
        { new: true }).select("-rejected -accepted"))),


    )
  }
  //--------------------------------------------------------------------------------------------------------------------------------------------------------

  public static acceptEmployee(jobid, applicationID, employeerID): Observable<any> {
    let jobData;
    return of(true).pipe(
      mergeMap(() => from(JobsSchema.findOneAndUpdate(
        { _id: jobid, createdBy: employeerID },
        { status: "closed", accepted: applicationID },
        { new: true }))),
      tap((m) => jobData = m),
      mergeMap(() => from(EmployeeSchema.findById(applicationID).select("-password"))),
      tap((m: any) => transporter.sendMail(sendAccept(m.email, jobData.position, jobData.company), (error, ifo) => {
        if (error) {
          console.log(error)
        } else {
          console.log("acccepted mail sent")
        }
      }))
    )
  }
  //--------------------------------------------------------------------------------------------------------------------------------------------------------

  public static rejectEmployee(jobid, applicationID, employeerID): Observable<any> {
    let jobData
    return of(true).pipe(
      mergeMap(() => from(JobsSchema.findOneAndUpdate(
        { _id: jobid, refused: { "$ne": applicationID }, createdBy: employeerID },
        { $push: { rejected: applicationID }, $pull: { applications: applicationID } },
        { new: true }))),
      tap((m) => jobData = m),
      mergeMap(() => from(EmployeeSchema.findById(applicationID).select("-password"))),
      tap((m: any) => transporter.sendMail(sendRefuse(m.email, jobData.position, jobData.company), (error, ifo) => {
        if (error) {
          console.log(error)
        } else {
          console.log("rejected mail sent")
        }
      }))
    )
  }
  //--------------------------------------------------------------------------------------------------------------------------------------------------------  

  //--------------------------------------------------------------------------------------------------------------------------------------------------------  
  //-------------------------------------------------------------------------------------------------------------------------------------------------------- 
  //-------------------------------------------------------------------------------------------------------------------------------------------------------- 
  //--------------------------------------------------------------------------------------------------------------------------------------------------------
}