"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSimilarity = exports.sendAccept = exports.sendRefuse = exports.transporter2 = exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.transporter = nodemailer_1.default.createTransport({
    service: "hotmail",
    auth: {
        user: process.env.NOTIFICATION_USER || "ibrahim.task@outlook.com",
        pass: process.env.NOTIFICATION_PASS || "Password123456789"
    }
});
exports.transporter2 = nodemailer_1.default.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.NOTIFICATION_USER || "ibrahim.elheta@gmail.com",
        pass: process.env.NOTIFICATION_PASS || "Hema_123456789"
    }
});
function sendRefuse(refusedMail, position, companyname) {
    return {
        from: "ibrahim.task@outlook.com",
        to: refusedMail,
        subject: `update on your application on ${position}`,
        text: `Thank you for your interest in the ${position} position at ${companyname} . Unfortunately, we will not be moving forward with your application, but we appreciate your time and interest in ${companyname}.
  `
    };
}
exports.sendRefuse = sendRefuse;
function sendAccept(refusedMail, position, companyname) {
    return {
        from: "ibrahim.task@outlook.com",
        to: refusedMail,
        subject: `update on your application on ${position}`,
        text: `congratulation we would like to inform you that you are accepted in the ${position} position at ${companyname}.`
    };
}
exports.sendAccept = sendAccept;
function sendSimilarity(refusedMail, position, companyname) {
    return {
        from: "ibrahim.task@outlook.com",
        to: refusedMail,
        subject: `new jobs for ${position}`,
        text: `there is a job matches your profile in ${companyname}.`
    };
}
exports.sendSimilarity = sendSimilarity;
