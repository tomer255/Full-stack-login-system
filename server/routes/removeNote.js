const router = require("express").Router();
const verifyToken = require("../auth");
const jwt = require("jsonwebtoken");
const config = process.env;

router.post("/removeNote",verifyToken, async (req, res) => {
    jwt.verify(
        req.headers["x-access-token"],
        config.TOKEN_KEY,
        (error, authData) => {
            if (error) {
                console.log(error);
                res.status(500).send("An authentication error occurred");
            } else {
                try {
                    db.query(
                        "DELETE FROM notes WHERE email = ? and title = ?",
                        [authData.user.email, req.body.title],
                        (err, result) => {
                            if (err) {
                                console.log(err);
                                res.status(500).send("An error occurred");
                            } else {
                                res.status(200).send("Note removes");
                            }
                        }
                    );
                } catch {
                    res.status(500).send("An error occurred");
                }
            }
        }
    );
});

module.exports = router;
