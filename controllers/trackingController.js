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
                    const sql = `SELECT rt_lat,rt_long FROM device where device_Id='${deviceId}'`
                    db.query(sql, (err, position) => {
                         if (err) throw err;
                         res.status(200).json({ deviceId, position })
                    })
               } else {
                    const sql = `SELECT rt_lat,rt_long FROM device where device_Id='${deviceId}' AND user_id=${fields[0].user_id}`
                    db.query(sql, (err, position) => {
                         if (err) throw err;
                         res.status(200).json({ deviceId, position })
                    })
               }

          })

     } catch (error) {
          res.status(400).json({ error: error.message })
     }
}

//Kirim data tracking
const singlePost = async (req, res) => {
     const { deviceId, position } = req.body
     const currentdate = new Date();
     const datetime = currentdate.getDate() + "/"
          + (currentdate.getMonth() + 1) + "/"
          + currentdate.getFullYear() + "_"
          + currentdate.getHours() + ":"
          + currentdate.getMinutes() + ":"
          + currentdate.getSeconds();
     try {
          const sqlAdd = `
          INSERT INTO tracking(id, device_id, lat, lng, timestamp) 
          VALUES ('','${deviceId}','${position.lat}','${position.long}','${datetime}')
          `
          const sqlUpdate = `
          UPDATE device SET rt_lat='${position.lat}', rt_long='${position.long}' WHERE device_id='${deviceId}'
          `
          db.query(sqlUpdate, (err) => {
               if (err) throw err;
          })

          db.query(sqlAdd, (err) => {
               if (err) throw err;
               res.status(200).json({ deviceId, mode: "tracking", mssg: "POST Berhasil" })
          })

     } catch (error) {
          res.status(400).json({ error: error.message })
     }
}

module.exports = {
     singleGet,
     singlePost
}