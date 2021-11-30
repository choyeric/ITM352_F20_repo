var querystring = require('querystring');

var express = require('express'); // Express package
var app = express();
var myParser = require("body-parser"); // Parser package
const { request } = require('http');

app.post("/cust_info.html", function (request, response) {
    POST = request.body;
    response.redirect('./info_success.html')
 });

 app.use(express.static('./public'));
 app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here