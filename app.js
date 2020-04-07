//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));


//Create Mongo connection, schema and model:
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true  });

  //set up new userdb: continue with schema and model: (with encrypt module):
const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

//secret string encrypt method (this has options that only encrypt certain fields):
//This is where encryption key was, cut and pasted to .env, and we replaced with below line:
//const secret = process.env.SECRET; or incorporate into line below:
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

//users model:
const User = new mongoose.model("User", userSchema);

//build out server:

app.get("/", function(req, res){
  res.render("home");
});
app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

//Create the register POST route:
app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

newUser.save(function(err){
  if (err) {
    console.log(err);
  } else {
    res.render("secrets");
  }
});
});

//Create the login POST route:
app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        }
      }
    }
  });
});





app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
