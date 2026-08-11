/*
|--------------------------------------------------------------------------
| WILLIAME AI SENSI
| LOCAL INTELLIGENCE DATA
|--------------------------------------------------------------------------
*/

const SENSI_DATA = {

    playstyles: {

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
    },


    skillLevels: {

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
    },


    fps: {

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
    },


    ram: {
        2: -5,
        3: -3,
        4: -1,
        6: 1,
        8: 2,
        12: 3,
        16: 4,
        24: 5
    },


    platforms: {

        android: {
            sensitivity: 1,
            precision: 1
        },

        ios: {
            sensitivity: -1,
            precision: 2
        }
    }

};
