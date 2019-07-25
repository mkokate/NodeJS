var fileSystem = require('fs');
var util = require('util');
var userInput = process.stdin;
userInput.setEncoding('utf-8');
var fileNamesArray = new Array();
const textFile = 'fileNames.txt';

// Take file name from user
console.log("Please enter file name:");

userInput.on('data', function(data){
    var fileName = data;
    if (!fileName.trim()) {
        // File name is empty or whitespace
        console.log('Please enter valid file name');
        return;
    }

    // Create a file if file name already does exist
    createFileIfNotExist(fileName)
})

// Function to check if file name already exists
function createFileIfNotExist(fileName) {
    if(fileSystem.existsSync(textFile)){
        fileSystem.readFile(textFile, 'utf-8', function(error, data){
            if (error) throw error;
            fileNamesArray = JSON.parse(data)
            if (fileNamesArray.indexOf(fileName) > -1){
                console.log('Provided file name already exist. Please provide a different name.')
            }else{
                createNewFile(fileName)
            }
        })
    }else{
        createNewFile(fileName)
    }
}

// Function to create a new file
function createNewFile(fileName) {
    fileSystem.writeFile(fileName, 'You are awesome', function(error){
        if (error) throw error;
        // Save file name
        fileNamesArray.push(fileName);
        fileSystem.writeFile(textFile, JSON.stringify(fileNamesArray), function(error){
            if (error) throw error;
        })
        console.log('New file with name: %s created!', fileName);
    })
}