const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');
const LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
const User = require('./User');
const bcrypt = require('bcryptjs');

app.use(express.static(__dirname+'/public'));
app.set('views', './src/views');
app.set('view engine', 'ejs');

router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

router.post('/addUser', (req,res) =>  {
    const hashedPasword = bcrypt.hashSync(req.body.password, 8);

    User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPasword,
        type: req.body.type?req.body.type:'Normal'
    }, (err, user) => {
        if(err) return res.status(500).send('Please try again!');
       res.send('SuccessFully Added!');
    })
});

module.exports = router;
