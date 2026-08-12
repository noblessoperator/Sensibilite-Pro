"use strict";

const express = require("express");

const router = express.Router();

const {
    generateSensitivity
} = require("../services/sensitivityEngine");

const {
    generateAIResponse,
    isAIConfigured
} = require("../services/aiService");


/*
|--------------------------------------------------------------------------
| POST /api/sensitivity
|--------------------------------------------------------------------------
|
| Génère une configuration de sensibilité à partir du profil
| du joueur puis, si OpenAI est configuré, demande une analyse AI.
|
|--------------------------------------------------------------------------
*/

router.post("/", async (req, res) => {

    try {

        const profile = req.body;


        /*
        |--------------------------------------------------------------------------
        | VALIDATION
        |--------------------------------------------------------------------------
        */

        const validationError =
            validateProfile(profile);

        if (validationError) {

            return res.status(400).json({

                success: false,

                error: validationError

            });
        }


        /*
        |--------------------------------------------------------------------------
        | GENERATION LOCALE
        |--------------------------------------------------------------------------
        |
        | Le moteur local calcule réellement les valeurs.
        | Il ne s'agit pas de nombres complètement aléatoires.
        |
        |--------------------------------------------------------------------------
        */

        const configuration =
            generateSensitivity(profile);


        /*
        |--------------------------------------------------------------------------
        | OPENAI
        |--------------------------------------------------------------------------
        |
        | Si OpenAI est configuré :
        |
        | configuration locale
        |          ↓
        |       OpenAI
        |          ↓
        |      AI analysis
        |
        |--------------------------------------------------------------------------
        */

        let aiAnalysis = null;

        if (isAIConfigured()) {

            try {

                aiAnalysis =
                    await generateAIResponse({

                        profile,

                        configuration

                    });

            } catch (error) {

                console.error(
                    "OpenAI error:",
                    error
                );


                /*
                |--------------------------------------------------------------------------
                | IMPORTANT
                |--------------------------------------------------------------------------
                |
                | La configuration locale reste disponible.
                | On ne prétend pas que l'IA a répondu si OpenAI échoue.
                |
                |--------------------------------------------------------------------------
                */

                return res.status(502).json({

                    success: false,

                    error:
                        "Le service AI est temporairement indisponible.",

                    code:
                        "AI_SERVICE_ERROR"

                });
            }
        }


        /*
        |--------------------------------------------------------------------------
        | RESULTAT
        |--------------------------------------------------------------------------
        */

        return res.status(200).json({

            success: true,

            source:
                aiAnalysis
                    ? "local-engine+openai"
                    : "local-engine",

            configuration,

            ai: aiAnalysis

        });

    } catch (error) {

        console.error(
            "Sensitivity API error:",
            error
        );


        return res.status(500).json({

            success: false,

            error:
                "Impossible de générer la configuration.",

            code:
                "SENSITIVITY_GENERATION_ERROR"

        });

    }

});


/*
|--------------------------------------------------------------------------
| PROFILE VALIDATION
|--------------------------------------------------------------------------
*/

function validateProfile(profile) {

    if (
        !profile ||
        typeof profile !== "object"
    ) {

        return "Profil invalide.";
    }


    /*
    |--------------------------------------------------------------------------
    | DEVICE
    |--------------------------------------------------------------------------
    */

    if (
        !profile.device ||
        typeof profile.device !== "string"
    ) {

        return "Le modèle du téléphone est obligatoire.";
    }


    if (
        profile.device.length > 100
    ) {

        return "Le modèle du téléphone est trop long.";
    }


    /*
    |--------------------------------------------------------------------------
    | OS
    |--------------------------------------------------------------------------
    */

    const allowedOS = [
        "Android",
        "iOS"
    ];

    if (
        !allowedOS.includes(
            profile.os
        )
    ) {

        return "Le système doit être Android ou iOS.";
    }


    /*
    |--------------------------------------------------------------------------
    | DPI
    |--------------------------------------------------------------------------
    */

    const dpi =
        Number(
            profile.dpi
        );

    if (
        !Number.isFinite(dpi) ||
        dpi < 100 ||
        dpi > 1000
    ) {

        return "Le DPI doit être compris entre 100 et 1000.";
    }


    /*
    |--------------------------------------------------------------------------
    | SCREEN SIZE
    |--------------------------------------------------------------------------
    */

    const screenSize =
        Number(
            profile.screenSize
        );

    if (
        !Number.isFinite(screenSize) ||
        screenSize < 3 ||
        screenSize > 15
    ) {

        return "La taille de l'écran doit être comprise entre 3 et 15 pouces.";
    }


    /*
    |--------------------------------------------------------------------------
    | RAM
    |--------------------------------------------------------------------------
    */

    const ram =
        Number(
            profile.ram
        );

    if (
        !Number.isFinite(ram) ||
        ram < 1 ||
        ram > 64
    ) {

        return "La RAM doit être comprise entre 1 et 64 GB.";
    }


    /*
    |--------------------------------------------------------------------------
    | FPS
    |--------------------------------------------------------------------------
    */

    const fps =
        Number(
            profile.fps
        );

    if (
        !Number.isFinite(fps) ||
        fps < 15 ||
        fps > 240
    ) {

        return "Les FPS doivent être compris entre 15 et 240.";
    }


    /*
    |--------------------------------------------------------------------------
    | PLAYSTYLE
    |--------------------------------------------------------------------------
    */

    const allowedPlaystyles = [
        "ONE TAP",
        "DRAG HEADSHOT",
        "RUSH",
        "SNIPER",
        "BALANCED"
    ];

    if (
        !allowedPlaystyles.includes(
            profile.playstyle
        )
    ) {

        return "Style de jeu invalide.";
    }


    /*
    |--------------------------------------------------------------------------
    | LEVEL
    |--------------------------------------------------------------------------
    */

    const allowedLevels = [
        "BEGINNER",
        "INTERMEDIATE",
        "ADVANCED",
        "PRO"
    ];

    if (
        !allowedLevels.includes(
            String(
                profile.level
            ).toUpperCase()
        )
    ) {

        return "Niveau de joueur invalide.";
    }


    return null;

}


/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

module.exports = router;
