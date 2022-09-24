require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
// const encrypt = require('mongoose-encryption');
// const md5 = require('md5');
const bcrypt = require('bcrypt');
const salRounds = 10;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
///mongoose
mongoose.connect("mongodb://127.0.0.1/userDB");

// const userSchema ={
//   email:String,
//   password:String
// };
const userSchema = new mongoose.Schema({
  email:String,
  password:String
});
//encryption

// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User",userSchema);

//TODO
app.get("/",(req,res)=>{
  res.render("home");
});
app.get("/login",(req,res)=>{
  res.render("login");
});
app.get("/register",(req,res)=>{
  res.render("register");
});

app.post("/register",(req,res)=>{

  bcrypt.hash(req.body.password, salRounds, (err,hash)=>{
    const newUser = new User({
      email:req.body.username,
      password:hash
    });
    newUser.save((err)=>{
      if (!err) {
        res.render("secrets");
      } else {
        console.log(err);
      }
    });
  });

});
app.post("/login",(req,res)=>{
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email:username},(err,foundUser)=>{
    if (err) {
      console.log(err);
    }else {
      if (foundUser) {
        bcrypt.compare(password,foundUser.password,function(err,result){
          if (result === true) {
            res.render("secrets");
          }
        });

      }
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
