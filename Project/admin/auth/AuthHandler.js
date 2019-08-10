import express from 'express';
import config from '../config';
import jwt from 'jsonwebtoken';
import User from '../user/User';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import session from 'express-session';

const router = express.Router();
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch')

router.use(session({secret:'authenticationSecret', resave:false, saveUninitialized:true}));
router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

let sess;
router.get('/signin', (req,res) => {
    sess= req.session;
    res.render('login',{msg: req.query.msg?req.query.msg:'', errMsg: req.query.errMsg?req.query.errMsg:'',});
})

router.get('/signup', (req,res) => {
    res.render('register');
})

// Register API
router.post('/register', (req,res) =>  {
    const hashedPasword = bcrypt.hashSync(req.body.password, 8);
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPasword
    }, (err, user) => {
        if(err) return res.status(500).send('Please try again!');

       const string = encodeURIComponent('Successfully registered please login now');
       res.redirect('/api/auth/signin?msg=' + string)
    })
});


// Login API
router.post('/login', (req,res) => {
    User.findOne({email: req.body.email}, (err,user) => {
        if(err) return res.status(500).send('Error on the server!');
        if(!user){ 
            const string = encodeURIComponent('Did not find account with these details');
            res.redirect('/api/auth/signin?errMsg=' + string)
        }
        else{
            const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if(!passwordIsValid) {
                const string = encodeURIComponent('Did not find account with these details');
                res.redirect('/api/auth/signin?errMsg=' + string)
            }else{
                var token = jwt.sign({id: user._id}, config.secert,{
                    expiresIn:86400
                });
                localStorage.setItem('authtoken',token);
                res.redirect('/home');
            }   
        }
    })
});


// Logout API
router.get('/logout', (req,res) => {
    localStorage.removeItem('authtoken');
    res.redirect('/api/auth/signin')
})

module.exports = router;