const db = require("../connection")
const jwt = require('jsonwebtoken')

// Ambil data tracking
const singleGet = async (req, res) => {
     const { deviceId } = req.params
     try {
          const { authorization } = req.headers
          if (!authorization) {
               return res.status(401).json({ error: "Authorization token required" })
          }

          const getToken = authorization.split(' ')[1]
          const { _id } = jwt.verify(getToken, process.env.SECRET)

          const getUserId = `select user_id,role from user where email='${_id}'`
          db.query(getUserId, (err, fields) => {
               if (fields[0].role == 1) {
                    const sql = `SELECT rt_arus,rt_tegangan,rt_daya,rt_baterai FROM device where device_Id='${deviceId}'`
                    db.query(sql, (err, datas) => {
                         if (err) throw err;
                         res.status(200).json({ deviceId, datas })
                    })
               } else {
                    const sql = `SELECT rt_arus,rt_tegangan,rt_daya,rt_baterai FROM device where device_Id='${deviceId}' AND user_id=${user_id}`
                    db.query(sql, (err, datas) => {
                         if (err) throw err; 
                         res.status(200).json({ deviceId, datas })
                    })
               }

          })

     } catch (error) {
          res.status(400).json({ error: error.message })
     }
}

//Kirim data Monitoring
const singlePost = async (req, res) => {
     const { deviceId, datas } = req.body
     const currentdate = new Date();
     const datetime = currentdate.getDate() + "/"
          + (currentdate.getMonth() + 1) + "/"
          + currentdate.getFullYear() + "_"
          + currentdate.getHours() + ":"
          + currentdate.getMinutes() + ":"
          + currentdate.getSeconds();
     try {
          const sqlAdd = `
          INSERT INTO monitoring(id, device_id, tegangan,arus,daya,baterai, timestamp) 
          VALUES ('','${deviceId}','${datas.tegangan}','${datas.arus}','${datas.daya}','${datas.baterai}','${datetime}')
          `
          const sqlUpdate = `
          UPDATE device SET rt_tegangan='${datas.tegangan}', rt_arus='${datas.arus}',rt_daya='${datas.daya}',rt_baterai='${datas.baterai}' WHERE device_id='${deviceId}'
          `
          db.query(sqlUpdate, (err) => {
               if (err) throw err;
          })

          db.query(sqlAdd, (err) => {
               if (err) throw err;
               res.status(200).json({ deviceId, mode: "monitoring", mssg: "POST Berhasil" })
          })

     } catch (error) {
          res.status(400).json({ error: error.message })
     }
}

module.exports = {
     singleGet,
     singlePost
}