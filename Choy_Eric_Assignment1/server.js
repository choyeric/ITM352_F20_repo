var express = require('express');
var app = express();
var myParser = require("body-parser");
var data = require('./products.json');
var products = data.projects;


// Code from Lab13
app.all('*', function (request, response, next) {
    console.log(request.method + ' to path ' + request.path);
    next();
});

app.use(myParser.urlencoded({ extended: true }));
app.post("/invoice.html", function (request, response) {
    process_quantity_form(request.body, response);
});

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here

// Function isNonNegInt taken from lab13
function isNonNegInt(stringToCheck, returnErrors = false) { // Checks whether the string is a valid integer
    errors = []; // assume no errors at first
    if (Number(stringToCheck) != stringToCheck) errors.push('Not a number!'); // Check if string is a number value
    if (stringToCheck < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(stringToCheck) != stringToCheck) errors.push('Not an integer!'); // Check that it is an integer

    return returnErrors ? errors : (errors.length == 0);
}