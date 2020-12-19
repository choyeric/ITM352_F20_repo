/* 
Name: Eric Choy
Purpose: Hosting a server for assignment 3
Code credit: A lot of code is used from Professor Port's A3 example. Some restructured to match my files and overall format of website.
*/

var querystring = require('querystring');
var express = require('express'); // Express package
var app = express();
var myParser = require("body-parser"); // Parser package
var products_data = require('./products.json');
const { request } = require('http');
var fs = require('fs');
var qs = require('querystring');
var session = require('express-session');
const { response, query } = require('express');

var input_quantities = []; // For users that inputted quantities for products

app.use(myParser.urlencoded({ extended: true }));
app.use(session({ secret: "ITM352 rocks!" }));

// Code from Prof Port's Assignment 3 example. This is used to make the cart stored in the session
app.all('*', function (request, response, next) {
   if (typeof request.session.cart == 'undefined') { request.session.cart = {}; }
   console.log(request.session.cart);
   console.log(request.method + ' to path ' + request.path);
   next();
});

app.get("/get_products_data", function (request, response) {
   response.json(products_data);
});

// This should send all the information of what the user is sending to their cart to the server to save. Borrowed from Prof Port's Assignment 3 example
app.get("/add_to_cart", function (request, response) {
   // Get the product name from the key, store quantities, then paste them all into the cart to show user what they have added
   var products_key = request.query['products_key'];
   var quantities = request.query['quantities'].map(Number);
   request.session.cart[products_key] = quantities;
   response.redirect('./cart.html');
});

app.get("/get_cart", function (request, response) {
   response.json(request.session.cart);
});

// This removes the item from the cart that the user does not want anymore by setting the quantity to 0
app.get("/remove_item", function (request, response) {
   var products_key = request.query['products_key'];
   var ordered_item = request.query['ordered'].map(Number);
   request.session.cart[products_key] = ordered_item;
   response.redirect('./cart.html');
});

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
var user_data = "";

if (fs.existsSync(filename)) {
   data = fs.readFileSync(filename, 'utf-8');

   user_data = JSON.parse(data);
   console.log("User_data =", user_data);
} else {
   console.log("Sorry can't read file " + filename);
   exit();
}

// Used base from Lab14. Logs user and displays their name along with generating a cookie based on their username for security
app.post("/login.html", function (request, response) {
   var id_username = request.body.username;
   id_username = request.body.username.toLowerCase(); // Makes username case insensitive
   console.log("username = " + id_username) // Tells us what the username they inputted is
   if (typeof user_data[id_username] != 'undefined') {
      if (user_data[id_username].password == request.body.password) {
         response.cookie('loggeduser', `${id_username}`, { maxAge: 300 * 1000 }); // Sets the name as a cookie for the store to read; courtesy of Prof. Port workshop
         response.redirect('/store.html?' + `&username=${id_username}`);
      } else {
         error = "Invalid password";
      }
   } else {
      error = "Invalid username";
   }
   response.redirect('/login.html?error=' + error);
});

// Logout button should "logout" the user and destroy the cookie
// Also destroys the session so all shopping info is deleted once logout happens.
app.get("/logout", function (request, response) {
   response.clearCookie('loggeduser').send(`Successfully logged out! <a href='./store.html'>Return to store.</a>`);
   request.session.destroy();
});

// Trying to send email from invoice code
const nodemailer = require("nodemailer");

// Borrowed the "checkout" code from Prof. Port's example and modified to use as a button from the invoice page
app.get("/email", function (request, response) {

   var user_email = user_data[session.username];
   // Create a string to print out the email lines
   var invoice_str = `Thank you for ordering from us!`
   // create reusable transporter object using the default SMTP transport

   var transporter = nodemailer.createTransport({
      host: "mail.hawaii.edu",
      port: 25,
      secure: false, // use TLS
      tls: {
         // do not fail on invalid certs
         rejectUnauthorized: false
      }
   });

   // Use cookie to draw info from the array
   var mailOptions = {
      from: 'eric@zennoods.com',
      to: user_email,
      subject: 'Your Invoice',
      html: invoice_str
   };

   transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
         invoice_str += '<br>We are sorry, your email failed to send.';
      } else {
         invoice_str += `<br>Your invoice was sent to ${user_email}`;
      }
      invoice_str += `<br><a href='./logout'>Logout and return to store</a>`
      response.send(invoice_str);
   });

});

app.post("/registration.html", function (request, response) {

   // Make case insensitive
   username = request.body.username.toLowerCase();
   email = request.body.email.toLowerCase();

   // Variables for error messages
   var reg_errors = [];
   var name_errors = [];
   var user_errors = [];
   var pass_errors = [];
   var email_errors = [];

   // Full name error checks
   if (request.body.fullname > 30) { // Check to see if name is too long
      reg_errors.push("Name is too long. Please shorten below 30 characters.");
      name_errors.push("Name is too long. Please shorten below 30 characters.");
   }
   if ((/[a-zA-Z]+[ ]+[a-zA-Z]+/).test(request.body.fullname) == false) { // Another attempt from the reg expression stuff
      reg_errors.push("Only use letters and add one space between first & last name.");
      name_errors.push("Only use letters and add one space between first & last name.");
   }

   // Username error checks
   if (typeof user_data[username] != 'undefined') {
      reg_errors.push("Username already in use.");
      user_errors.push("Username already in use.");
   }
   if (username.length < 4) {
      reg_errors.push("Usernames must be at least 4 characters long.");
      user_errors.push("Usernames must be at least 4 characters long.");
   }
   if (username.length > 10) {
      reg_errors.push("Usernames can only have up to 10 characters.");
      user_errors.push("Usernames can only have up to 10 characters.");
   }
   if ((/^[0-9a-zA-Z]+$/).test(username) == false) {
      reg_errors.push("Usernames may only have letters or numbers.");
      user_errors.push("Usernames may only have letters or numbers.");
   }

   // Password error checks
   var fPass = request.body.password;
   var cPass = request.body.repeat_password;

   if (request.body.password.length < 6) {
      reg_errors.push("Password must be at least 6 characters long.");
      pass_errors.push("Password must be at least 6 characters long.");
   }
   if (request.body.password != request.body.repeat_password) {
      reg_errors.push("Passwords do not match.");
      pass_errors.push("Passwords do not match.");
   }

   // Email error checks
   if (/^[a-zA-Z0-9._]+@[a-zA-Z.]+\.[a-zA-Z]{2,3}$/.test(email) == false) { // Looked online for help on this
      reg_errors.push("Email format is invalid.");
      email_errors.push("Email format is invalid.");
   }

   // Help from Lab14 code; puts in data if there are no errors
   if (reg_errors.length == 0) {
      POST = request.body;
      username = POST["username"];
      user_data[username] = {};
      user_data[username].fullname = POST["fullname"];
      user_data[username].password = POST["password"];
      user_data[username].email = POST["email"];

      fs.writeFileSync(filename, JSON.stringify(user_data)); //saves/writes registaration data into the user_data json file
      response.cookie('loggeduser', `${username}`, { maxAge: 300 * 1000 }); // Sets the name as a cookie for the store to read; courtesy of Prof. Port workshop
      response.redirect('/store.html?' + `&username=${username}`)
   }

   if (reg_errors.length != 0) {
      request.query.fullname = request.body.fullname;
      request.query.username = request.body.username;
      request.query.password = request.body.password;
      request.query.repeat_password = request.body.repeat_password;
      request.query.email = request.body.email;
      response.redirect('./registration.html');
   }
});


// Used code from Lab13
app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here