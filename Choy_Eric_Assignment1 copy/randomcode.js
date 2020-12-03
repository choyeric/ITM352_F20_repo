// Stuff from Assignment 2

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