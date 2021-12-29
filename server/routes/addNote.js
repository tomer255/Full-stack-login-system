const router = require('express').Router();
const verifyToken = require("../auth");
const jwt = require("jsonwebtoken");
const config = process.env;

router.post("/addNote", verifyToken, async (req, res) => {
    jwt.verify(req.headers["x-access-token"], config.TOKEN_KEY, (error, authData) => {
        if (error) {
            return res.status(500).send("An authentication error occurred");
        }
        db.query("INSERT INTO notes (email,title,content) VALUES (?,?,?)",
            [authData.user.email, req.body.title, req.body.content], (err, result) => {
                if (err) {
                    return res.status(500).send("An error occurred");
                }
                return res.status(200).send("Node created successfully");
            });
    })
})

module.exports = router