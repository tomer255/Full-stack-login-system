const router = require('express').Router();

router.post("/removeNote",async (req,res)=>{
    try{
        db.query("DELETE FROM notes WHERE email = ? and title = ?",
        [req.body.email,req.body.title],(err,result) => {
            if (err){
                console.log(err)
                res.status(500).send("An error occurred");
            }
            else{
                res.status(200).send("Note removes");
            }
        });   
    }catch {
        res.status(500).send("An error occurred");
      }
})

module.exports = router