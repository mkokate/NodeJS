const express = require('express');
const request = require('request');
const ejs = require('ejs');
const fetch = require("node-fetch");
const fileSystem = require('fs');

const port = process.env.port || 3000;
const app = express();


// *****************************************************************************************
// GET EMPLOYEE DETAILS
// *****************************************************************************************

function getEmployee(employeeId) {
    return new Promise(function(resolve, reject) {
        fileSystem.readFile('employees.json', 'utf-8', function(error, data){
            if (error) {
                reject(error);
            } else {
                var allEmployees = JSON.parse(data);
                var employee = allEmployees.filter(function(obj) {return obj.id == employeeId});
                resolve(employee);
            }
        }) 
    })
}

app.get('/employee', (req, res) => {
    res.status(200).send('success');
})

app.get('/employee/:id', function(request, response){
    // Get employee ID
    var employeeId = request.params.id;
    if (employeeId == undefined) {
        response.send('Employee ID is not valid');
        return;
    }

    var getEmployeePromise = getEmployee(employeeId);
    getEmployeePromise.then(function(employee){
        if (employee.length > 0) {
            response.status(200).send(employee[0]);
        }else{
            response.status(400).send('{\"error\" : \"No record found for provided employee Id\"}');
        }
    })
})


// *****************************************************************************************
// GET PROJECT DETAILS
// *****************************************************************************************

function getProject(projectId) {
    return new Promise(function(resolve, reject) {
        fileSystem.readFile('projects.json', 'utf-8', function(error, data){
            if (error) {
                reject(error);
            } else {
                var allProjects = JSON.parse(data);
                var project = allProjects.filter(function(obj) {return obj.id == projectId});
                resolve(project);
            }
        }) 
    })
}

app.get('/project/:id', function(request, response){
    // Get employee ID
    var projectId = request.params.id;
    if (projectId == undefined) {
        response.send('Project ID is not valid');
        return;
    }

    var getProjectPromise = getProject(projectId);
    getProjectPromise.then(function(project){
        if (project.length > 0) {
            response.send(project[0]);
        }else{
            response.send('{\"error\" : \"No record foundfor provided project Id\"}');
        }
    })
})


// *****************************************************************************************
// GET EMPLOYEE AND PROJECT DETAILS
// *****************************************************************************************

app.get('/getemployeedetails/:id', function(request, response){
    const employeeId = request.params.id;
    const getEmployeeUrl = 'http://localhost:3000/employee/'+employeeId;
    var employeeDetails;
    fetch(getEmployeeUrl).then(res => res.json()).then(employee => {
        employeeDetails = employee;
        if (employee.projectId == undefined){
            response.send('No record found for provided employee Id');
            return;
        }
        const getProjectUrl = 'http://localhost:3000/project/'+employee.projectId;
        return fetch(getProjectUrl).then(res => res.json());
    }).then(project => {
        employeeDetails.project = project;
        delete employeeDetails.projectId;
        response.send(employeeDetails);
    });
})

app.listen(port, function(error){
    if (error) throw error;
    console.log('Server is running on port '+port);
})