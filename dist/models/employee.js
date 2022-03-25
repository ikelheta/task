"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employee = void 0;
class Employee {
    constructor(o) {
        o = o ? o : {};
        this.name = o.name;
        this.email = o.email;
        this.city = o.city;
        this.password = o.password;
        this.proglang = o.proglang;
        this.bio = o.bio;
        this.national = o.national;
        this.level = o.level;
    }
}
exports.Employee = Employee;
