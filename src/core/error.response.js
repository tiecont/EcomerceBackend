'use strict'
const StatusCode = {
    FORBIDDEN: 403,
    CONFICT: 409
}
const ReasonStatusCode = {
    FORBIDDEN: 'Bad Request',
    CONFICT: 'Conflict Error'
}
export class ErrorResponse extends Error {
    constructor(message,status) {
        super(message)
        this.status = status
    }
}

export class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFICT,statusCode = StatusCode.FORBIDDEN) {
        super(message,statusCode)
    }
}
export class BadRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFICT,statusCode = StatusCode.FORBIDDEN) {
        super(message,statusCode)
    }
}