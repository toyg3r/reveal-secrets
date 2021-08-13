//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userdb", {
  useNewUrlParser: true
});
const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

userSchema.plugin(encrypt, {secret :process.env.SECRET , encryptedFields: ["password"]});
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
  const newuser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newuser.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets")
    }
  });
  });

  app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({
      email: username
    }, function(err, foundone) {
      if (err) {
        console.log(err);
      } else {
        if (foundone) {
          if (password === foundone.password) {
            res.render("secrets");
          }
        }
      }
    });
  });




app.listen(3000, function() {
  console.log("server is started om 3000 port");
});
