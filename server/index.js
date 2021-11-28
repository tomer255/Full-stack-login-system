const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv')

dotenv.config();

const Login = require("./routes/login");
const Register = require("./routes/register");
const AddNote = require("./routes/addNote");
const Search = require("./routes/search");
const RemoveNote = require("./routes/removeNote");



app.use(cors())

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());


db = mysql.createConnection({
    user:"root",
    host:"localhost",
    password:process.env.DB_PASSWORD,
    database: "security-project"
})

app.listen(3005, function() {
    console.log("Server is running on port 3005");
});

app.get("/", (req,res) => {
    res.send("Server is up and running");
});

app.get("/password_config",(req,res) => {
    res.send(require('./password_config'));
    console.log("test");
})

app.post("/login", Login);
app.post("/register", Register);
app.post("/addNote",AddNote);
app.post("/Search",Search);
app.post("/removeNote",RemoveNote)