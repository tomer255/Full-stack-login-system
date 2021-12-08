const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const passwordConfig = require('../config');

router.post("/login", async (req, res) => {
    try {
        db.query("SELECT id,email,password,failedLoginAttempts FROM users where email=(?)",
            [req.body.email], (error, results, fields) => {
                if (error) {
                    // console.log(error);
                    res.status(500).send("An error occurred");
                } else {
                    if (results.length === 0) {
                        res.status(500).send("user name is incorrect");
                    } else if (results[0].failedLoginAttempts >= passwordConfig["maximum attempts"]) {
                        res.status(500).send("your account has been disabled for too many failed attempts");
                    } else {
                        bcrypt.compare(req.body.password, results[0].password, (bcryptError, bcryptResults) => {
                            if (bcryptError) {
                                res.status(500).send("An error occurred");
                            }
                            if (bcryptResults) {
                                db.query("UPDATE users SET failedLoginAttempts = 0 WHERE email = (?)", [req.body.email])
                                jwt.sign({user: results[0]}, process.env.TOKEN_KEY, (jwtError, token) => {
                                    if (jwtError) {
                                        res.status(500).send("An error occurred");
                                    } else {
                                        res.json({token})
                                    }
                                })
                            } else {
                                db.query("UPDATE users SET failedLoginAttempts = failedLoginAttempts+1 WHERE email = (?)", [req.body.email])
                                res.status(500).send("Password is incorrect");
                            }
                        });
                    }
                }
            });
    } catch {
        res.status(500).send("An error occurred");
    }
})

module.exports = router