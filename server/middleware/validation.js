function validateProfile(
    req,
    res,
    next
) {

    const profile =
        req.body;


    if (
        !profile ||
        typeof profile !== "object"
    ) {

        return res.status(400).json({

            success: false,

            error:
                "Invalid profile."

        });

    }


    const requiredFields = [

        "device",
        "platform",
        "dpi",
        "screen",
        "ram",
        "fps",
        "skill",
        "playstyle"

    ];


    for (
        const field
        of requiredFields
    ) {

        if (
            profile[field] ===
            undefined ||
            profile[field] ===
            null ||
            profile[field] === ""
        ) {

            return res.status(400).json({

                success: false,

                error:
                    `Missing field: ${field}`

            });

        }

    }


    const dpi =
        Number(profile.dpi);

    const screen =
        Number(profile.screen);

    const ram =
        Number(profile.ram);

    const fps =
        Number(profile.fps);


    if (
        !Number.isFinite(dpi) ||
        dpi < 200 ||
        dpi > 1000
    ) {

        return res.status(400).json({

            success: false,

            error:
                "DPI must be between 200 and 1000."

        });

    }


    if (
        !Number.isFinite(screen) ||
        screen < 4 ||
        screen > 15
    ) {

        return res.status(400).json({

            success: false,

            error:
                "Invalid screen size."

        });

    }


    if (
        !Number.isFinite(ram) ||
        ram < 2 ||
        ram > 24
    ) {

        return res.status(400).json({

            success: false,

            error:
                "Invalid RAM value."

        });

    }


    if (
        ![30, 45, 60, 90, 120]
            .includes(fps)
    ) {

        return res.status(400).json({

            success: false,

            error:
                "Invalid FPS value."

        });

    }


    const platforms = [
        "android",
        "ios"
    ];


    if (
        !platforms.includes(
            profile.platform
        )
    ) {

        return res.status(400).json({

            success: false,

            error:
                "Invalid platform."

        });

    }


    const playstyles = [

        "one-tap",
        "drag",
        "rush",
        "sniper",
        "balanced"

    ];


    if (
        !playstyles.includes(
            profile.playstyle
        )
    ) {

        return res.status(400).json({

            success: false,

            error:
                "Invalid playstyle."

        });

    }


    next();

}


module.exports =
    {
        validateProfile
    };
