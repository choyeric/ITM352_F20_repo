myAge = 20;
myName = "Jackie";
attributes = myName + ";" + myAge + ";" + (myAge + 0.5) + ";" + (0.5 - myAge);
pieces = attributes.split(';');

function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if (Number(q) != q) errors.push('not a number'); // Check if string is a number value
    if (q < 0) errors.push('a negative value'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('not an integer'); // Check that it is an integer

    return returnErrors ? errors : (errors.length == 0) //returns an array of all the errors
}

function checkNum(item, index) {
    returnErrors = isNonNegInt(item, true).join(" and ");
    if (returnErrors.length == 0) {
        console.log("\ '" + item + "\' is valid");
    } else {
    console.log("\'" + item + "\' is " + returnErrors + ".");
    }
}

function checkIt(item, index) {
    console.log(`part ${index} is ${(isNonNegInt(item)?'a':'not a')} quantity`);
}

pieces.forEach(checkIt);

pieces.forEach((item,index) => {console.log(`part ${index} is ${(isNonNegInt(item)?'a':'not a')} quantity`);} ) 