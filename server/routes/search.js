const router = require('express').Router();
const verifyToken = require("../auth");
const jwt = require("jsonwebtoken");
const config = process.env;

router.post("/Search", verifyToken, async (req, res) => {
    try {
        const {search} = req.body
        const token = req.headers["x-access-token"]
        authData = jwt.verify(token, config.TOKEN_KEY);
        const {email} = authData.user;
        db.query("SELECT title , content FROM notes WHERE email = (?) AND title LIKE (?)",
            [email, `%${search}%`], (err, result) => {
                if (err) {
                    return res.status(500).send("An error occurred");
                }
                return res.status(200).send(result);
            });
    } catch {
        return res.status(500).send("An error occurred");
    }
})

module.exports = router