const exprss = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const { urlencoded } = require('express')
const fileUpload = require('express-fileupload')
const port = process.env.PORT || 4000
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('bson')
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.em8kw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = exprss()
const reqMiddleware = [exprss.json(), urlencoded({extended:true}), cors(), exprss.static('images'), fileUpload()]
app.use(reqMiddleware)


app.get('/', (req, res) => {
    res.send('Connected')
})

client.connect(err => {
    const serviceCollection = client.db("laundryShop").collection("services");
      app.post('/addService', (req, res) => {
        const services = req.body;
        serviceCollection.insertOne(services)
        .then(result => {
          res.send(result.insertedCount > 0);
        })
        .catch(err => {
          console.log(err);
        })
      })

      app.get('/getServices', (req, res) =>{
        serviceCollection.find({})
        .toArray((err, docs) => {
          res.send(docs)
        })
      })

      app.get('/getServices/:id', (req, res) =>{
        console.log(req.params.id);
        serviceCollection.find({_id:ObjectID(req.params.id)})
        .toArray((err, docs) => {
          res.send(docs)
         console.log(docs);
        })
      })
  });
app.listen(port, () => console.log('App is listening on ' + port))


