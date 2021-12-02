const router = require('express').Router();
const verifyToken = require("../auth");
const jwt = require("jsonwebtoken");
const config = process.env;
const bcrypt = require('bcrypt');
const changePasswordValidation = require('../validate_password.js');

router.post("/changePassword", verifyToken, async (req,res)=>{
    const { currentPassword, newPassword} = req.body;
    jwt.verify(req.headers["x-access-token"],config.TOKEN_KEY,(error,authData)=>{
        if(error){
            console.log(error);
            res.status(500).send("An authentication error occurred");
        }
        else{
            if(changePasswordValidation(newPassword)){
                res.status(400).send("Password must meet minimum requirements");
                return;
            }
            bcrypt.compare(currentPassword, authData.user.password, async (bcryptError, bcryptResults) => {
                if (bcryptError){
                    console.log(bcryptError)
                  res.status(500).send("An error occurred");
                }
                if (bcryptResults){
                    //------------------------------------------
                    //          TODO: store old passwor
                    //------------------------------------------
                    const newHashedPassword = await bcrypt.hash(newPassword, 10)
                    try{
                        db.query("UPDATE users SET password = (?) WHERE email = (?)",
                        [newHashedPassword,authData.user.email],(err,result) => {
                            if (err){
                                console.log(err)
                                res.status(500).send("An error occurred");
                            }
                            else{
                                res.status(200).send("password changed");
                            }
                        });   
                    }catch(error) {
                        console.log(error)
                        res.status(500).send("An error occurred");
                      }
                } 
                else {
                    res.status(500).send("Password is incorrect");
                }
              });
        }
    });
})

module.exports = router