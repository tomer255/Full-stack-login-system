const router = require('express').Router();

router.post("/Search",async (req,res)=>{
    try{
        db.query("SELECT title , content FROM notes WHERE email = (?) AND title LIKE (?)",
        [req.body.email,`%${req.body.search}%`],(err,result) => {
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
})

module.exports = router