"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CustomAPIError = require('./custom-api');
class UnauthenticatedError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = 401;
    }
}
exports.default = UnauthenticatedError;
