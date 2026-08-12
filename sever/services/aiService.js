"use strict";

/*
|--------------------------------------------------------------------------
| WILLIAME AI SENSI
| OpenAI AI Service
|--------------------------------------------------------------------------
|
| La clé API OpenAI doit rester côté serveur.
|
| Render Environment Variable :
|
| OPENAI_API_KEY=ta_cle_secrete
|
|--------------------------------------------------------------------------
*/

const OpenAI = require("openai");


/*
|--------------------------------------------------------------------------
| CONFIGURATION
|--------------------------------------------------------------------------
*/

const apiKey = process.env.OPENAI_API_KEY;


/*
|--------------------------------------------------------------------------
| OPENAI CLIENT
|--------------------------------------------------------------------------
*/

let openai = null;

if (apiKey) {
    openai = new OpenAI({
        apiKey: apiKey
    });
}


/*
|--------------------------------------------------------------------------
| CHECK AI CONFIGURATION
|--------------------------------------------------------------------------
*/

function isAIConfigured() {
    return Boolean(
        process.env.OPENAI_API_KEY
    );
}


/*
|--------------------------------------------------------------------------
| GENERATE AI RESPONSE
|--------------------------------------------------------------------------
*/

async function generateAIResponse({
    profile,
    configuration
}) {

    /*
    |--------------------------------------------------------------------------
    | Vérification de la clé
    |--------------------------------------------------------------------------
    */

    if (!isAIConfigured()) {

        const error =
            new Error(
                "Le service AI n'est pas encore configuré."
            );

        error.code =
            "AI_NOT_CONFIGURED";

        throw error;
    }


    /*
    |--------------------------------------------------------------------------
    | Vérification du client
    |--------------------------------------------------------------------------
    */

    if (!openai) {

        const error =
            new Error(
                "Le service OpenAI n'est pas disponible."
            );

        error.code =
            "OPENAI_CLIENT_ERROR";

        throw error;
    }


    /*
    |--------------------------------------------------------------------------
    | Données utilisateur
    |--------------------------------------------------------------------------
    */

    const safeProfile = {

        device:
            profile?.device || "Unknown",

        os:
            profile?.os || "Unknown",

        dpi:
            profile?.dpi || "Unknown",

        screenSize:
            profile?.screenSize || "Unknown",

        ram:
            profile?.ram || "Unknown",

        fps:
            profile?.fps || "Unknown",

        playstyle:
            profile?.playstyle || "Balanced",

        level:
            profile?.level || "Beginner"

    };


    /*
    |--------------------------------------------------------------------------
    | Configuration calculée localement
    |--------------------------------------------------------------------------
    */

    const safeConfiguration = {

        general:
            configuration?.general ?? null,

        redDot:
            configuration?.redDot ?? null,

        scope2x:
            configuration?.scope2x ?? null,

        scope4x:
            configuration?.scope4x ?? null,

        sniper:
            configuration?.sniper ?? null,

        freeLook:
            configuration?.freeLook ?? null,

        dpi:
            configuration?.dpi ?? null,

        fireButton:
            configuration?.fireButton ?? null
    };


    /*
    |--------------------------------------------------------------------------
    | PROMPT
    |--------------------------------------------------------------------------
    */

    const prompt = `
You are WILLIAME AI SENSI, an AI assistant specialized
in Free Fire and Free Fire MAX sensitivity optimization.

Analyze the player's device and gaming profile.

PLAYER PROFILE:

Device: ${safeProfile.device}
Operating System: ${safeProfile.os}
DPI: ${safeProfile.dpi}
Screen Size: ${safeProfile.screenSize}
RAM: ${safeProfile.ram}
FPS: ${safeProfile.fps}
Playstyle: ${safeProfile.playstyle}
Player Level: ${safeProfile.level}

CURRENT GENERATED CONFIGURATION:

General: ${safeConfiguration.general}
Red Dot: ${safeConfiguration.redDot}
2X Scope: ${safeConfiguration.scope2x}
4X Scope: ${safeConfiguration.scope4x}
Sniper Scope: ${safeConfiguration.sniper}
Free Look: ${safeConfiguration.freeLook}
DPI: ${safeConfiguration.dpi}
Fire Button: ${safeConfiguration.fireButton}

Evaluate this configuration.

Return ONLY valid JSON using exactly this structure:

{
  "analysis": "short explanation",
  "aimSpeed": 0,
  "precision": 0,
  "dragControl": 0,
  "headshot": 0,
  "score": 0,
  "rank": "S-RANK",
  "recommendation": "short recommendation"
}

Rules:

- aimSpeed must be between 0 and 100
- precision must be between 0 and 100
- dragControl must be between 0 and 100
- headshot must be between 0 and 100
- score must be between 0 and 100
- rank must be one of:
  S-RANK
  A-RANK
  B-RANK
  C-RANK
  D-RANK

Do not invent device specifications.
Do not claim that the configuration guarantees headshots.
The result is an optimization recommendation, not a guarantee.
`;


    /*
    |--------------------------------------------------------------------------
    | OPENAI REQUEST
    |--------------------------------------------------------------------------
    */

    const response =
        await openai.responses.create({

            model:
                process.env.OPENAI_MODEL ||
                "gpt-5-mini",

            input:
                prompt,

            max_output_tokens:
                500

        });


    /*
    |--------------------------------------------------------------------------
    | EXTRACT RESPONSE
    |--------------------------------------------------------------------------
    */

    const output =
        response.output_text;


    if (!output) {

        throw new Error(
            "OpenAI n'a retourné aucune réponse."
        );
    }


    /*
    |--------------------------------------------------------------------------
    | PARSE JSON
    |--------------------------------------------------------------------------
    */

    let result;

    try {

        result =
            JSON.parse(output);

    } catch (error) {

        console.error(
            "Invalid OpenAI JSON:",
            output
        );

        const jsonMatch =
            output.match(
                /\{[\s\S]*\}/
            );

        if (!jsonMatch) {

            throw new Error(
                "Réponse OpenAI invalide."
            );
        }

        try {

            result =
                JSON.parse(
                    jsonMatch[0]
                );

        } catch {

            throw new Error(
                "Impossible de lire la réponse OpenAI."
            );
        }
    }


    /*
    |--------------------------------------------------------------------------
    | VALIDATION
    |--------------------------------------------------------------------------
    */

    result.aimSpeed =
        clamp(
            result.aimSpeed
        );

    result.precision =
        clamp(
            result.precision
        );

    result.dragControl =
        clamp(
            result.dragControl
        );

    result.headshot =
        clamp(
            result.headshot
        );

    result.score =
        clamp(
            result.score
        );


    /*
    |--------------------------------------------------------------------------
    | DEFAULT VALUES
    |--------------------------------------------------------------------------
    */

    result.rank =
        result.rank ||
        calculateRank(
            result.score
        );

    result.analysis =
        result.analysis ||
        "Configuration analysée par WILLIAME AI.";

    result.recommendation =
        result.recommendation ||
        "Testez cette configuration et ajustez progressivement selon votre gameplay.";


    return result;
}


/*
|--------------------------------------------------------------------------
| CLAMP
|--------------------------------------------------------------------------
*/

function clamp(value) {

    const number =
        Number(value);

    if (
        Number.isNaN(number)
    ) {

        return 0;
    }

    return Math.max(
        0,
        Math.min(
            100,
            Math.round(number)
        )
    );
}


/*
|--------------------------------------------------------------------------
| RANK
|--------------------------------------------------------------------------
*/

function calculateRank(
    score
) {

    if (score >= 90) {
        return "S-RANK";
    }

    if (score >= 80) {
        return "A-RANK";
    }

    if (score >= 70) {
        return "B-RANK";
    }

    if (score >= 60) {
        return "C-RANK";
    }

    return "D-RANK";
}


/*
|--------------------------------------------------------------------------
| EXPORTS
|--------------------------------------------------------------------------
*/

module.exports = {

    generateAIResponse,

    isAIConfigured

};
