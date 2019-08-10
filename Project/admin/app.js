import express from 'express';
import config from './config';
import jwt from 'jsonwebtoken';
import User from './user/User';
import News from './news/News';
import db from './db';

const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch')
const app = express();
const port = 7600;

// Set paths
app.use(express.static(__dirname+'/public'));
app.set('views', './src/views');
app.set('view engine', 'ejs');

// Register routers
const authHandler = require('./auth/AuthHandler');
app.use('/api/auth', authHandler);
const newsManager = require('./news/NewsManager');
app.use('/news', newsManager);

// Default routes
app.get('/',(req,res) => {
    res.redirect('/api/auth/signin');
});

app.get('/home',(req,res) => {
    var token = localStorage.getItem('authtoken');
    if(!token) {
        res.redirect('/api/auth/signin');
    }       
    jwt.verify(token, config.secert, (err, decoded) => {
        if(err) {
            res.redirect('/api/auth/signin');
        }
        User.findById(decoded.id, {password:0}, (err,user) => {
            if(err) {res.redirect('/api/auth/signin')}
            if(!user) {res.redirect('/api/auth/signin')}

            News.find({},(err, allNews) => {
                if (err) throw err;
                res.render('home',{allNews});
            });
        })
    })
});

// Listen to port 7600
app.listen(port,(err)=>{
    if(err) throw err;
    console.log(`server is running on port ${port}`)
});
