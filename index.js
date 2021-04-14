const exprss = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const { urlencoded } = require('express')
const fileUpload = require('express-fileupload')
const port = process.env.PORT || 4000
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.em8kw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = exprss()
const reqMiddleware = [exprss.json(), urlencoded({extended:true}), cors(), exprss.static('images'), fileUpload()]
app.use(reqMiddleware)






app.get('/', (req, res) => {
    res.send('Connected')
})

client.connect(err => {
    const appointmentCollection = client.db("doctors-portal").collection("appointment");
    console.log(uri);
  });
app.listen(port, () => console.log('App is listening on ' + port))


