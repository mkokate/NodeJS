const express = require('express');
const request = require('request');
const ejs = require('ejs')

const port = process.env.port || 3000;
const app = express();

const apiUrl = 'http://5c055de56b84ee00137d25a0.mockapi.io/api/v1/employees';

app.use(express.static(__dirname+'/public'));
app.set('views', './src/views');
app.set('view engine', 'ejs');

function getEmployeeList(){
    var options = {
        url: apiUrl,
        headers: {
            'User-Agent': 'request'
        }
    };

    return new Promise(function(resolve, reject){
        request.get(options, function(error, response, body){
            if(error){
                reject(error);
            }else{
                resolve(body);
            }
        })
    })
}

app.get('/employees', function(req, res){
    var employeePromise = getEmployeeList();
    employeePromise.then(response => JSON.parse(response))
                   .then(function(result){
                       res.render('employeeView', {title: '*** Employee List ***', output: result});
                   })
})

app.listen(port, function(error){
    if(error) throw error;
    console.log('Server is runnning on port '+port);
})