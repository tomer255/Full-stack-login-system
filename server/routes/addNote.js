const router = require('express').Router();

router.post("/addNote",async (req,res)=>{
    try{
        db.query("INSERT INTO notes (email,title,content) VALUES (?,?,?)",
        [req.body.email,req.body.title,req.body.content,],(err,result) => {
            if (err){
                console.log(err)
                res.status(500).send("An error occurred");
            }
            else{
                // console.log(result)
                res.status(200).send("Node created successfully");
            }
        });
        
    }catch {
        res.status(500).send("An error occurred");
      }
})

module.exports = router