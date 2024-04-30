'use strict'
const StatusCode = {
    OK: 200,
    CREATED: 201
}
const ReasonStatusCode = {
    CREATED: 'Created!',
    OK: 'Success'
}
export class SuccessResponse {
    constructor({ message, statusCode = StatusCode.OK, reason = ReasonStatusCode.OK, metadata = {}}) {
        this.message = !message ? reason : message
        this.status = statusCode
        this.metadata = metadata
    }
    send (res, headers = {}) {
        return res.status(this.status).json(this)
    }
}

export class OK extends SuccessResponse {
    constructor(message, metadata) {
        super(message, metadata)
    }
}

export class CREATED extends SuccessResponse {
    constructor(message, statusCode = StatusCode.CREATED, reason = ReasonStatusCode.CREATED ,metadata) {
        super(message, statusCode, reason, metadata)
    }
}
