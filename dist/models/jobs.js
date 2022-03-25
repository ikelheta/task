"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jobs = void 0;
class Jobs {
    constructor(o) {
        o = o ? o : {};
        this.company = o.company;
        this.position = o.position;
        this.requirments = o.requirments;
        this.level = o.level;
    }
}
exports.Jobs = Jobs;
