const form =
    document.getElementById(
        "profileForm"
    );

const profileSection =
    document.getElementById(
        "profileSection"
    );

const analysisSection =
    document.getElementById(
        "analysisSection"
    );

const resultSection =
    document.getElementById(
        "resultSection"
    );

const generateButton =
    document.getElementById(
        "generateButton"
    );

const progressBar =
    document.getElementById(
        "progressBar"
    );

const progressText =
    document.getElementById(
        "progressText"
    );

const analysisTitle =
    document.getElementById(
        "analysisTitle"
    );

const analysisDescription =
    document.getElementById(
        "analysisDescription"
    );

const analysisStage =
    document.getElementById(
        "analysisStage"
    );

const toast =
    document.getElementById(
        "toast"
    );


let currentProfile = null;
let currentResult = null;


function showToast(message) {

    toast.textContent =
        message;

    toast.classList.add(
        "show"
    );

    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        2500
    );
}


function getProfile() {

    const playstyle =
        document.querySelector(
            'input[name="playstyle"]:checked'
        )?.value;


    return {

        playerName:
            document
                .getElementById(
                    "playerName"
                )
                .value
                .trim(),

        device:
            document
                .getElementById(
                    "device"
                )
                .value
                .trim(),

        platform:
            document
                .getElementById(
                    "platform"
                )
                .value,

        dpi:
            Number(
                document
                    .getElementById(
                        "dpi"
                    )
                    .value
            ),

        screen:
            Number(
                document
                    .getElementById(
                        "screen"
                    )
                    .value
            ),

        ram:
            Number(
                document
                    .getElementById(
                        "ram"
                    )
                    .value
            ),

        fps:
            Number(
                document
                    .getElementById(
                        "fps"
                    )
                    .value
            ),

        skill:
            document
                .getElementById(
                    "skill"
                )
                .value,

        playstyle

    };

}


function sleep(ms) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                ms
            )
    );

}


async function runAnalysis() {

    const stages =
        SENSI_DATA.analysisStages;


    for (
        const stage of stages
    ) {

        analysisTitle.textContent =
            stage.title;

        analysisDescription.textContent =
            stage.description;

        analysisStage.textContent =
            stage.stage;

        progressBar.style.width =
            `${stage.progress}%`;

        progressText.textContent =
            `${stage.progress}%`;

        await sleep(650);

    }

}


async function generateSensitivity(
    profile
) {

    const response =
        await fetch(
            "/api/sensitivity",
            {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        profile
                    )

            }
        );


    let data;

    try {

        data =
            await response.json();

    } catch {

        throw new Error(
            "Invalid server response."
        );

    }


    if (
        !response.ok ||
        !data.success
    ) {

        throw new Error(
            data.error ||
            "Sensitivity generation failed."
        );

    }


    return data;

}


function displayResult(
    profile,
    data
) {

    const result =
        data.result;


    currentResult =
        result;


    document.getElementById(
        "generalValue"
    ).textContent =
        result.sensitivity.general;


    document.getElementById(
        "redDotValue"
    ).textContent =
        result.sensitivity.redDot;


    document.getElementById(
        "scope2Value"
    ).textContent =
        result.sensitivity.scope2;


    document.getElementById(
        "scope4Value"
    ).textContent =
        result.sensitivity.scope4;


    document.getElementById(
        "sniperValue"
    ).textContent =
        result.sensitivity.sniper;


    document.getElementById(
        "freeLookValue"
    ).textContent =
        result.sensitivity.freeLook;


    document.getElementById(
        "resultDpi"
    ).textContent =
        result.dpi;


    document.getElementById(
        "dpiValue"
    ).textContent =
        profile.dpi;


    document.getElementById(
        "fireButton"
    ).textContent =
        `${result.fireButton}%`;


    document.getElementById(
        "aimSpeed"
    ).textContent =
        `${result.performance.aimSpeed}%`;


    document.getElementById(
        "precision"
    ).textContent =
        `${result.performance.precision}%`;


    document.getElementById(
        "dragControl"
    ).textContent =
        `${result.performance.dragControl}%`;


    document.getElementById(
        "headshot"
    ).textContent =
        `${result.performance.headshot}%`;


    document.getElementById(
        "aimSpeedBar"
    ).style.width =
        `${result.performance.aimSpeed}%`;


    document.getElementById(
        "precisionBar"
    ).style.width =
        `${result.performance.precision}%`;


    document.getElementById(
        "dragControlBar"
    ).style.width =
        `${result.performance.dragControl}%`;


    document.getElementById(
        "headshotBar"
    ).style.width =
        `${result.performance.headshot}%`;


    document.getElementById(
        "aiScore"
    ).textContent =
        result.aiScore;


    document.getElementById(
        "scoreRingValue"
    ).textContent =
        result.aiScore;


    document.getElementById(
        "profilePlayer"
    ).textContent =
        profile.playerName;


    document.getElementById(
        "profileDevice"
    ).textContent =
        profile.device;


    document.getElementById(
        "profilePlatform"
    ).textContent =
        profile.platform
            .toUpperCase();


    document.getElementById(
        "fpsValue"
    ).textContent =
        `${profile.fps} FPS`;


    document.getElementById(
        "styleValue"
    ).textContent =
        SENSI_DATA
            .playstyles[
                profile.playstyle
            ]
            ?.name ||
        profile.playstyle;


    document.getElementById(
        "resultSubtitle"
    ).textContent =
        `${profile.playerName}'s optimized configuration`;

}


async function handleGeneration() {

    currentProfile =
        getProfile();


    if (
        !currentProfile.playerName ||
        !currentProfile.device
    ) {

        showToast(
            "Complete your profile."
        );

        return;

    }


    generateButton.disabled =
        true;


    profileSection.classList.add(
        "hidden"
    );


    resultSection.classList.add(
        "hidden"
    );


    analysisSection.classList.remove(
        "hidden"
    );


    progressBar.style.width =
        "0%";


    progressText.textContent =
        "0%";


    try {

        /*
         * Animation uniquement visuelle.
         * Le résultat réel vient du backend.
         */

        const generationPromise =
            generateSensitivity(
                currentProfile
            );


        await runAnalysis();


        const data =
            await generationPromise;


        displayResult(
            currentProfile,
            data
        );


        analysisSection.classList.add(
            "hidden"
        );


        resultSection.classList.remove(
            "hidden"
        );


        resultSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });


    } catch (error) {

        console.error(
            error
        );


        analysisSection.classList.add(
            "hidden"
        );


        profileSection.classList.remove(
            "hidden"
        );


        showToast(
            error.message ||
            "Generation failed."
        );


    } finally {

        generateButton.disabled =
            false;

    }

}


form.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        handleGeneration();

    }
);


document
    .getElementById(
        "copyButton"
    )
    .addEventListener(
        "click",
        async () => {

            if (!currentResult) {
                return;
            }


            const r =
                currentResult;


            const text = `
WILLIAME AI SENSI
S-RANK RESULT

GENERAL        ${r.sensitivity.general}
RED DOT        ${r.sensitivity.redDot}
2X SCOPE       ${r.sensitivity.scope2}
4X SCOPE       ${r.sensitivity.scope4}
SNIPER SCOPE   ${r.sensitivity.sniper}
FREE LOOK      ${r.sensitivity.freeLook}

DPI            ${r.dpi}
FIRE BUTTON    ${r.fireButton}%

AIM SPEED      ${r.performance.aimSpeed}%
PRECISION      ${r.performance.precision}%
DRAG CONTROL   ${r.performance.dragControl}%
HEADSHOT       ${r.performance.headshot}%

AI SCORE       ${r.aiScore}/100
RANK           ${r.rank}
            `.trim();


            try {

                await navigator
                    .clipboard
                    .writeText(
                        text
                    );


                showToast(
                    "Configuration copied!"
                );

            } catch {

                showToast(
                    "Copy failed."
                );

            }

        }
    );


document
    .getElementById(
        "shareButton"
    )
    .addEventListener(
        "click",
        async () => {

            if (!currentResult) {
                return;
            }


            const shareText =
                `WILLIAME AI SENSI — ${currentResult.aiScore}/100 — ${currentResult.rank} 🔥`;


            if (
                navigator.share
            ) {

                try {

                    await navigator.share({

                        title:
                            "WILLIAME AI SENSI",

                        text:
                            shareText,

                        url:
                            window.location.href

                    });

                } catch {

                    // User cancelled.

                }

            } else {

                try {

                    await navigator
                        .clipboard
                        .writeText(
                            shareText
                        );

                    showToast(
                        "Share text copied!"
                    );

                } catch {

                    showToast(
                        "Sharing unavailable."
                    );

                }

            }

        }
    );


document
    .getElementById(
        "againButton"
    )
    .addEventListener(
        "click",
        () => {

            if (!currentProfile) {
                return;
            }


            profileSection.classList.add(
                "hidden"
            );

            resultSection.classList.add(
                "hidden"
            );

            analysisSection.classList.remove(
                "hidden"
            );


            generateButton.disabled =
                true;


            runAnalysis()
                .then(
                    () =>
                        generateSensitivity(
                            currentProfile
                        )
                )
                .then(
                    data => {

                        displayResult(
                            currentProfile,
                            data
                        );

                        analysisSection.classList.add(
                            "hidden"
                        );

                        resultSection.classList.remove(
                            "hidden"
                        );

                    }
                )
                .catch(
                    error => {

                        analysisSection.classList.add(
                            "hidden"
                        );

                        profileSection.classList.remove(
                            "hidden"
                        );

                        showToast(
                            error.message
                        );

                    }
                )
                .finally(
                    () => {

                        generateButton.disabled =
                            false;

                    }
                );

        }
    );


document
    .getElementById(
        "modifyButton"
    )
    .addEventListener(
        "click",
        () => {

            resultSection.classList.add(
                "hidden"
            );

            analysisSection.classList.add(
                "hidden"
            );

            profileSection.classList.remove(
                "hidden"
            );


            profileSection.scrollIntoView({
                behavior: "smooth"
            });

        }
    );


console.log(
    "WILLIAME AI SENSI frontend initialized."
);

console.log(
    "Sensitivity generation: SERVER-SIDE."
);
