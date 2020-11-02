var express = require('express');
var app = express();
var myParser = require("body-parser"); 
const { response } = require('express');

app.use(express.static('./public'));
app.use(myParser.urlencoded({ extnded: true}));

function isNonNegInt(stringToCheck, returnErrors = false) { // Checks whether the string is a valid integer
    errors = []; // assume no errors at first
    if (Number(stringToCheck) != stringToCheck) errors.push('Not a number!'); // Check if string is a number value
    if (stringToCheck < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(stringToCheck) != stringToCheck) errors.push('Not an integer!'); // Check that it is an integer

    return returnErrors ? errors : (errors.length == 0);

}

app.all('*', function (request, response, next) {
    response.send(request.method + ' to path ' + request.path);
    next();
});

app.post("/process_form", function (request, response) {
    console.log("Got POST");
    let POST = request.body;
    //reponse.send(POST);
    if (typeof POST['quantity_textbox'] != 'undefined') {
        qty = POST["quantity_textbox"];
        console.log(qty);
        if (isNonNegInt (qty, false)) {
            response.send(`Thank you for purchasing ${qty} things!`); 
            //window.stop();
        } else {
            response.send(`${qty} is not a quantity! Press the back button and try again.`); 
        }
    }
});

app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here

