const router = require('express').Router();
const bcrypt = require('bcrypt')

router.post("/register", async (req,res)=>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        
        db.query("INSERT INTO users (email,password,firstName,lastname) VALUES (?,?,?,?)",
        [req.body.email,hashedPassword,req.body.firstName,req.body.lastName],(err,result) => {
            if (err){
                console.log(err)
                res.status(500).send("The account already exists");
            }
            else{
                // console.log(result)
                res.status(200).send("User created successfully");
            }
        });
        
    }catch {
        res.status(500).send("An error occurred");
      }
    
})

module.exports = router