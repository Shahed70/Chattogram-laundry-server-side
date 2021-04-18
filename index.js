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
    const reviewsCollection = client.db("laundryShop").collection("reviews");
    const bookingsCollection = client.db("laundryShop").collection("booking");

    // Service section api
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
        serviceCollection.find({_id:ObjectID(req.params.id)})
        .toArray((err, docs) => {
          res.send(docs)
        })
      })

      app.post('/delService/:id', (req, res) =>{
        serviceCollection.deleteOne({_id:ObjectID(req.params.id)})
        .then(result => {
          console.log(result);
        })
      })



      // Review section api
      app.post('/setReview' , (req, res) => {
          const reviews = req.body
          reviewsCollection.insertOne(reviews)
          .then(result => {
            res.send(result)
          })
          .catch(err => console.log(err))
      })

      app.get('/getReview', (req, res) => {
        reviewsCollection.find({})
        .toArray((err, docs) =>{
          res.send(docs)
        })
      })


      //Booking section api
      app.post('/setBookedInfo',(req, res) =>{
        const bookedInfo = req.body
        bookingsCollection.insertOne(bookedInfo)
        .then(result => {
          res.send(result)
        })
        .catch(err => {
          console.log(err);
        })
      })

      app.get('/getBookedInfo',(req, res) =>{
        const bookedInfo = req.body
        bookingsCollection.find({})
        .toArray((err, docs) => {
          res.send(docs)
        })
      })
  });
app.listen(port, () => console.log('App is listening on ' + port))


