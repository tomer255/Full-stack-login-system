const router = require('express').Router();
const bcrypt = require('bcrypt')
const changePasswordValidation = require('../validate_password.js')

router.post("/register", changePasswordValidation, async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        db.query("SELECT email FROM users where email=(?)", [email], async (error, results, fields) => {
            if (error) {
                return res.status(500).send("An error occurred");
            }
            if (results.length !== 0) {
                return res.status(400).send("The account already exists");
            }
            const hashedPassword = await bcrypt.hash(password, 10)
            db.query("INSERT INTO users (email,password,firstName,lastname) VALUES (?,?,?,?)",
                [email, hashedPassword, firstName, lastName], (error, result) => {
                    if (error) {
                        return res.status(500).send("An error occurred");
                    }
                    return res.status(200).send("User created successfully");
                });
        });
    } catch (error) {
        return res.status(500).send("An error occurred");
    }
})


module.exports = router