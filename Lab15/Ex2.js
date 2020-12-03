/*
Name: Eric Choy
Purpose: Lab15 assignment for class
*/

var express = require('express');
var app = express();
var myParser = require("body-parser");
var fs = require('fs');
const { exit } = require('process');
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(cookieParser());
app.use(session({ secret: "ITM352 rocks!", saveUninitialized: false, resave: false }));


app.use(myParser.urlencoded({ extended: true }));

var filename = "user_data.json";

if (fs.existsSync(filename)) {
    data = fs.readFileSync(filename, 'utf-8');

    user_data = JSON.parse(data);
} else {
    console.log("Sorry can't read file " + filename);
    exit();
}

app.get("/set_cookie", function (request, response) {
    // Set a cookie called myname to be my name
    response.cookie('myname', 'Eric Choy', { maxAge: 10000 }).send('cookie set');
});

app.get("/use_cookie", function (request, response) {
    // Use the cookie, if it has been set
    output = "No myname cookie found";
    if (typeof request.cookies.myname != 'undefined') {
        output = `Welcome to the Use Cookie Page ${request.cookies.myname}`;
    }
    response.send(output);
});

app.get("/use_session", function (request, response) {
    // Print the value of the session ID
    response.send(`Welcome. Your session ID is: ${request.session.id}`);
});

app.get("/login", function (request, response) {
    // Give a simple login form
    str = `
<body>
<form action="" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
});

app.post("/login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log("Got a POST login request");
    POST = request.body;
    user_name_from_form = POST['username'];
    password_from_form = POST['password'];

    // Checks for successful login with matching passwords, if so then prints welcome message
    if (user_data[user_name_from_form] != undefined) {
        password_on_file = user_data[user_name_from_form].password;
        if (password_from_form == password_on_file) {
            if (typeof request.session.last_login != 'undefined') {
                var msg = `You last logged in at ${request.session.last_login}`;
                var now = new Date();
            } else {
                var msg = '';
                var now = 'first visit';
            }
            request.session.last_login = now
            response.cookie('username', user_name_from_form).send(`${msg}<BR>${user_name_from_form} logged in at ${now}`);
        } else {
            response.send(`Sorry!`);
        }
    }
});

app.get("/register", function (request, response) {
    // Give a simple register form
    str = `
<body>
<form action="/register" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="password" name="repeat_password" size="40" placeholder="enter password again"><br />
<input type="email" name="email" size="40" placeholder="enter email"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
});

app.post("/register", function (request, response) {
    // process a simple register form
    POST = request.body;
    console.log("Got register POST");
    if (POST["username"] != undefined && POST['password'] != undefined) {     // Validate user input
        username = POST["username"];
        user_data[username] = {};
        user_data[username].name = username;
        user_data[username].password = POST["password"];
        user_data[username].email = POST["email"];

        data = JSON.stringify(user_data);
        fs.writeFileSync(filename, data, "utf-8");
    }
});

// Invoice if user is logged in, if not deny access; borrowed from Prof Kazman's code
app.get("/invoice", function (request, response) {
    if (typeof request.session.username != 'undefined') {
        response.send(`${request.session.username}'s Invoice`);
    } else {
        response.send("Please login first.");
    }
});

// Simple example of destroying a session, borrowed from Prof Kazman's code
app.get("/destroy_session", function (request, response) {
    // Print the value of the session ID
    request.session.destroy();
    response.send("Session nuked!");
});

app.listen(8080, () => console.log(`listening on port 8080`));