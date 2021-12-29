const router = require('express').Router();
const verifyToken = require("../auth");
const jwt = require("jsonwebtoken");
const config = process.env;
const bcrypt = require('bcrypt');
const changePasswordValidation = require('../validate_password.js');
const passwordConfig = require('../config');

router.post("/changePassword", changePasswordValidation, verifyToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    jwt.verify(req.headers["x-access-token"], config.TOKEN_KEY, (error, authData) => {
        if (error) {
            return res.status(500).send("An authentication error occurred");
        }
        bcrypt.compare(currentPassword, authData.user.password, async (bcryptError, bcryptResults) => {
            if (bcryptError) {
                return res.status(500).send("An error occurred");
            }
            if (!bcryptResults) {
                return res.status(500).send("Password is incorrect");
            }
            const {email} =authData.user
            db.query("SELECT password,oldPasswords FROM users WHERE email = (?)",
                [email], async (oldPassError, oldPassResult) => {
                    if (oldPassError) {
                        return res.status(500).send("An error occurred");
                    }
                    const oldPasswordsArr = oldPassResult[0].oldPasswords === null ? [oldPassResult[0].password] :
                        [oldPassResult[0].password, ...oldPassResult[0].oldPasswords.split(',')].slice(0, passwordConfig.history);
                    isPrevPass = await checkIfPassExists(newPassword, oldPasswordsArr);
                    if (isPrevPass) {
                        return res.status(400).send("You have already used this password");
                    }
                    const newHashedPassword = await bcrypt.hash(newPassword, 10)
                    db.query("UPDATE users SET password = (?) , oldPasswords = (?) WHERE email = (?)",
                        [newHashedPassword, oldPasswordsArr.join(','), authData.user.email], (err, result) => {
                            if (err) {
                                return res.status(500).send("An error occurred");
                            }
                            return res.status(200).send("password changed");
                        });
                });
        });
    });
})

async function checkIfPassExists(password, previousPasswords) {
    for (var i = 0; i < previousPasswords.length; i++) {
        const resultOfCompa = await bcrypt.compare(
            password,
            previousPasswords[i]
        );
        if (resultOfCompa) {
            return true;
        }
    }
    return false;
}

module.exports = router