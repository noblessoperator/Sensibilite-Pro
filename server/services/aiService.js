require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();

// ======================================================
// CONFIGURATION
// ======================================================

const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// ======================================================
// FICHIERS PUBLICS
// ======================================================

const publicPath = path.join(__dirname, "..", "public");

app.use(express.static(publicPath));

// ======================================================
// ROUTES
// ======================================================

const healthRouter = require("./routes/health");
const sensitivityRouter = require("./routes/sensitivity");

app.use("/api/health", healthRouter);
app.use("/api/sensitivity", sensitivityRouter);

// ======================================================
// PAGE PRINCIPALE
// ======================================================

app.get("/", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
});

// ======================================================
// ROUTE 404 API
// ======================================================

app.use("/api", (req, res) => {
    res.status(404).json({
        success: false,
        error: "API route not found"
    });
});

// ======================================================
// GESTION DES ERREURS
// ======================================================

app.use((err, req, res, next) => {
    console.error("Server error:", err);

    res.status(err.status || 500).json({
        success: false,
        error: "Internal server error"
    });
});

// ======================================================
// DÉMARRAGE DU SERVEUR
// ======================================================

app.listen(PORT, "0.0.0.0", () => {
    console.log("======================================");
    console.log("   SENSIBILITE-PRO SERVER");
    console.log("======================================");
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "production"}`);
    console.log(`OpenAI API: ${process.env.OPENAI_API_KEY ? "configured" : "NOT CONFIGURED"}`);
    console.log(`Started: ${new Date().toISOString()}`);
    console.log("======================================");
});
