const router = require('express').Router();
const verifyToken = require("../auth");
const jwt = require("jsonwebtoken");
const config = process.env;
const bcrypt = require('bcrypt');
const changePasswordValidation = require('../validate_password.js');
const passwordConfig = require('../config');

router.post("/changePassword", verifyToken, async (req, res) => {
    const {currentPassword, newPassword} = req.body;
    jwt.verify(req.headers["x-access-token"], config.TOKEN_KEY, (error, authData) => {
        if (error) {
            console.log(error);
            res.status(500).send("An authentication error occurred");
        } else {
            if (changePasswordValidation(newPassword)) {
                res.status(400).send("Password must meet minimum requirements");
                return;
            }
            bcrypt.compare(currentPassword, authData.user.password, async (bcryptError, bcryptResults) => {
                if (bcryptError) {
                    console.log(bcryptError);
                    res.status(500).send("An error occurred");
                }
                if (bcryptResults) {
                    try {
                        db.query("SELECT password,oldPasswords FROM users WHERE email = (?)",
                            [authData.user.email], async (oldPassError, oldPassResult) => {
                                if (oldPassError) {
                                    console.log(oldPassError);
                                    res.status(500).send("An error occurred");
                                } else {

                                    const oldPasswordsArr = oldPassResult[0].oldPasswords === null ? [oldPassResult[0].password] :
                                        [oldPassResult[0].password, ...oldPassResult[0].oldPasswords.split(',')].slice(0, passwordConfig.history);
                                    isNotPrevPass = await checkIfPassExists(newPassword, oldPasswordsArr);
                                    if (isNotPrevPass) {
                                        const newHashedPassword = await bcrypt.hash(newPassword, 10)
                                        db.query("UPDATE users SET password = (?) , oldPasswords = (?) WHERE email = (?)",
                                            [newHashedPassword, oldPasswordsArr.join(','), authData.user.email], (err, result) => {
                                                if (err) {
                                                    console.log(err)
                                                    res.status(500).send("An error occurred");
                                                } else {
                                                    res.status(200).send("password changed");
                                                }
                                            });
                                    } else {
                                        res.status(400).send("You have already used this password");
                                    }
                                }
                            });
                    } catch (error) {
                        console.log(error)
                        res.status(500).send("An error occurred");
                    }
                } else {
                    res.status(500).send("Password is incorrect");
                }
            });
        }
    });
})

async function checkIfPassExists(password, previousPasswords) {
    passNotMatched = true
    for (var i = 0; i < previousPasswords.length; i++) {
        const resultOfCompa = await bcrypt.compare(
            password,
            previousPasswords[i]
        );
        if (resultOfCompa) {
            passNotMatched = false;
        }
    }
    return passNotMatched;
}

module.exports = router