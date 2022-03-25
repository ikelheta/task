"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeConteoller = void 0;
const authontication_1 = require("./../middleware/authontication");
const employee_1 = require("../models/employee");
const employee_model_1 = __importDefault(require("../db/employee.model"));
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const bcrypt_1 = __importDefault(require("bcrypt"));
class EmployeeConteoller {
    static addEmployee(body) {
        const emp = new employee_1.Employee(body);
        return (0, rxjs_1.of)(emp).pipe((0, operators_1.mergeMap)((m) => (0, rxjs_1.from)(bcrypt_1.default.hash(m.password, 10))), (0, operators_1.mergeMap)((m) => (0, rxjs_1.from)(employee_model_1.default.create(Object.assign(Object.assign({}, emp), { password: m })))), (0, operators_1.map)((m) => {
            return { token: (0, authontication_1.createToken)(Object.assign(Object.assign({}, m), { type: "employee" })), id: m._id };
        }));
    }
    //--------------------------------------------------------------------------------------------------------------------------------------------------------
    static findEmployee(id, viewrID) {
        return (0, rxjs_1.of)(true).pipe((0, operators_1.mergeMap)(() => {
            if (viewrID) {
                return (0, rxjs_1.from)(employee_model_1.default.findOneAndUpdate({ _id: id }, { $addToSet: { 'views': viewrID } }, { new: true }).select("-password"));
            }
            else {
                return (0, rxjs_1.from)(employee_model_1.default.findById(id));
            }
        }));
    }
    //--------------------------------------------------------------------------------------------------------------------------------------------------------
    static getAllEmployeesPg(pg) {
        return (0, rxjs_1.of)(true).pipe((0, operators_1.mergeMap)(() => {
            return (0, rxjs_1.forkJoin)([
                (0, rxjs_1.from)(employee_model_1.default.find({}).skip((pg - 1) * 10).limit(10).select("-password")),
                (0, rxjs_1.from)(employee_model_1.default.find({}).count())
            ]);
        }), (0, operators_1.map)((m) => ({
            data: m[0],
            colSize: m[1]
        })));
    }
}
exports.EmployeeConteoller = EmployeeConteoller;
