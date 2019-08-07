import express from 'express';
import redis from 'redis';
import axios from 'axios';
const client = redis.createClient();
const app = express();
const port = 7600;

app.use(express.static(__dirname + '/public'));
app.set('views', './src/views');
app.set('view engine', 'ejs');

client.on('error', (error) => {
    console.log(error);
})

app.get('/redisDemo', (req, res) => {
    const countryName = (req.query.country).trim();
    const apiUrl = `https://en.m.wikipedia.org/w/api.php?action=parse&format=json&section=0&page=${countryName}`;
    return client.get(`redisDemo:${countryName}`, (error, result) => {
        if (result) {
            const output = JSON.parse(result);
            return res.status(200).json(output)
        } else {
            return axios.get(apiUrl)
            .then(response => {
                const output = response.data;
                client.setex(`redisDemo:${countryName}`, 2400, JSON.stringify({ source: 'Redis Demo Cache', ...output }));
                return res.status(200).json({ source: 'Live API', ...output })
            })
            .catch(error => {
                return res.send(error);
            })
        }
    })
});

app.listen(port, (err) => {
    console.log(`server is running on port ${port}`)
});
