var express = require('express');
var fileSystem = require('fs');

var app = express();
var port = process.env.port || 3400;

app.get('/', function(request, response){
    response.send('Yes this is express!')
})

app.get('/movies', function(request, response){
    fileSystem.readFile('movies.json', function(error, data){
        if (error) throw error;
        response.send(JSON.parse(data))
    })
})

app.listen(port, function(error){
    if (error) throw error;
    console.log('Server is running!')
})