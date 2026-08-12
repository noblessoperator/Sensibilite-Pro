```javascript
"use strict";

/*
|--------------------------------------------------------------------------
| WILLIAME AI SENSI
| Main Express Server
|--------------------------------------------------------------------------
|
| Backend principal de l'application.
|
| Architecture :
|
| Browser
|    ↓
| Express
|    ↓
| Middleware sécurité / rate limit
|    ↓
| API Routes
|    ↓
| Sensitivity Engine
|
|--------------------------------------------------------------------------
*/

require("dotenv").config();

const express = require("express");
const path = require("path");
const helmet = require("helmet");

const sensitivityRouter =
    require("./routes/sensitivity");

const healthRouter =
    require("./routes/health");

const {
    apiLimiter
} = require("./middleware/rateLimit");


/*
|--------------------------------------------------------------------------
| APPLICATION
|--------------------------------------------------------------------------
*/

const app = express();


/*
|--------------------------------------------------------------------------
| PORT
|--------------------------------------------------------------------------
*/

const PORT =
    Number(process.env.PORT) || 10000;


/*
|--------------------------------------------------------------------------
| ENVIRONMENT
|--------------------------------------------------------------------------
*/

const NODE_ENV =
    process.env.NODE_ENV || "development";


/*
|--------------------------------------------------------------------------
| BASIC SECURITY
|--------------------------------------------------------------------------
*/

app.disable("x-powered-by");


/*
|--------------------------------------------------------------------------
| HELMET
|--------------------------------------------------------------------------
*/

app.use(
    helmet({
        contentSecurityPolicy: false
    })
);


/*
|--------------------------------------------------------------------------
| REQUEST PARSING
|--------------------------------------------------------------------------
|
| Limite volontairement faible pour éviter les requêtes énormes.
|
*/

app.use(
    express.json({
        limit: "100kb"
    })
);


app.use(
    express.urlencoded({
        extended: false,
        limit: "50kb"
    })
);


/*
|--------------------------------------------------------------------------
| REQUEST LOGGER
|--------------------------------------------------------------------------
|
| Simple logger utile pour Render.
|
*/

app.use(
    (req, res, next) => {

        const start =
            Date.now();


        res.on(
            "finish",
            () => {

                const duration =
                    Date.now() - start;


                console.log(
                    `[${new Date().toISOString()}] ` +
                    `${req.method} ` +
                    `${req.originalUrl} ` +
                    `${res.statusCode} ` +
                    `${duration}ms`
                );

            }
        );


        next();

    }
);


/*
|--------------------------------------------------------------------------
| API RATE LIMIT
|--------------------------------------------------------------------------
*/

app.use(
    "/api",
    apiLimiter
);


/*
|--------------------------------------------------------------------------
| HEALTH ROUTE
|--------------------------------------------------------------------------
*/

app.use(
    "/api/health",
    healthRouter
);


/*
|--------------------------------------------------------------------------
| SENSITIVITY API
|--------------------------------------------------------------------------
*/

app.use(
    "/api/sensitivity",
    sensitivityRouter
);


/*
|--------------------------------------------------------------------------
| STATIC FRONTEND
|--------------------------------------------------------------------------
*/

const publicPath =
    path.join(
        __dirname,
        "..",
        "public"
    );


app.use(
    express.static(
        publicPath,
        {
            index: "index.html",
            maxAge:
                NODE_ENV === "production"
                    ? "1d"
                    : 0
        }
    )
);


/*
|--------------------------------------------------------------------------
| API 404 HANDLER
|--------------------------------------------------------------------------
|
| Si une route /api/... n'existe pas,
| retourner un JSON propre.
|
*/

app.use(
    "/api",
    (req, res) => {

        res.status(404).json({

            success: false,

            error:
                "API route not found."

        });

    }
);


/*
|--------------------------------------------------------------------------
| FRONTEND FALLBACK
|--------------------------------------------------------------------------
|
| IMPORTANT :
|
| Nous n'utilisons PAS :
|
| app.get("*", ...)
|
| afin d'éviter les problèmes avec certaines
| versions récentes d'Express / path-to-regexp.
|
| Toute requête GET qui n'est pas une route API
| retourne l'application frontend.
|
|--------------------------------------------------------------------------
*/

app.use(
    (req, res, next) => {

        if (
            req.method === "GET" &&
            !req.path.startsWith("/api/")
        ) {

            return res.sendFile(
                path.join(
                    publicPath,
                    "index.html"
                )
            );

        }


        next();

    }
);


/*
|--------------------------------------------------------------------------
| 404 GLOBAL
|--------------------------------------------------------------------------
*/

app.use(
    (req, res) => {

        res.status(404).json({

            success: false,

            error:
                "Route not found."

        });

    }
);


/*
|--------------------------------------------------------------------------
| GLOBAL ERROR HANDLER
|--------------------------------------------------------------------------
|
| Les erreurs internes ne doivent pas exposer
| les informations sensibles au client.
|
|--------------------------------------------------------------------------
*/

app.use(
    (
        error,
        req,
        res,
        next
    ) => {

        console.error(
            "SERVER ERROR:",
            error
        );


        if (
            res.headersSent
        ) {

            return next(
                error
            );

        }


        res.status(
            error.status || 500
        ).json({

            success: false,

            error:
                NODE_ENV === "production"
                    ? "Internal server error."
                    : (
                        error.message ||
                        "Internal server error."
                    )

        });

    }
);


/*
|--------------------------------------------------------------------------
| START SERVER
|--------------------------------------------------------------------------
*/

const server =
    app.listen(
        PORT,
        "0.0.0.0",
        () => {

            console.log("");
            console.log(
                "========================================"
            );

            console.log(
                "   WILLIAME AI SENSI"
            );

            console.log(
                "   AI AUTOMATIC SENSITIVITY GENERATOR"
            );

            console.log(
                "========================================"
            );

            console.log(
                `Environment : ${NODE_ENV}`
            );

            console.log(
                `Port        : ${PORT}`
            );

            console.log(
                `Frontend    : ${publicPath}`
            );

            console.log(
                "Status      : ONLINE"
            );

            console.log(
                "========================================"
            );

            console.log("");

        }
    );


/*
|--------------------------------------------------------------------------
| GRACEFUL SHUTDOWN
|--------------------------------------------------------------------------
|
| Permet au serveur de fermer proprement sur Render.
|
|--------------------------------------------------------------------------
*/

function shutdown(
    signal
) {

    console.log(
        `${signal} received.`
    );


    server.close(
        () => {

            console.log(
                "HTTP server closed."
            );

            process.exit(
                0
            );

        }
    );


    setTimeout(
        () => {

            console.error(
                "Forced shutdown."
            );

            process.exit(
                1
            );

        },
        10000
    );

}


process.on(
    "SIGTERM",
    () => {

        shutdown(
            "SIGTERM"
        );

    }
);


process.on(
    "SIGINT",
    () => {

        shutdown(
            "SIGINT"
        );

    }
);


/*
|--------------------------------------------------------------------------
| UNHANDLED ERRORS
|--------------------------------------------------------------------------
*/

process.on(
    "uncaughtException",
    error => {

        console.error(
            "UNCAUGHT EXCEPTION:",
            error
        );

    }
);


process.on(
    "unhandledRejection",
    reason => {

        console.error(
            "UNHANDLED REJECTION:",
            reason
        );

    }
);


/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
|
| Utile pour les tests automatisés.
|
|--------------------------------------------------------------------------
*/

module.exports = app;
```
