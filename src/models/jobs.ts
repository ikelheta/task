export interface IJobs {
  company: string
  position: string
  requirments: string
  level: string
}
export class Jobs implements IJobs {
  company: string;
  position: string;
  requirments: string;
  level: string
  constructor(o?: any) {
    o = o ? o : {};
    this.company = o.company
    this.position = o.position
    this.requirments = o.requirments
    this.level = o.level
  }
}