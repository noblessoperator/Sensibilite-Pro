const rateLimit =
    require("express-rate-limit");


const windowMs =
    Number(
        process.env.RATE_LIMIT_WINDOW_MS
    ) || 900000;


const max =
    Number(
        process.env.RATE_LIMIT_MAX
    ) || 60;


const apiRateLimit =
    rateLimit({

        windowMs,

        limit: max,

        standardHeaders: true,

        legacyHeaders: false,

        message: {

            success: false,

            error:
                "Too many requests. Please try again later."

        }

    });


module.exports =
    apiRateLimit;
