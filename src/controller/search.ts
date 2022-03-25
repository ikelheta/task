import { mergeMap, map } from 'rxjs/operators';
import { Observable, of, tap, from, forkJoin } from 'rxjs';
import EmployeSchema from "../db/employee.model"
import JobsSchema from "../db/jobs"

export class SearchController {
  public static searchJob(params): Observable<any> {
    const position = params.position
    const level = params.level
    const skills = params.skills
    //console.log(skills)
    return of(true).pipe(
      mergeMap(() => from(JobsSchema.find({
        $and: [
          { requirments: { $regex: new RegExp(skills), $options: 'i' } },
          { level: { $regex: new RegExp(level), $options: 'i' } },
          { position: { $regex: new RegExp(position), $options: 'i' } },
          { status: "open" }
        ]
      }).select("-rejected -accepted").populate({ path: "createdBy", select: ["-password"] })))
    )
  }
  //----------------------------------------------------------------------------------------------------------------------------------------------------
  public static searchEmployee(params, pn: number): Observable<any> {
    const city = params.city
    const level = params.level
    const proglang = params.skills
    return of(true).pipe(
      mergeMap(() => from(EmployeSchema.find({
        $or: [
          {
            $and: [
              { level: { $regex: new RegExp(level), $options: 'i' } },
              { city: { $regex: new RegExp(city), $options: 'i' } },
            ]
          },
          { proglang: { $in: [`${proglang}`] } }
        ]

      }).skip((pn - 1) * 10).limit(10).select("-password"))),
      mergeMap((m) => {
        return forkJoin([
          of(m),
          from(EmployeSchema.find({}).count())
        ])
      }),
      map((m: any[]) => ({ data: m[0], colSize: m[1] }))
    )
  }
  //----------------------------------------------------------------------------------------------------------------------------------------------------
  public static similarity(query): Observable<any> {

    const bio = query.requirments
    const level = query.level
    return of(true).pipe(
      mergeMap(() => from(EmployeSchema.find({ level }).select("-password"))),
      //tap((m) => console.log(m)),
      map((m: any[]) => {
        return m.map((ele) => {
          return { ...ele, rate: this.levenshteinDistance(bio, ele.bio) }
        }).sort((a, b) => a.rate - b.rate).slice(0, 10)
      }),
      map((m: any[]) => m.map((ele: any) => ({ ...ele._doc, rate: ele.rate })))

    )
  }

  //----------------------------------------------------------------------------------------------------------------------------------------------------
  public static levenshteinDistance(str1: string, str2: string) {
    console.log(str1, str2)
    const track = Array(str2.length + 1).fill(null).map(() =>
      Array(str1.length + 1).fill(null));
    for (let i = 0; i <= str1.length; i += 1) {
      track[0][i] = i;
    }
    for (let j = 0; j <= str2.length; j += 1) {
      track[j][0] = j;
    }
    for (let j = 1; j <= str2.length; j += 1) {
      for (let i = 1; i <= str1.length; i += 1) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        track[j][i] = Math.min(
          track[j][i - 1] + 1, // deletion
          track[j - 1][i] + 1, // insertion
          track[j - 1][i - 1] + indicator, // substitution
        );
      }
    }
    return track[str2.length][str1.length];
  };
}