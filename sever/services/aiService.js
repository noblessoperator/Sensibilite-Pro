/*
|--------------------------------------------------------------------------
| WILLIAME AI SENSI
| EXTERNAL AI SERVICE
|--------------------------------------------------------------------------
|
| IMPORTANT :
| La clé reste exclusivement côté serveur.
|
| process.env.AI_API_KEY
|
| Cette fonction est préparée pour connecter
| un véritable fournisseur AI.
|--------------------------------------------------------------------------
*/


async function generateWithExternalAI(
    profile
) {

    const apiKey =
        process.env.AI_API_KEY;

    const apiUrl =
        process.env.AI_API_URL;


    if (!apiKey) {

        return {

            configured: false,

            result: null,

            message:
                "Le service AI n'est pas encore configuré."

        };

    }


    if (!apiUrl) {

        throw new Error(
            "AI_API_URL is not configured."
        );

    }


    /*
     * L'API externe sera branchée ici.
     *
     * Ne jamais envoyer la clé au frontend.
     *
     * Exemple futur :
     *
     * const response = await fetch(
     *     apiUrl,
     *     {
     *         method: "POST",
     *
     *         headers: {
     *             "Content-Type":
     *                 "application/json",
     *
     *             "Authorization":
     *                 `Bearer ${apiKey}`
     *         },
     *
     *         body: JSON.stringify({
     *             profile
     *         })
     *     }
     * );
     */


    throw new Error(
        "External AI provider adapter is not implemented yet."
    );

}


module.exports = {
    generateWithExternalAI
};
