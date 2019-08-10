import express from 'express';
import dateFormatter from 'dateformat';
import News from './News';
const newsRouter = express.Router();
const bodyParser = require('body-parser');

newsRouter.use(bodyParser.urlencoded({extended:true}));
newsRouter.use(bodyParser.json());

function router(menu){
    newsRouter.get('/details/:source/:id', (req,res) => {
        var source = req.params.source;
        var id = req.params.id;
        News.findOne({_id: id},(err, news) => {
            if (err) throw err;
            res.render('newsDetails',{menu, source, news});
        });
    });

    return newsRouter;
}

module.exports = router;