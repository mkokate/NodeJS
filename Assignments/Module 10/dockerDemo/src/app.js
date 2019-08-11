import express from 'express';
import axios from 'axios';
const app = express();
const port = 7600;

app.use(express.static(__dirname + '/public'));
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    const apiUrl = 'https://restcountries.eu/rest/v2/all';
    axios.get(apiUrl)
        .then(response => {
            const output = response.data;
            return res.status(200).json({ output })
        })
        .catch(error => {
            return res.send(error);
        })
});

app.listen(port, (err) => {
    console.log(`server is running on port ${port}`)
});
