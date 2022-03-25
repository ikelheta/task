"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeerController = void 0;
const employeer_1 = require("../models/employeer");
const employeer_2 = __importDefault(require("../db/employeer"));
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const authontication_1 = require("../middleware/authontication");
const bcrypt_1 = __importDefault(require("bcrypt"));
class EmployeerController {
    static addEmployeer(body) {
        const employeer = new employeer_1.Employeer(body);
        return (0, rxjs_1.of)(employeer).pipe((0, operators_1.mergeMap)((m) => (0, rxjs_1.from)(bcrypt_1.default.hash(m.password, 10))), (0, operators_1.mergeMap)((m) => (0, rxjs_1.from)(employeer_2.default.create(Object.assign(Object.assign({}, employeer), { password: m })))), (0, operators_1.map)((m) => {
            return { token: (0, authontication_1.createToken)(Object.assign(Object.assign({}, m), { type: "employeer" })), id: m._id };
        }));
    }
    //--------------------------------------------------------------------------------------------------------------------------------------------------------
    static getEmployeer(id) {
        return (0, rxjs_1.of)(true).pipe((0, operators_1.mergeMap)(() => (0, rxjs_1.from)(employeer_2.default.findById(id).select("-password"))));
    }
    //--------------------------------------------------------------------------------------------------------------------------------------------------------
    static getAllEmployeer(pn) {
        return (0, rxjs_1.of)(true).pipe((0, operators_1.mergeMap)(() => {
            return (0, rxjs_1.forkJoin)([
                (0, rxjs_1.from)(employeer_2.default.find({}).skip((pn - 1) * 10).limit(10).select("-password")),
                (0, rxjs_1.from)(employeer_2.default.find({}).count())
            ]);
        }), (0, operators_1.map)((m) => ({
            data: m[0],
            colSize: m[1]
        })));
    }
}
exports.EmployeerController = EmployeerController;
