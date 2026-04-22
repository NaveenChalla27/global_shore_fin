// Wraps async route handlers so thrown errors propagate to Express's error middleware.
export const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
