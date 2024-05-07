'use strict'

import reasonPhrases from "../utils/reasonPhrases.js"
import statusCodes from '../utils/statusCodes.js'
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
export class AuthFailureError extends ErrorResponse {
    constructor( message = reasonPhrases.UNAUTHORIZED, statusCode = statusCodes.UNAUTHORIZED) {
        super( message, statusCode)
    }
}
export class NotFoundError extends ErrorResponse {
    constructor( message = reasonPhrases.NOT_FOUND, statusCode = statusCodes.NOT_FOUND) {
        super(message, statusCode)
    }
}
export class ForBiddenError extends ErrorResponse {
    constructor( message = reasonPhrases.FORBIDDEN, statusCode = statusCodes.FORBIDDEN) {
        super(message, statusCode)
    }
}