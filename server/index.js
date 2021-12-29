const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const dotenv = require('dotenv')
const verifyToken = require("./auth");
const https = require('https');
const fs = require('fs');
dotenv.config();
const config = process.env;

const Port = config.PORT

const Login = require("./routes/login");
const Register = require("./routes/register");
const AddNote = require("./routes/addNote");
const Search = require("./routes/search");
const RemoveNote = require("./routes/removeNote");
const Changepass = require("./routes/changepass");
const Forgotpass = require("./routes/forgotpass");
const Resetpass = require("./routes/resetpass");

app.use(cors())

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());


db = mysql.createConnection({
    user: config.DB_USER,
    host: config.DB_HOST,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
})

const TLSoptions = {
    key: fs.readFileSync('./cert/key.pem'),
    cert: fs.readFileSync('./cert/cert.pem')
};

TLSserver = https.createServer(TLSoptions, app)

TLSserver.listen(Port, function () {
    console.log(`TLS Server is running on port ${Port}`);
});

// app.listen(Port, function () {
//     console.log(`Server is running on port ${Port}`);
// });

app.get("/", (req, res) => {
    res.send("Server is up and running");
});

app.get("/passwordRequirements", (req, res) => {
    res.send(require('./config')["password requirements"]);
})

app.get("/authentication_status", verifyToken, (req, res) => {
    res.status(200).send();
})


app.post("/login", Login);
app.post("/register", Register);
app.post("/addNote", AddNote);
app.post("/search", Search);
app.post("/removeNote", RemoveNote);
app.post("/changePassword", Changepass);
app.post("/forgotpass", Forgotpass);
app.post("/resetpass", Resetpass);