import express from 'express';
import bodyParser from 'body-parser';
const dateComparitor = require('compare-dates');

const MongoClient = require('mongodb').MongoClient;
const app = express();
const port = process.env.port || 3700;
const mongourl = 'mongodb://localhost:27017';
const newIssueRouter = require('./src/routes/NewIssueRoute')();
let db;
let issues = new Array();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname+'/public'));
app.use('/newIssue', newIssueRouter);
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.get('/', (req,res) => {
    db.collection('issues').find({}).toArray((error, data) => {
        if(error){
            res.status(401).send('Error while getting records from database');
        }else{
            issues = data;
            for(var i =0; i < issues.length; i++){
                var issue = issues[i];
                issue.needToHighlight = getStatus(issue.date);
                issue.leftoverDays = getLeftoverDays(issue.date);
            }
            res.render('index', {issues});
        }
    })
})

app.post('/addIssue', (req, res) => {
    db.collection('issues').insertOne(req.body, function(error, result){
        if(error) throw error;
        let newIssue = req.body;
        newIssue.date = new Date();
        issues.push(newIssue);
        for(var i =0; i < issues.length; i++){
            var issue = issues[i];
            issue.needToHighlight = getStatus(issue.date);
            issue.leftoverDays = getLeftoverDays(issue.date);
        }
        res.render('index', {issues});
    })
})

MongoClient.connect(mongourl, { useNewUrlParser: true }, (error, client) => {
    if (error){
        throw error;
    }else{
        db = client.db('edureka');
        app.listen(port, (error) => {
            if(error) throw error;
            console.log(`Server is running on port ${port}`);
        });
    }
})

function getLeftoverDays(issueDate){
    let dateAfterThreeDays = dateComparitor.add(issueDate, 3, 'day');
    let today = new Date();
    let timeDifference = Math.abs(dateAfterThreeDays.getTime() - today.getTime());
    let leftoverDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
    if(leftoverDays > 0){
        return leftoverDays;
    }else{
        return 0;
    }
}

function getStatus(issueDate){
    var today = new Date();
    if (dateComparitor.isBefore(today, issueDate, 3, 'day')){
        return true;
    }
    return false;
}