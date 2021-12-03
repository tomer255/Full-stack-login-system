const router = require('express').Router();
const verifyToken = require("../auth");
const jwt = require("jsonwebtoken");
const config = process.env;

router.post("/Search",verifyToken, async (req,res)=>{
    jwt.verify(req.headers["x-access-token"],config.TOKEN_KEY,(error,authData)=>{
        if(error){
            console.log(error);
            res.status(500).send("An authentication error occurred");
        }
        else{
            try{
                // db.query(`SELECT title , content FROM notes WHERE email = (?) AND title LIKE "%${req.body.search}%"`,
                // [authData.user.email],(err,result) => { // sql injection
                db.query("SELECT title , content FROM notes WHERE email = (?) AND title LIKE (?)",
                [authData.user.email,`%${req.body.search}%`],(err,result) => {
                    if (err){
                        console.log(err)
                        res.status(500).send("An error occurred");
                    }
                    else{
                        // console.log(result)
                        res.status(200).send(result);
                    }
                });  
            }catch {
                res.status(500).send("An error occurred");
              }
        }
    });
})

module.exports = router