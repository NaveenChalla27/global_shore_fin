// Typed error so controllers can map domain failures to HTTP status codes
// without leaking persistence details.
export class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
