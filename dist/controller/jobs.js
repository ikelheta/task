"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsController = void 0;
const search_1 = require("./search");
const jobs_1 = require("../models/jobs");
const jobs_2 = __importDefault(require("../db/jobs"));
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const employee_model_1 = __importDefault(require("../db/employee.model"));
const nodemailer_1 = require("../notifications/nodemailer");
class JobsController {
    static postJob(body, createdBy) {
        const job = new jobs_1.Jobs(body);
        return (0, rxjs_1.of)(true).pipe((0, operators_1.mergeMap)(() => (0, rxjs_1.from)(jobs_2.default.create(Object.assign(Object.assign({}, body), { createdBy: createdBy })))), (0, rxjs_1.tap)((m) => {
            const p = search_1.SearchController.similarity(m).pipe((0, rxjs_1.take)(1)).subscribe({
                next: (r) => {
                    r.map((ele) => {
                        nodemailer_1.transporter.sendMail((0, nodemailer_1.sendSimilarity)(ele.email, m.position, m.company), (error, ifo) => {
                            if (error) {
                                console.log(error);
                            }
                            else {
                                console.log("similarity mail sent");
                            }
                        });
                    });
                }
            });
        }));
    }
    //-------------------------------------------------------------------------------------------------------------------------------------------------------- 
    static getJobForUser(id) {
        return (0, rxjs_1.of)(true).pipe((0, operators_1.mergeMap)(() => (0, rxjs_1.from)(jobs_2.default.findOne({ _id: id, status: "open" }).select("-rejected -accepted"))));
    }
    //-------------------------------------------------------------------------------------------------------------------------------------------------------- 
    static getJobForEmployeer(jobid, createdBy) {
        return (0, rxjs_1.of)(true).pipe((0, operators_1.mergeMap)(() => (0, rxjs_1.from)(jobs_2.default.findOne({ _id: jobid, createdBy: createdBy }).populate({ path: "applications", select: ["-password"] }))));
    }
    //-------------------------------------------------------------------------------------------------------------------------------------------------------- 
    static getAllJobForEmployeer(pn, id) {
        return (0, rxjs_1.of)(true).pipe((0, operators_1.mergeMap)(() => (0, rxjs_1.from)(jobs_2.default.find({ createdBy: id }).skip((pn - 1) * 10).limit(10).select("-rejected -accepted"))), (0, operators_1.mergeMap)((m) => {
            return (0, rxjs_1.forkJoin)([
                (0, rxjs_1.of)(m),
                (0, rxjs_1.from)(jobs_2.default.find({ createdBy: id }).count())
            ]);
        }), (0, operators_1.map)((m) => ({ data: m[0], colSize: m[1] })));
    }
    //--------------------------------------------------------------------------------------------------------------------------------------------------------  
    static getAllJobs(pn) {
        return (0, rxjs_1.of)(true).pipe((0, operators_1.mergeMap)(() => (0, rxjs_1.from)(jobs_2.default.find({ status: "open" }).skip((pn - 1) * 10).limit(10).select("-rejected -accepted").populate({ path: "createdBy", select: ["-password"] }))), (0, operators_1.mergeMap)((m) => {
            return (0, rxjs_1.forkJoin)([
                (0, rxjs_1.of)(m),
                (0, rxjs_1.from)(jobs_2.default.find({ status: "open" }).count())
            ]);
        }), (0, operators_1.map)((m) => ({ data: m[0], colSize: m[1] })));
    }
    //--------------------------------------------------------------------------------------------------------------------------------------------------------  
    static applyForJob(jobid, aplicationId) {
        return (0, rxjs_1.of)(true).pipe((0, operators_1.mergeMap)(() => (0, rxjs_1.from)(jobs_2.default.findOneAndUpdate({
            _id: jobid,
            applications: { "$ne": aplicationId },
            rejected: { "$ne": aplicationId }
        }, { $push: { applications: aplicationId } }, { new: true }).select("-rejected -accepted"))));
    }
    //--------------------------------------------------------------------------------------------------------------------------------------------------------
    static acceptEmployee(jobid, applicationID, employeerID) {
        let jobData;
        return (0, rxjs_1.of)(true).pipe((0, operators_1.mergeMap)(() => (0, rxjs_1.from)(jobs_2.default.findOneAndUpdate({ _id: jobid, createdBy: employeerID }, { status: "closed", accepted: applicationID }, { new: true }))), (0, rxjs_1.tap)((m) => jobData = m), (0, operators_1.mergeMap)(() => (0, rxjs_1.from)(employee_model_1.default.findById(applicationID).select("-password"))), (0, rxjs_1.tap)((m) => nodemailer_1.transporter.sendMail((0, nodemailer_1.sendAccept)(m.email, jobData.position, jobData.company), (error, ifo) => {
            if (error) {
                console.log(error);
            }
            else {
                console.log("acccepted mail sent");
            }
        })));
    }
    //--------------------------------------------------------------------------------------------------------------------------------------------------------
    static rejectEmployee(jobid, applicationID, employeerID) {
        let jobData;
        return (0, rxjs_1.of)(true).pipe((0, operators_1.mergeMap)(() => (0, rxjs_1.from)(jobs_2.default.findOneAndUpdate({ _id: jobid, refused: { "$ne": applicationID }, createdBy: employeerID }, { $push: { rejected: applicationID }, $pull: { applications: applicationID } }, { new: true }))), (0, rxjs_1.tap)((m) => jobData = m), (0, operators_1.mergeMap)(() => (0, rxjs_1.from)(employee_model_1.default.findById(applicationID).select("-password"))), (0, rxjs_1.tap)((m) => nodemailer_1.transporter.sendMail((0, nodemailer_1.sendRefuse)(m.email, jobData.position, jobData.company), (error, ifo) => {
            if (error) {
                console.log(error);
            }
            else {
                console.log("rejected mail sent");
            }
        })));
    }
}
exports.JobsController = JobsController;
