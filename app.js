//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const ejs = require('ejs');
const mongoose = require('mongoose');
const md5 = require('md5');

const app = express();


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/User', { useNewUrlParser: true, useUnifiedTopology: true })

const userShema = new mongoose.Schema({
    email: String,
    password: String
});



const User = new mongoose.model("User", userShema);

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });

    newUser.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});

app.post("/login", function(req, res) {
    const userName = req.body.username;
    const passWord = req.body.password;

    User.findOne({ email: userName }, function(err, founduser) {
        if (err) {
            console.log(err);
        } else {
            if (founduser.password === passWord) {
                res.render("secrets");
            }
        }
    });
});


app.listen(3000, function() {
    console.log("server started on port 3000.");
});