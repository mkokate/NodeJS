import express from 'express';
import News from './news/News';
import iplocate from 'node-iplocate';
import publicIp from 'public-ip';
import db from './db';
import axios from 'axios';
import redis from 'redis';
const client = redis.createClient();
const app = express();
const port = 7200;

// Static file paths
app.use(express.static(__dirname + '/public'));
app.set('views', './src/views');
app.set('view engine', 'ejs');

// Common Menu
var menu = [
    { name: 'Home', link: '/' },
    { name: 'Sports', link: '/sports' },
    { name: 'Contact us', link: '/contactus' },
    { name: 'About us', link: '/aboutus' }
]

// Register routers
const contactManager = require('./ContactManager');
app.use('/contact', contactManager);
const newsManager = require('./news/NewsManager')(menu);
app.use('/news', newsManager);

// Redis
client.on('error', (err) => {
    console.log(err)
})

// Home Page
app.get('/', (req, res) => {
    News.find({}).sort({ 'date': -1 }).limit(3)
        .exec((err, allNews) => {
            if (err) throw err;
            res.render('home', { title: 'Home', menu, allNews })
        });
});

// Sports API
app.get('/sports', (req, res) => {
    // Fetch only sports news from database
    News.find({}, (err, allNews) => {
        if (err) throw err;
        var rows = allNews.length / 3;
        rows = rows > 0 ? rows : 1;
        res.render('sports', { title: 'Sports news', menu, allNews, rows })
    });
});

// Contact us API
app.get('/contactus', (req, res) => {
    res.render('contact', { title: 'Contact us', menu })
});

// About us API
app.get('/aboutus', (req, res) => {
    res.render('about', { title: 'About us', menu })
});

// API to get weather information
app.get('/home/weather', (req, res) => {
    publicIp.v4().then(ip => {
        iplocate(ip).then((results) => {
            let zip = JSON.stringify(results.zip, null, 2);
            const url = `https://samples.openweathermap.org/data/2.5/weather?zip=${zip},us&appid=b6907d289e10d714a6e88b30761fae22`
            return client.get(`news:${zip}`, (err, result) => {
                if (result) {
                    const output = JSON.parse(result);
                    // Pass this information in ejs template
                    return res.status(200).json(output)
                } else {
                    return axios.get(url)
                        .then(response => {
                            const output = response.data;
                            // Pass this information in ejs template
                            client.setex(`news:${zip}`, 3600, JSON.stringify({ source: 'Redis', ...output }));
                            return res.status(200).json({ source: 'API', ...output })
                        })
                        .catch(err => {
                            return res.send(err)
                        })
                }
            })
        });
    });
});

app.listen(port, (err) => {
    console.log(`server is running on port ${port}`)
});
