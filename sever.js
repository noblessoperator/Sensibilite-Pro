const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 10000;
const HOST = "0.0.0.0";

app.disable("x-powered-by");

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

/*
|--------------------------------------------------------------------------
| STATIC FRONTEND
|--------------------------------------------------------------------------
*/

const publicDirectory = path.join(__dirname, "public");

app.use(express.static(publicDirectory));


/*
|--------------------------------------------------------------------------
| HEALTH CHECK
|--------------------------------------------------------------------------
*/

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        application: "WILLIAME AI SENSI",
        status: "online",
        engine: "local",
        aiConfigured: Boolean(process.env.AI_API_KEY),
        timestamp: new Date().toISOString()
    });
});


/*
|--------------------------------------------------------------------------
| AI STATUS
|--------------------------------------------------------------------------
|
| Cette route ne révèle JAMAIS la clé.
|
*/

app.get("/api/ai/status", (req, res) => {

    const configured =
        Boolean(process.env.AI_API_KEY);

    res.json({
        success: true,
        configured,
        message: configured
            ? "AI service configured."
            : "Le service AI n'est pas encore configuré."
    });
});


/*
|--------------------------------------------------------------------------
| FUTURE AI ENDPOINT
|--------------------------------------------------------------------------
|
| Cette route sera utilisée lorsque nous connecterons
| une véritable API IA.
|
*/

app.post("/api/sensitivity", async (req, res) => {

    try {

        const profile = req.body;

        if (!profile || typeof profile !== "object") {

            return res.status(400).json({
                success: false,
                error: "Invalid profile."
            });
        }


        /*
         * Pour cette version :
         *
         * Le moteur local JavaScript reste responsable
         * de la génération.
         *
         * Aucune fausse réponse AI n'est générée ici.
         */

        return res.status(501).json({
            success: false,
            error: "External AI service is not connected yet.",
            message:
                "Le moteur local WILLIAME AI SENSI est disponible. " +
                "La connexion à une véritable API AI sera activée ultérieurement."
        });

    } catch (error) {

        console.error(
            "Sensitivity API error:",
            error
        );

        return res.status(500).json({
            success: false,
            error: "Internal server error."
        });
    }
});


/*
|--------------------------------------------------------------------------
| FRONTEND FALLBACK
|--------------------------------------------------------------------------
*/

app.get("*", (req, res) => {

    res.sendFile(
        path.join(
            publicDirectory,
            "index.html"
        )
    );
});


/*
|--------------------------------------------------------------------------
| ERROR HANDLER
|--------------------------------------------------------------------------
*/

app.use((error, req, res, next) => {

    console.error(error);

    if (res.headersSent) {
        return next(error);
    }

    res.status(500).json({
        success: false,
        error: "Internal server error."
    });
});


/*
|--------------------------------------------------------------------------
| SERVER
|--------------------------------------------------------------------------
*/

app.listen(
    PORT,
    HOST,
    () => {

        console.log(
            "=========================================="
        );

        console.log(
            "      WILLIAME AI SENSI"
        );

        console.log(
            "      AI AUTOMATIC SENSITIVITY GENERATOR"
        );

        console.log(
            "=========================================="
        );

        console.log(
            `Server listening on ${HOST}:${PORT}`
        );

        console.log(
            `AI configured: ${Boolean(process.env.AI_API_KEY)}`
        );
    }
);
