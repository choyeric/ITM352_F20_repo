var querystring = require('querystring');

var express = require('express'); // Express package
var app = express();
var myParser = require("body-parser"); // Parser package
var products = require('./products.json');
const { request } = require('http');


// Code from Lab13
app.all('*', function (request, response, next) {
   console.log(request.method + ' to path ' + request.path);
   next();
});

app.use(myParser.urlencoded({ extended: true }));

app.post("./invoice.html", function (request, response) {
      // check if quantity data is valid
      params = request.query;
      console.log(params);
      if (typeof params['purchase_submit'] != 'undefined') {
         has_errors = false; //Borrowed from example on Assignment1
         total_qty = 0;
         for (i = 0; i < products.length; i++) { // Checking each of the products in the array
            if (typeof params[`quantity${i}`] != 'undefined') {  // If not undefined then move on to the next if statement
               a_qty = params[`quantity${i}`];
               total_qty += a_qty;
               if (!isNonNegInt(a_qty)) {
                  has_errors = true; //oops, invalid quantity
               }
            }
         }
      }
   });

      // Used code from Lab13
      app.use(express.static('./public'));
      app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here

      // Function isNonNegInt taken from Lab13
      function isNonNegInt(stringToCheck, returnErrors = false) { // Checks whether the string is a valid integer
         errors = []; // assume no errors at first
         if (stringToCheck == "") stringToCheck = 0;
         if (Number(stringToCheck) != stringToCheck) errors.push('Not a number!'); // Check if string is a number value
         if (stringToCheck < 0) errors.push('Negative value!'); // Check if it is non-negative
         if (parseInt(stringToCheck) != stringToCheck) errors.push('Not an integer!'); // Check that it is an integer

         return returnErrors ? errors : (errors.length == 0);
      }