const express = require('express');
const ejs = require('ejs');
const mongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const port = process.env.port || 3200;
const app = express();
const mongoUrl= "mongodb://localhost:27017";

app.use(express.static(__dirname+'/public'))
app.set('views', "./src/views");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.render('index');
})

app.post('/submitOrder', function(req, res){
    mongoClient.connect(mongoUrl, { useNewUrlParser: true }, function(error, db){
        if(error) {
            res.status(401).send('error while connecting..')
        }else{
            const database = db.db('edureka');
            var order = {name: req.body.name, address: req.body.address, email: req.body.email, product: req.body.product, date: new Date()};
            database.collection('orders').insertOne(order, function(error, result){
                if(error) throw error;
                res.send('Thank you! You order sent successfully');
            })
        }
    })
})

app.listen(port, function(error){
    if(error) throw error;
    console.log(`Server is running on ${port}`);
})