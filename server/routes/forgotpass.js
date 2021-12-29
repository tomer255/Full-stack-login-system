const router = require('express').Router();
const jwt = require("jsonwebtoken");
const config = process.env;
const sendResetPass = require("../sendMail")


router.post("/forgotpass", async (req, res) => {
    try {
        const { email } = req.body;
        db.query("SELECT * FROM users where email=(?)", [email], async (error, results, fields) => {
            if (error) {
                return res.status(500).send("An error occurred");
            }
            if (results.length === 0) {
                return res.status(400).send("The account not exists");
            }
            const { id, email, firstName, lastName, password } = results[0]
            const userKey = config.TOKEN_KEY + password
            const paylode = {
                id: id,
                email: email
            }
            const token = jwt.sign(paylode, userKey, { expiresIn: '15m' })
            const link = config.FRONT + `/resetpass/${id}/${token}`
            // console.log("link: ",link)
            sendResetPass(email, firstName, lastName, link)
            return res.status(200).send("Password link has been send to you're email");
        });
    } catch (error) {
        return res.status(500).send("An error occurred");
    }
})


module.exports = router