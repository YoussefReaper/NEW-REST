const rateLimit = require("express-rate-limit");

const emailRequestLimiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 5,
    message: "Too many email requests from this IP, please try again later."
});

module.exports = emailRequestLimiter;