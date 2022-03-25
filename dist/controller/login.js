"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginController = void 0;
const employeer_1 = __importDefault(require("../db/employeer"));
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const authontication_1 = require("../middleware/authontication");
const bcrypt_1 = __importDefault(require("bcrypt"));
const employee_model_1 = __importDefault(require("../db/employee.model"));
class LoginController {
    static employeeLogin(body) {
        const { email, password } = body;
        let user;
        return (0, rxjs_1.of)(true).pipe((0, operators_1.mergeMap)(() => (0, rxjs_1.from)(employee_model_1.default.findOne({ email }))), (0, rxjs_1.tap)((t) => user = t), (0, operators_1.mergeMap)((m) => (0, rxjs_1.from)(bcrypt_1.default.compare(password, m.password))), (0, operators_1.mergeMap)((m) => m ? (0, rxjs_1.of)({ token: (0, authontication_1.createToken)(Object.assign(Object.assign({}, user), { type: "employee" })), id: user._id }) : (0, rxjs_1.throwError)(() => 401)));
    }
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    static employeerLogin(body) {
        const { email, password } = body;
        let user;
        return (0, rxjs_1.of)(true).pipe((0, operators_1.mergeMap)(() => (0, rxjs_1.from)(employeer_1.default.findOne({ email }))), (0, rxjs_1.tap)((t) => user = t), (0, operators_1.mergeMap)((m) => (0, rxjs_1.from)(bcrypt_1.default.compare(password, m.password))), (0, operators_1.mergeMap)((m) => m ? (0, rxjs_1.of)({ token: (0, authontication_1.createToken)(Object.assign(Object.assign({}, user), { type: "employeer" })), id: user._id }) : (0, rxjs_1.throwError)(() => 401)));
    }
}
exports.LoginController = LoginController;
