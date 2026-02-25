const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    // If headers have already been sent to the client, delegate to the default error handler
    if (res.headersSent) {
        return next(err);
    }

    // Default to 500 if status code is not set or is 200 despite being an error
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // Handle Prisma specific errors
    if (err.name === 'PrismaClientKnownRequestError') {
        // e.g. Unique constraint violation
        if (err.code === 'P2002') {
            statusCode = 409; // Conflict
            err.message = 'A duplicate record exists.';
        }
        // e.g. Record not found
        else if (err.code === 'P2025') {
            statusCode = 404; // Not Found
            err.message = 'Record not found.';
        }
    } else if (err.name === 'PrismaClientValidationError') {
        statusCode = 400; // Bad Request
        err.message = 'Invalid data provided to database.';
    }

    res.status(statusCode);

    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { notFound, errorHandler };
