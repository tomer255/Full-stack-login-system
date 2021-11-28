const router = require('express').Router();
const bcrypt = require('bcrypt')

router.post("/login",async (req,res)=>{
    try{
    db.query("SELECT password FROM users where email=(?)",[req.body.email], (error, results, fields) => {
        if (error){
            // console.log(error);
            res.status(500).send("An error occurred");
        }
        else{
            if(results.length == 0){
                res.status(500).send("user name or password is incorrect");
            }
            else{
            bcrypt.compare(req.body.password, results[0].password, (berr, bres) => {
                if (berr){
                  // handle error
                  res.status(500).send("An error occurred");
                }
                if (bres){
                  // Send JWT
                  res.status(200).send("User fond");
                } 
                else {
                  // response is OutgoingMessage object that server response http request
                    res.status(500).send("User name or password is incorrect");
                }
              });
            }
        }
      });
    }catch {
        res.status(500).send("An error occurred");
    }
})

module.exports = router