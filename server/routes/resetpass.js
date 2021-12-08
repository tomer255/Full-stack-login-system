const router = require('express').Router();
const jwt = require("jsonwebtoken");
const config = process.env;
const bcrypt = require('bcrypt');
const changePasswordValidation = require('../validate_password.js');
const passwordConfig = require('../config');


router.post("/resetpass", async (req, res) => {
    try {
        const {id,token,newPassword} = req.body;

        if(!changePasswordValidation(newPassword)){
            res.status(400).send("Password must meet minimum requirements");
            return;
        }
        db.query("SELECT * FROM users where id=(?)", [id], async (error, results, fields) => {
            if (error) {
                console.log(error);
                res.status(500).send("An error occurred");
            } else {
                if (results.length === 0) {
                    res.status(400).send("Invalid id");
                } else {
                    // ----------------------------------------
                    const {password,oldPasswords} = results[0]
                    const userKey = config.TOKEN_KEY + password
                    jwt.verify(token,userKey, async (err, decoded) => {
                        if(err){
                            res.status(400).send("Invalid token");
                        }
                        else{
                            const oldPasswordsArr = oldPasswords === null ? [password] :
                            [password, ...oldPasswords.split(',')].slice(0, passwordConfig.history);
                            isNotPrevPass = await checkIfPassExists(newPassword, oldPasswordsArr);
                            if (isNotPrevPass) {
                                const newHashedPassword = await bcrypt.hash(newPassword, 10)
                                db.query("UPDATE users SET password = (?) , oldPasswords = (?) WHERE id = (?)",
                                    [newHashedPassword, oldPasswordsArr.join(','), id], (err, result) => {
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
                    })
                    // ----------------------------------------
                }
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred");
    }
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