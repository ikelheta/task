"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchController = void 0;
const operators_1 = require("rxjs/operators");
const rxjs_1 = require("rxjs");
const employee_model_1 = __importDefault(require("../db/employee.model"));
const jobs_1 = __importDefault(require("../db/jobs"));
class SearchController {
    static searchJob(params) {
        const position = params.position;
        const level = params.level;
        const skills = params.skills;
        //console.log(skills)
        return (0, rxjs_1.of)(true).pipe((0, operators_1.mergeMap)(() => (0, rxjs_1.from)(jobs_1.default.find({
            $and: [
                { requirments: { $regex: new RegExp(skills), $options: 'i' } },
                { level: { $regex: new RegExp(level), $options: 'i' } },
                { position: { $regex: new RegExp(position), $options: 'i' } },
                { status: "open" }
            ]
        }).select("-rejected -accepted").populate({ path: "createdBy", select: ["-password"] }))));
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------
    static searchEmployee(params, pn) {
        const city = params.city;
        const level = params.level;
        const proglang = params.skills;
        return (0, rxjs_1.of)(true).pipe((0, operators_1.mergeMap)(() => (0, rxjs_1.from)(employee_model_1.default.find({
            $or: [
                {
                    $and: [
                        { level: { $regex: new RegExp(level), $options: 'i' } },
                        { city: { $regex: new RegExp(city), $options: 'i' } },
                    ]
                },
                { proglang: { $in: [`${proglang}`] } }
            ]
        }).skip((pn - 1) * 10).limit(10).select("-password"))), (0, operators_1.mergeMap)((m) => {
            return (0, rxjs_1.forkJoin)([
                (0, rxjs_1.of)(m),
                (0, rxjs_1.from)(employee_model_1.default.find({}).count())
            ]);
        }), (0, operators_1.map)((m) => ({ data: m[0], colSize: m[1] })));
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------
    static similarity(query) {
        const bio = query.requirments;
        const level = query.level;
        return (0, rxjs_1.of)(true).pipe((0, operators_1.mergeMap)(() => (0, rxjs_1.from)(employee_model_1.default.find({ level }).select("-password"))), 
        //tap((m) => console.log(m)),
        (0, operators_1.map)((m) => {
            return m.map((ele) => {
                return Object.assign(Object.assign({}, ele), { rate: this.levenshteinDistance(bio, ele.bio) });
            }).sort((a, b) => a.rate - b.rate).slice(0, 10);
        }), (0, operators_1.map)((m) => m.map((ele) => (Object.assign(Object.assign({}, ele._doc), { rate: ele.rate })))));
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------
    static levenshteinDistance(str1, str2) {
        console.log(str1, str2);
        const track = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
        for (let i = 0; i <= str1.length; i += 1) {
            track[0][i] = i;
        }
        for (let j = 0; j <= str2.length; j += 1) {
            track[j][0] = j;
        }
        for (let j = 1; j <= str2.length; j += 1) {
            for (let i = 1; i <= str1.length; i += 1) {
                const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
                track[j][i] = Math.min(track[j][i - 1] + 1, // deletion
                track[j - 1][i] + 1, // insertion
                track[j - 1][i - 1] + indicator);
            }
        }
        return track[str2.length][str1.length];
    }
    ;
}
exports.SearchController = SearchController;
