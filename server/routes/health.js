
const express = require("express");

const router = express.Router();


router.get(
    "/",
    (req, res) => {

        res.status(200).json({

            success: true,

            application:
                "WILLIAME AI SENSI",

            status:
                "online",

            engine:
                "local",

            aiConfigured:
                Boolean(
                    process.env.AI_API_KEY
                ),

            timestamp:
                new Date().toISOString()

        });

    }
);


module.exports = router;
