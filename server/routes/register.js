const router = require('express').Router();
const bcrypt = require('bcrypt')
const changePasswordValidation = require('../validate_password.js')

router.post("/register", async (req,res)=>{
    try{
        const { email, password, firstName, lastName } = req.body;

        if(changePasswordValidation(password)){
            res.status(400).send("Password must meet minimum requirements");
            return;
        }
        db.query("SELECT * FROM users where email=(?)",[email],async (error, results, fields) => {
            if (error){
                console.log(error);
                res.status(500).send("An error occurred");
                return;
            }
            else{
                if(results.length != 0){
                    res.status(400).send("The account already exists");
                    return;
                }
                else{
                    const hashedPassword = await bcrypt.hash(password, 10)
                    db.query("INSERT INTO users (email,password,firstName,lastname) VALUES (?,?,?,?)",
                    [email,hashedPassword,firstName,lastName],(err,result) => {
                        if (err){
                            // console.log(err)
                            res.status(500).send("An error occurred");
                        }
                        else{
                            // console.log(result)
                            res.status(200).send("User created successfully");
                        }
                    }); 
                }
            }
            });
    }catch(error) {
        res.status(500).send("An error occurred");
      }
    
})



module.exports = router