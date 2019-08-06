const express = require('express');
const router = express.Router();
const app = express();
const LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');
const User = require('../user/User');
const session = require('express-session');

router.use(session({secret:'authenticationSecret', resave:false, saveUninitialized:true}));

router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

router.post('/register', (req,res) =>  {
    const hashedPasword = bcrypt.hashSync(req.body.password, 8);

    User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPasword,
        type: req.body.type?req.body.type:'Normal'
    }, (err, user) => {
        if(err) return res.status(500).send('Please try again!');
       res.redirect('/login')
    })
});

router.post('/login', (req,res) => {
    User.findOne({email: req.body.email}, (err,user) => {
        if(err) return res.status(500).send('Error on the server');
        if(!user) { res.send('Did not find user with provided details')}
        else{
            const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if(!passwordIsValid) return res.status(401).send({auth: false, token:null});
            var token = jwt.sign({id: user._id}, config.secert,{
                expiresIn:86400
            });
            localStorage.setItem('authtoken',token);
            if (user.type == 'Admin') {
                res.render('newUser');
            }else{
                res.render('products');
            }
        }
    })
});

router.get('/logout', (req,res) => {
    localStorage.removeItem('authtoken');
    res.redirect('/login')
})

module.exports = router;