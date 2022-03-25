"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employeer = void 0;
class Employeer {
    constructor(o) {
        o = o ? o : {};
        this.name = o.name;
        this.email = o.email;
        this.city = o.city;
        this.password = o.password;
        this.company = o.company;
    }
}
exports.Employeer = Employeer;
