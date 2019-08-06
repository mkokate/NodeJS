const app = require('./app');
const express = require('express');
const session = require('express-session');
const port = process.env.port || 3200;

app.use(express.static(__dirname+'/public'));
app.set('views', './src/views');
app.set('view engine', 'ejs');
app.use(session({secret:'edurekaSecert'}));

let sess;
app.get('/login', (req,res) => {
    sess = req.session;
    res.render('login')
})

app.get('/register', (req,res) => {
    sess = req.session;
    res.render('register')
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})