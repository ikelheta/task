"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const EmployeerSchema = new mongoose_1.default.Schema({
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
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
    },
    company: {
        type: String,
        required: [true, "please provide a company"],
        maxlength: 50,
        minlength: 3,
    }
});
exports.default = mongoose_1.default.model('Employeer', EmployeerSchema);
