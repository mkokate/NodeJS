const express = require('express');
const ejs = require('ejs');
const mongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const dateComparitor = require('compare-dates');
const sgMail = require('@sendgrid/mail');
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
            res.status(401).send('Error while connecting to database')
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

app.get('/dashboard', function(req, res){
    mongoClient.connect(mongoUrl, { useNewUrlParser: true }, function(error, db){
        if (error){
            res.status(401).send('Error while connecting to database');
        }else{
            const dbo = db.db('edureka');
            dbo.collection('orders').find({}).toArray(function(error, data){
                if (error) {
                    res.status(401).send('Error while getting records from database');
                }else{
                    for(var i =0; i < data.length; i++){
                        var order = data[i];
                        order.status = getStatus(order.date);
                    }
                    res.render('dashboard', {orders: data});
                }
            })
        }
    })
})

app.get('/sendEmail/:emailId/:status', function(req, res){
    var emailId = req.params.emailId;
    var status = req.params.status;
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: emailId,
        from: 'mahesh.kokate@talentica.com',
        subject: 'Order Status',
        text: `You order status is ${status}`,
        html: '<strong>Thank You</strong>',
    };
    sgMail.send(msg);
    res.send(`Sent an email to ${emailId}`);
})

function getStatus(orderDate){
    var today = new Date();
    if (dateComparitor.isBefore(today, orderDate, 2, 'day')){
        return "Delivered"
    }else if (dateComparitor.isBefore(today, orderDate, 1, 'day')){
        return "Dispatched"
    }
    return "In Progress"
}

app.listen(port, function(error){
    if(error) throw error;
    console.log(`Server is running on ${port}`);
})