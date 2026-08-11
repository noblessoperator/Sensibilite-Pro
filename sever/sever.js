const express = require("express");
const path = require("path");

const healthRouter = require("./routes/health");
const sensitivityRouter = require("./routes/sensitivity");

const app = express();

const PORT = Number(process.env.PORT) || 10000;
const HOST = "0.0.0.0";

app.disable("x-powered-by");

app.use(
    express.json({
        limit: "1mb"
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "1mb"
    })
);


/*
|--------------------------------------------------------------------------
| API ROUTES
|--------------------------------------------------------------------------
*/

app.use(
    "/api/health",
    healthRouter
);

app.use(
    "/api/sensitivity",
    sensitivityRouter
);


/*
|--------------------------------------------------------------------------
| FRONTEND
|--------------------------------------------------------------------------
*/

const publicPath =
    path.join(
        __dirname,
        "..",
        "public"
    );

app.use(
    express.static(publicPath)
);


/*
|--------------------------------------------------------------------------
| FRONTEND FALLBACK
|--------------------------------------------------------------------------
*/

app.get(
    "*",
    (req, res) => {

        res.sendFile(
            path.join(
                publicPath,
                "index.html"
            )
        );

    }
);


/*
|--------------------------------------------------------------------------
| ERROR HANDLER
|--------------------------------------------------------------------------
*/

app.use(
    (error, req, res, next) => {

        console.error(
            "[SERVER ERROR]",
            error
        );

        if (res.headersSent) {
            return next(error);
        }

        res.status(500).json({
            success: false,
            error: "Internal server error."
        });

    }
);


/*
|--------------------------------------------------------------------------
| START
|--------------------------------------------------------------------------
*/

app.listen(
    PORT,
    HOST,
    () => {

        console.log("");
        console.log(
            "======================================"
        );

        console.log(
            "       WILLIAME AI SENSI"
        );

        console.log(
            "       AI AUTOMATIC SENSITIVITY"
        );

        console.log(
            "======================================"
        );

        console.log(
            `Server: http://${HOST}:${PORT}`
        );

        console.log(
            `AI API: ${
                process.env.AI_API_KEY
                    ? "CONFIGURED"
                    : "NOT CONFIGURED"
            }`
        );

        console.log("");

    }
);
