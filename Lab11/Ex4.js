var values = ["2", "-3", "asdf", "-3.14156", "5"];

function isNonNegInt(stringToCheck, returnErrors = false) { // Checks whether the string is a valid integer
    errors = [];
    // assume no errors at first
    if (Number(stringToCheck) != stringToCheck) errors.push('Not a number!');
    // Check if string is a number value
    if (stringToCheck < 0) errors.push('Negative value!');
    // Check if it is non-negative
    if (parseInt(stringToCheck) != stringToCheck) errors.push('Not an integer!');
    // Check that it is an integer

/*    if (returnErrors) {
        return errors;
    } else {
        return errors.length == 0;
    }
    */
   return returnErrors ? errors : (errors.length ==0);
}

/* for (i = 0; i < values.length; i++) {
    console.log("Value " + values[i] + " is " + isNonNegInt(values[i], true).join("||"));
}
*/

console.log("*********");

function callback(item, index) {
    errorsReturned = isNonNegInt(item, true).join("||");
    if (errorsReturned.length == 0) {
        console.log("String \ '" + item + "\' is valid");
    } else {
    console.log("String \'" + item + "\' is " + errorsReturned);
    }
}

values.forEach(callback);

values.forEach(function callback(item, index) {
        errorsReturned = isNonNegInt(item, true).join("||");
        if (errorsReturned.length == 0) {
            console.log("String \ '" + item + "\' is valid");
        } else {
        console.log("String \'" + item + "\' is " + errorsReturned);
        }
    }
);