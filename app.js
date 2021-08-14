//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;
//const encrypt = require("mongoose-encryption");
const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userdb", {
  useNewUrlParser: true
});
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

//userSchema.plugin(encrypt, {secret :process.env.SECRET , encryptedFields: ["password"]});
const User = new mongoose.model("user", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});
app.get("/register", function(req, res) {
  res.render("register");
});
app.get("/login", function(req, res) {
  res.render("login");
});

app.post("/register", function(req, res) {
  bcrypt.hash(req.body.password, saltRounds, function(err, hash){
  const newuser = new User({
      email: req.body.username,
    //  email: md5(req.body.username)
      password: hash
    });
    newuser.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });

  });

});

app.post("/login", function(req, res) {
  const username = req.body.username;
  //const password = md5(req.body.password);
    const password = req.body.password;
  User.findOne({
      email: username
    }, function(err, foundone) {
      if (err) {
        console.log(err);
      } else {
        if (foundone) {
          bcrypt.compare(req.body.password, foundone.password, function(err, result) {
            if (result === true) {

              res.render("secrets");
            }
          });

        }
      }

  });
});




app.listen(3000, function() {
  console.log("server is started om 3000 port");
});
