const express = require('express')
const db = require("./connection")
const response = require("./response")

const app = express()
const port = 5174

app.use(express.json());
app.use(express.urlencoded({ extended: true}));


app.get('/',(req,res)=>{
     res.json({
          mssg : "All is okay"
     })
})

app.get('/api-request/data',(req,res)=>{
          const sql = `SELECT * FROM mahasiswa `
          db.query(sql,(err,fields)=>{
               if(err) throw err
               response(200,fields,"Get all data",res)
          })
     
})

app.listen(port,()=>{
     console.log(`Server is running on port ${port}`)
})