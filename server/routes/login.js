const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const passwordConfig = require('../config');

router.post("/login", async (req, res) => {
    const {password,email} = req.body
    db.query("SELECT id,email,password,failedLoginAttempts FROM users where email=(?)",
        [email], (error, results, fields) => {
            if (error) {
                return res.status(500).send("An error occurred");
            }
            if (results.length === 0) {
                return res.status(500).send("user email is incorrect");
            }
            if (results[0].failedLoginAttempts >= passwordConfig["maximum attempts"]) {
                return res.status(500).send("your account has been disabled due to too many failed attempts");
            }
            bcrypt.compare(password, results[0].password, (bcryptError, bcryptResults) => {
                if (bcryptError) {
                    return res.status(500).send("An error occurred");
                }
                if (!bcryptResults) {
                    db.query("UPDATE users SET failedLoginAttempts = failedLoginAttempts+1 WHERE email = (?)", [email]);
                    return res.status(500).send("Password is incorrect");
                }
                db.query("UPDATE users SET failedLoginAttempts = 0 WHERE email = (?)", [email]);
                token = jwt.sign({ user: results[0] }, process.env.TOKEN_KEY);
                return res.json({ token });
            });
        });
})

module.exports = router