import express from 'express';
import dateFormatter from 'dateformat';
import News from './News';
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

router.get('/', (req,res) => {
    res.render('addNews');
})

// Add new news API
router.post('/addNews', (req,res) =>  {
    News.create({
        heading: req.body.heading,
        details: req.body.details,
        date: dateFormatter(new Date(), "dd-mm-yyyy")
    }, (err, news) => {
        if(err) return res.status(500).send('Please try again!');
        res.redirect('/news');
    })
});


// Delete news API
router.get('/deleteNews/:id', (req,res) => {
    let newsId = req.params.id;
    News.deleteOne({_id: newsId}, (err) => {
        if(err) return res.status(500).send('Error on the server!');
        res.redirect('/home');
    })
});

module.exports = router;