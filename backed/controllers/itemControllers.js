const db = require ('../config/db')

// add data

exports.addApplication = (req , res)=> {
  const {full_name , email , phone , role , description} = req.body

  db.query(
    "insert into applications (full_name , email , phone , role , description) values (?,?,?,?,?)",
    [full_name , email ,phone , role ,description ],
    (err , result)=>{
      if(err){
        return
        res.send(err);

      }
      res.json({message :"Addes" })
    }
  )

}