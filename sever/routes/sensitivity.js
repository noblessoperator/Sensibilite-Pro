const express =
    require("express");

const {
    validateProfile
} =
    require(
        "../middleware/validation"
    );

const rateLimit =
    require(
        "../middleware/rateLimit"
    );

const {
    generateSensitivity
} =
    require(
        "../services/sensitivityEngine"
    );

const {
    generateWithExternalAI
} =
    require(
        "../services/aiService"
    );


const router =
    express.Router();


router.post(
    "/",

    rateLimit,

    validateProfile,

    async (
        req,
        res
    ) => {

        try {

            const profile =
                req.body;


            /*
             * Pour la première version,
             * le moteur local est la source
             * de génération réelle.
             */

            const localResult =
                generateSensitivity(
                    profile
                );


            /*
             * Une vraie API externe pourra
             * être activée ici plus tard.
             *
             * Nous ne prétendons pas qu'elle
             * fonctionne lorsqu'elle n'est pas
             * configurée.
             */

            if (
                process.env.AI_API_KEY &&
                process.env.AI_API_URL
            ) {

                try {

                    const aiResult =
                        await generateWithExternalAI(
                            profile
                        );


                    if (
                        aiResult &&
                        aiResult.result
                    ) {

                        return res.json({

                            success: true,

                            engine:
                                "external-ai",

                            result:
                                aiResult.result

                        });

                    }

                } catch (error) {

                    console.error(
                        "[AI SERVICE]",
                        error.message
                    );

                    /*
                     * On utilise ici le moteur
                     * local comme fallback explicite.
                     */

                }

            }


            return res.json({

                success: true,

                engine:
                    "local",

                result:
                    localResult

            });


        } catch (error) {

            console.error(
                "[SENSITIVITY]",
                error
            );


            return res.status(500).json({

                success: false,

                error:
                    "Unable to generate sensitivity."

            });

        }

    }
);


module.exports =
    router;
