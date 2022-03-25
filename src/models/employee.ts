export interface IEmployee {
  name: string
  email: string
  city: string
  national: string
  password: string
  level: string
  bio: string
  proglang: string[]
}

export class Employee {

  name: string
  email: string
  city: string
  national: string
  password: string
  level: string
  bio: string
  proglang: string[]
  constructor(o: any) {
    o = o ? o : {};
    this.name = o.name
    this.email = o.email
    this.city = o.city
    this.password = o.password
    this.proglang = o.proglang
    this.bio = o.bio
    this.national = o.national
    this.level = o.level
  }
}