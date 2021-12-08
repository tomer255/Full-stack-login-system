const router = require('express').Router();
const jwt = require("jsonwebtoken");
const config = process.env;
const sendResetPass = require("../sendMail")


router.post("/forgotpass", async (req, res) => {
    try {
        const {email} = req.body;

        db.query("SELECT * FROM users where email=(?)", [email], async (error, results, fields) => {
            if (error) {
                console.log(error);
                res.status(500).send("An error occurred");
            } else {
                if (results.length === 0) {
                    res.status(400).send("The account not exists");
                } else {
                    const {id,email,firstName,lastName,password} = results[0]
                    const userKey = config.TOKEN_KEY + password
                    const paylode = {
                        id : id,
                        email : email
                    }
                    const token = jwt.sign(paylode, userKey, {expiresIn: '15m'})
                    const link = `http://localhost:3000/resetpass/${id}/${token}`
                    // console.log("link: ",link)
                    sendResetPass(email, firstName, lastName, link)
                    res.status(200).send("Password link has been send to you're email");
                }
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred");
    }
})


module.exports = router