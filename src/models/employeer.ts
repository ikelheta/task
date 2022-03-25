export interface IEmployeer {
  name: string
  email: string
  city: string
  password: string
  company: string
}

export class Employeer implements IEmployeer {
  name: string
  email: string
  city: string
  password: string
  company: string
  constructor(o: any) {
    o = o ? o : {};
    this.name = o.name
    this.email = o.email
    this.city = o.city
    this.password = o.password
    this.company = o.company
  }
}