var querystring = require('querystring');
var express = require('express'); // Express package
var app = express();
var myParser = require("body-parser"); // Parser package
var products = require('./products.json');
const { request } = require('http');
var fs = require('fs');
var qs = require('querystring');
const { response, query } = require('express');

var input_quantities = []; // For users that inputted quantities for products


// Code from Lab13
app.all('*', function (request, response, next) {
   console.log(request.method + ' to path ' + request.path);
   next();
});

app.use(myParser.urlencoded({ extended: true }));

app.get("/process_page", function (request, response) {
   input_quantities = request.query // for User data
   // check if quantity data is valid
   params = request.query;
   console.log(params);
   if (typeof params['purchase_submit'] != 'undefined') {
      has_errors = false; // Borrowed from example on Assignment1
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
      console.log(has_errors, total_qty);
      qstr = querystring.stringify(request.query);
      if (has_errors || total_qty == 0) {
         // If quantity is not valid, send them back to the store
         qstr = querystring.stringify(request.query);
         response.redirect("store.html?" + qstr);
         // If quantity is valid, send an invoice/login page
      } else {
         response.redirect("login.html?" + qstr);
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

// Borrowed from Lab14
var filename = "user_data.json";

if (fs.existsSync(filename)) {
   data = fs.readFileSync(filename, 'utf-8');

   user_data = JSON.parse(data);
   console.log("User_data =", user_data);
} else {
   console.log("Sorry can't read file " + filename);
   exit();
}

// Used base from Lab14
app.post("/login.html", function (request, response) {
   console.log(input_quantities); // Reports the user input in console
   var id_username = request.body.username;
   id_username = request.body.username.toLowerCase(); // Makes username case insensitive
   console.log("username = " + id_username) // Tells us what the username tbey inputted is
   if (typeof user_data[id_username] != 'undefined') {
      if (user_data[id_username].password == request.body.password) {
         quantityQstring = qs.stringify(input_quantities); // If the info is correct, make inputs a string
         response.redirect('/invoice.html?' + quantityQstring + `&username=${id_username}`)
      } else {
         error = "Invalid password";
      }
   } else {
      error = "Invalid username";
   }
   request.query.LoginError = error;   // In case of info errors, make the username sticky
   request.query.StickyLoginUser = id_username;
   qstring = querystring.stringify(request.query);
   response.redirect('/login.html?error=' + error);
});

app.post("/registration.html", function (request, response) {
   // Username variables
   var username = request.body.username;
   username = request.body.username.toLowerCase();
   
   // Password variables
   var fPass = request.body.password;
   var cPass = request.body.repeat_password;
   errors = {};

   if (typeof user_data[username] != 'undefined') {
      errors.username_error = "Username already in use. Please create new username." // This checks for used usernames
   }
   if ((/[a-z0-9]+/).test(request.body.username) == false) { // Trying from the reg expression w3 schools stuff
      errors.username_error = "Numbers and Letters only";
   }
   if (username.length < 4 && username.length > 10) {
      errors.username_error = "Username must be between 4 to 10 characters long. Please enter new username.";
   }

   fullname = request.body.fullname;
   if (fullname.length > 30) {
      errors.fullname_error = "Full name max 30 characters. Please shorten.";
   }
   if ((/[a-zA-Z]+[ ]+[a-zA-Z]+/).test(request.body.fullname) == false) { // Another attempt from the reg expression stuff
      errors.fullname_error = "Only use letters and add one space between first & last name";
   }

   password = request.body.password; // Password checks
   if (password.length < 6) {
      errors.password_error = "Password must be at least 6 characters long. Please enter new password.";
   }
   if (fPass != cPass) {
      errors.password_error = "Passwords do not match.";
   }

   email = request.body.email; // Email checks
   if ((/[a-z0-9._]+@[a-z0-9]+\.[a-z]+/).test(request.body.email) == false) { // Round 3 of reg expression checks
      errors.email_error = "Please enter a proper email";
   }

   if ((Object.keys(errors).length == 0) & (fPass == cPass)) {
      user_data[username] = {};
      user_data[username].username = request.body.username
      user_data[username].password = request.body.password;
      user_data[username].email = request.body.email;
      user_data[username].fullname = request.body.fullname;

      fs.writeFileSync(filename, JSON.stringify(user_data)); //saves/writes registaration data into the user_data json file
      quantityQstring = qs.stringify(input_quantities); //turns quantity object into a string
      response.redirect("/invoice.html?" + quantityQstring + `&username=${username}`); //if all good, send to invoice
   } else {
      qstring = qs.stringify(request.body) + "&" + qs.stringify(errors); //puts errors into a query string
      response.redirect('/registration.html?' + qstring); //if there are errors, send back to registration page to retype
   }
});