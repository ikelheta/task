"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const JobSchema = new mongoose_1.default.Schema({
    company: {
        type: String,
        required: [true, 'Please provide company name'],
        maxlength: 50,
    },
    position: {
        type: String,
        required: [true, 'Please provide position'],
        maxlength: 100,
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open',
    },
    level: {
        type: String,
        enum: ['junior', 'midlevel', 'senior'],
        required: [true, 'Please provide your experience level'],
    },
    requirments: {
        type: String,
        required: [true, "please provide requirments"],
        maxlength: 500
    },
    createdBy: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Employeer',
        required: [true, 'Please provide user'],
    },
    applications: {
        type: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Employee' }],
        default: []
    },
    accepted: {
        type: mongoose_1.default.Types.ObjectId || null,
        ref: "Employee",
        default: null
    },
    rejected: {
        type: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Employee' }],
        default: []
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model('Job', JobSchema);
