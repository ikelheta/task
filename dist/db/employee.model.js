"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.EmployeeSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        maxlength: 50,
        minlength: 3,
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique: true,
    },
    city: {
        type: String,
        required: [true, "please provide city"]
    },
    national: {
        type: String,
        required: [true, "please provide a national"]
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
    },
    level: {
        type: String,
        enum: ['junior', 'midlevel', 'senior'],
        required: [true, 'Please provide your experience level'],
    },
    views: [{
            type: mongoose_1.default.Types.ObjectId,
            default: []
        }],
    bio: {
        type: String,
        default: "",
        maxlength: 500,
    },
    proglang: {
        type: [String],
        required: [true, "please provide a programming lang"]
    },
});
exports.default = mongoose_1.default.model("Employee", exports.EmployeeSchema);
