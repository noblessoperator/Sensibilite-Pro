
const PLAYSTYLE_DATA = {

    "one-tap": {

        general: 4,
        redDot: 6,
        scope2: 3,
        scope4: 0,
        sniper: -15,
        freeLook: 2,
        fireButton: 47,

        aimSpeed: 3,
        precision: 5,
        dragControl: 3,
        headshot: 6

    },


    drag: {

        general: 7,
        redDot: 7,
        scope2: 4,
        scope4: 1,
        sniper: -12,
        freeLook: 3,
        fireButton: 49,

        aimSpeed: 6,
        precision: 2,
        dragControl: 7,
        headshot: 7

    },


    rush: {

        general: 9,
        redDot: 6,
        scope2: 3,
        scope4: 0,
        sniper: -20,
        freeLook: 4,
        fireButton: 51,

        aimSpeed: 8,
        precision: 0,
        dragControl: 5,
        headshot: 5

    },


    sniper: {

        general: -4,
        redDot: 1,
        scope2: -2,
        scope4: -6,
        sniper: -10,
        freeLook: 0,
        fireButton: 44,

        aimSpeed: -2,
        precision: 10,
        dragControl: 1,
        headshot: 5

    },


    balanced: {

        general: 3,
        redDot: 3,
        scope2: 2,
        scope4: 1,
        sniper: -7,
        freeLook: 2,
        fireButton: 48,

        aimSpeed: 3,
        precision: 4,
        dragControl: 4,
        headshot: 4

    }

};


const SKILL_DATA = {

    beginner: {
        sensitivity: -5,
        precision: 4,
        control: 5,
        headshot: -2
    },

    intermediate: {
        sensitivity: 0,
        precision: 2,
        control: 2,
        headshot: 1
    },

    advanced: {
        sensitivity: 3,
        precision: 0,
        control: 0,
        headshot: 3
    },

    pro: {
        sensitivity: 5,
        precision: 1,
        control: -1,
        headshot: 5
    }

};


const FPS_DATA = {

    30: {
        sensitivity: -7,
        precision: -3,
        control: -2
    },

    45: {
        sensitivity: -3,
        precision: 0,
        control: 0
    },

    60: {
        sensitivity: 0,
        precision: 2,
        control: 2
    },

    90: {
        sensitivity: 3,
        precision: 3,
        control: 3
    },

    120: {
        sensitivity: 5,
        precision: 4,
        control: 4
    }

};


const PLATFORM_DATA = {

    android: {
        sensitivity: 1,
        precision: 1
    },

    ios: {
        sensitivity: -1,
        precision: 2
    }

};


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
        (value - min) /
        (max - min),
        0,
        1
    );

}


function generateSensitivity(
    profile
) {

    const style =
        PLAYSTYLE_DATA[
            profile.playstyle
        ];

    const skill =
        SKILL_DATA[
            profile.skill
        ];

    const fps =
        FPS_DATA[
            profile.fps
        ];

    const platform =
        PLATFORM_DATA[
            profile.platform
        ];


    const dpiFactor =
        1 -
        Math.abs(
            profile.dpi - 520
        ) / 320;


    const screenFactor =
        1 -
        Math.abs(
            profile.screen - 6.6
        ) / 3;


    const fpsFactor =
        normalize(
            profile.fps,
            30,
            120
        );


    const ramFactor =
        normalize(
            profile.ram,
            2,
            16
        );


    const deviceScore =
        (
            dpiFactor * 0.20 +
            screenFactor * 0.15 +
            fpsFactor * 0.40 +
            ramFactor * 0.25
        ) * 100;


    const base =
        176 +

        ((dpiFactor - 0.5) * 8) +

        ((fpsFactor - 0.5) * 5) +

        ((screenFactor - 0.5) * 4) +

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
                dpiFactor * 4 +
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
                style.scope2
            ),
            60,
            200
        );


    const scope4 =
        clamp(
            round(
                base -
                18 +
                style.scope4
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
                screenFactor * 4
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
                fpsFactor * 3
            ),
            80,
            200
        );


    const fireButton =
        clamp(
            round(
                style.fireButton +
                (profile.screen - 6.5) *
                1.5 +
                (profile.dpi - 520) /
                100 +
                skill.control * 0.4
            ),
            40,
            60
        );


    const aimSpeed =
        clamp(
            round(
                78 +
                fpsFactor * 9 +
                dpiFactor * 4 +
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
                screenFactor * 7 +
                ramFactor * 4 +
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
                dpiFactor * 5 +
                fpsFactor * 6 +
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
                fpsFactor * 4 +
                dpiFactor * 5 +
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

        rank:
            aiScore >= 90
                ? "S-RANK"
                : aiScore >= 80
                    ? "A-RANK"
                    : aiScore >= 70
                        ? "B-RANK"
                        : "C-RANK",

        engine:
            "local"

    };

}


module.exports = {
    generateSensitivity
};
