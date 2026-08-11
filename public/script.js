/*
|--------------------------------------------------------------------------
| WILLIAME AI SENSI
|--------------------------------------------------------------------------
| LOCAL SENSITIVITY ENGINE
|--------------------------------------------------------------------------
|
| IMPORTANT:
| Ce fichier est public.
|
| AUCUNE clé API ne doit être placée ici.
|
| La future vraie IA passera par :
|
| browser
|    ↓
| /api/sensitivity
|    ↓
| server.js
|    ↓
| process.env.AI_API_KEY
|    ↓
| AI provider
|
|--------------------------------------------------------------------------
*/


const profileForm =
    document.getElementById("profileForm");

const profileSection =
    document.getElementById("profileSection");

const analysisSection =
    document.getElementById("analysisSection");

const resultSection =
    document.getElementById("resultSection");

const generateButton =
    document.getElementById("generateButton");

const progressBar =
    document.getElementById("progressBar");

const progressText =
    document.getElementById("progressText");

const analysisTitle =
    document.getElementById("analysisTitle");

const analysisDescription =
    document.getElementById("analysisDescription");

const analysisStage =
    document.getElementById("analysisStage");

const toast =
    document.getElementById("toast");


let currentProfile = null;
let currentResult = null;


/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function clamp(
    value,
    min,
    max
) {

    return Math.min(
        Math.max(value, min),
        max
    );
}


function round(value) {
    return Math.round(value);
}


function normalize(
    value,
    min,
    max
) {

    return clamp(
        (value - min) / (max - min),
        0,
        1
    );
}


function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2600);
}


/*
|--------------------------------------------------------------------------
| GET PROFILE
|--------------------------------------------------------------------------
*/

function getProfile() {

    const playstyle =
        document.querySelector(
            'input[name="playstyle"]:checked'
        )?.value;


    return {

        playerName:
            document
                .getElementById("playerName")
                .value
                .trim(),

        device:
            document
                .getElementById("device")
                .value
                .trim(),

        platform:
            document
                .getElementById("platform")
                .value,

        dpi:
            Number(
                document
                    .getElementById("dpi")
                    .value
            ),

        screen:
            Number(
                document
                    .getElementById("screen")
                    .value
            ),

        ram:
            Number(
                document
                    .getElementById("ram")
                    .value
            ),

        fps:
            Number(
                document
                    .getElementById("fps")
                    .value
            ),

        skill:
            document
                .getElementById("skill")
                .value,

        playstyle

    };
}


/*
|--------------------------------------------------------------------------
| DEVICE SCORING
|--------------------------------------------------------------------------
*/

function calculateDeviceScore(profile) {

    const dpiScore =
        1 -
        Math.abs(
            profile.dpi - 520
        ) / 320;


    const screenScore =
        1 -
        Math.abs(
            profile.screen - 6.6
        ) / 3;


    const fpsScore =
        normalize(
            profile.fps,
            30,
            120
        );


    const ramScore =
        normalize(
            profile.ram,
            2,
            16
        );


    return {

        dpi:
            clamp(
                dpiScore,
                0,
                1
            ),

        screen:
            clamp(
                screenScore,
                0,
                1
            ),

        fps:
            fpsScore,

        ram:
            ramScore

    };
}


/*
|--------------------------------------------------------------------------
| LOCAL AI ENGINE
|--------------------------------------------------------------------------
|
| C'est le moteur utilisé dans cette première version.
|
| Il ne prétend PAS utiliser une API externe.
|
|--------------------------------------------------------------------------
*/

function generateSensitivity(profile) {

    const style =
        SENSI_DATA
            .playstyles[
                profile.playstyle
            ];


    const skill =
        SENSI_DATA
            .skillLevels[
                profile.skill
            ];


    const fps =
        SENSI_DATA
            .fps[
                profile.fps
            ];


    const platform =
        SENSI_DATA
            .platforms[
                profile.platform
            ];


    const ramAdjustment =
        SENSI_DATA.ram[
            profile.ram
        ] || 0;


    const device =
        calculateDeviceScore(
            profile
        );


    const stabilityScore =
        (
            device.fps * 0.40 +
            device.ram * 0.25 +
            device.screen * 0.15 +
            device.dpi * 0.20
        ) * 100;


    const base =
        176 +

        ((device.dpi - 0.5) * 8) +

        ((device.fps - 0.5) * 5) +

        ((device.screen - 0.5) * 4) +

        ramAdjustment +

        fps.sensitivity +

        skill.sensitivity +

        platform.sensitivity +

        style.general;


    const general =
        clamp(
            round(base),
            80,
            200
        );


    const redDot =
        clamp(
            round(
                base +
                style.redDot +
                device.dpi * 4 +
                fps.sensitivity
            ),
            70,
            200
        );


    const scope2 =
        clamp(
            round(
                base -
                6 +
                style.scope2 +
                skill.sensitivity * 0.4
            ),
            60,
            200
        );


    const scope4 =
        clamp(
            round(
                base -
                18 +
                style.scope4 +
                skill.sensitivity * 0.25
            ),
            50,
            200
        );


    const sniper =
        clamp(
            round(
                118 +
                style.sniper +
                skill.precision +
                platform.precision +
                device.screen * 4
            ),
            60,
            180
        );


    const freeLook =
        clamp(
            round(
                base +
                8 +
                style.freeLook +
                device.fps * 3
            ),
            80,
            200
        );


    const fireButton =
        clamp(
            round(
                style.fireButton +
                (profile.screen - 6.5) * 1.5 +
                (profile.dpi - 520) / 100 +
                skill.control * 0.4
            ),
            40,
            60
        );


    const aimSpeed =
        clamp(
            round(
                78 +
                device.fps * 9 +
                device.dpi * 4 +
                style.aimSpeed +
                skill.sensitivity * 1.5
            ),
            60,
            99
        );


    const precision =
        clamp(
            round(
                78 +
                device.screen * 7 +
                device.ram * 4 +
                style.precision +
                skill.precision +
                platform.precision * 2
            ),
            60,
            99
        );


    const dragControl =
        clamp(
            round(
                76 +
                device.dpi * 5 +
                device.fps * 6 +
                style.dragControl +
                skill.control
            ),
            60,
            99
        );


    const headshot =
        clamp(
            round(
                78 +
                device.fps * 4 +
                device.dpi * 5 +
                style.headshot +
                skill.headshot
            ),
            60,
            99
        );


    const aiScore =
        clamp(
            round(
                aimSpeed * 0.22 +
                precision * 0.28 +
                dragControl * 0.22 +
                headshot * 0.28
            ),
            60,
            99
        );


    return {

        sensitivity: {

            general,
            redDot,
            scope2,
            scope4,
            sniper,
            freeLook

        },

        dpi:
            profile.dpi,

        fireButton,

        performance: {

            aimSpeed,
            precision,
            dragControl,
            headshot

        },

        aiScore,

        stabilityScore

    };
}


/*
|--------------------------------------------------------------------------
| ANALYSIS ANIMATION
|--------------------------------------------------------------------------
*/

const analysisStages = [

    {
        title:
            "ANALYZING DEVICE...",

        description:
            "Reading hardware characteristics",

        stage:
            "DEVICE ANALYSIS",

        progress:
            15
    },

    {
        title:
            "ANALYZING DPI...",

        description:
            "Calculating touch sensitivity response",

        stage:
            "DPI ANALYSIS",

        progress:
            31
    },

    {
        title:
            "ANALYZING PLAYSTYLE...",

        description:
            "Matching aim behavior",

        stage:
            "PLAYSTYLE ANALYSIS",

        progress:
            48
    },

    {
        title:
            "CALCULATING AIM RESPONSE...",

        description:
            "Building sensitivity response model",

        stage:
            "AIM RESPONSE",

        progress:
            66
    },

    {
        title:
            "OPTIMIZING SENSITIVITY...",

        description:
            "Balancing speed and precision",

        stage:
            "OPTIMIZATION",

        progress:
            83
    },

    {
        title:
            "GENERATING S-RANK CONFIGURATION...",

        description:
            "Finalizing your personalized profile",

        stage:
            "GENERATION",

        progress:
            100
    }

];


function runAnalysis() {

    return new Promise(
        resolve => {

            let index = 0;


            function nextStage() {

                const stage =
                    analysisStages[index];


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


                index++;


                if (
                    index <
                    analysisStages.length
                ) {

                    setTimeout(
                        nextStage,
                        620
                    );

                } else {

                    setTimeout(
                        resolve,
                        750
                    );

                }

            }


            nextStage();

        }
    );
}


/*
|--------------------------------------------------------------------------
| DISPLAY RESULT
|--------------------------------------------------------------------------
*/

function displayResult(
    profile,
    result
) {

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
        "fireButton"
    ).textContent =
        `${result.fireButton}%`;


    const performance =
        result.performance;


    document.getElementById(
        "aimSpeed"
    ).textContent =
        `${performance.aimSpeed}%`;


    document.getElementById(
        "precision"
    ).textContent =
        `${performance.precision}%`;


    document.getElementById(
        "dragControl"
    ).textContent =
        `${performance.dragControl}%`;


    document.getElementById(
        "headshot"
    ).textContent =
        `${performance.headshot}%`;


    document.getElementById(
        "aimSpeedBar"
    ).style.width =
        `${performance.aimSpeed}%`;


    document.getElementById(
        "precisionBar"
    ).style.width =
        `${performance.precision}%`;


    document.getElementById(
        "dragControlBar"
    ).style.width =
        `${performance.dragControl}%`;


    document.getElementById(
        "headshotBar"
    ).style.width =
        `${performance.headshot}%`;


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
        profile.platform.toUpperCase();


    document.getElementById(
        "dpiValue"
    ).textContent =
        profile.dpi;


    document.getElementById(
        "fpsValue"
    ).textContent =
        `${profile.fps} FPS`;


    document.getElementById(
        "styleValue"
    ).textContent =
        profile.playstyle.toUpperCase();


    document.getElementById(
        "resultSubtitle"
    ).textContent =
        `${profile.playerName}'s optimized configuration`;


    const ring =
        document.getElementById(
            "scoreRing"
        );


    const angle =
        result.aiScore * 3.6;


    ring.style.setProperty(
        "--score-angle",
        `${angle}deg`
    );
}


/*
|--------------------------------------------------------------------------
| GENERATE
|--------------------------------------------------------------------------
*/

profileForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        currentProfile =
            getProfile();


        if (
            !currentProfile.playstyle
        ) {

            showToast(
                "Select a playstyle first."
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


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


        await runAnalysis();


        currentResult =
            generateSensitivity(
                currentProfile
            );


        displayResult(
            currentProfile,
            currentResult
        );


        analysisSection.classList.add(
            "hidden"
        );


        resultSection.classList.remove(
            "hidden"
        );


        generateButton.disabled =
            false;


        setTimeout(() => {

            resultSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 100);

    }
);


/*
|--------------------------------------------------------------------------
| COPY
|--------------------------------------------------------------------------
*/

document
    .getElementById("copyButton")
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
RANK           S-RANK 🔥
            `.trim();


            try {

                await navigator
                    .clipboard
                    .writeText(text);


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


/*
|--------------------------------------------------------------------------
| SHARE
|--------------------------------------------------------------------------
*/

document
    .getElementById("shareButton")
    .addEventListener(
        "click",
        async () => {

            if (!currentResult) {
                return;
            }


            if (
                navigator.share
            ) {

                try {

                    await navigator.share({

                        title:
                            "WILLIAME AI SENSI",

                        text:
                            `WILLIAME AI SENSI — ${currentResult.aiScore}/100 S-RANK 🔥`

                    });

                } catch {
                    // Cancelled.
                }

            } else {

                showToast(
                    "Sharing is not supported."
                );

            }

        }
    );


/*
|--------------------------------------------------------------------------
| GENERATE AGAIN
|--------------------------------------------------------------------------
*/

document
    .getElementById("againButton")
    .addEventListener(
        "click",
        async () => {

            if (!currentProfile) {
                return;
            }


            resultSection.classList.add(
                "hidden"
            );


            analysisSection.classList.remove(
                "hidden"
            );


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });


            await runAnalysis();


            currentResult =
                generateSensitivity(
                    currentProfile
                );


            displayResult(
                currentProfile,
                currentResult
            );


            analysisSection.classList.add(
                "hidden"
            );


            resultSection.classList.remove(
                "hidden"
            );

        }
    );


/*
|--------------------------------------------------------------------------
| MODIFY PROFILE
|--------------------------------------------------------------------------
*/

document
    .getElementById("modifyButton")
    .addEventListener(
        "click",
        () => {

            resultSection.classList.add(
                "hidden"
            );


            profileSection.classList.remove(
                "hidden"
            );


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );


/*
|--------------------------------------------------------------------------
| STARTUP
|--------------------------------------------------------------------------
*/

console.log(
    "WILLIAME AI SENSI initialized."
);

console.log(
    "Local sensitivity engine: ONLINE"
);

console.log(
    "External AI: SERVER-SIDE ONLY"
);
