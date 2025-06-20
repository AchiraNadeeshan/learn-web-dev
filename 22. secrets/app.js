//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
// const bcrypt = require("bcrypt");
// const saltRounds = 10;
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", async function (req, res) {
  res.render("home");
});

app.get("/login", async function (req, res) {
  res.render("login");
});

app.get("/register", async function (req, res) {
  res.render("register");
});

app.get("/secrets", async function (req, res) {
  if (req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});

app.get("/logout", async function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
});

app.post("/register", async function (req, res) {
  try {
    await User.register({ username: req.body.username }, req.body.password);
    passport.authenticate("local")(req, res, function () {
      res.redirect("/secrets");
    });
  } catch (err) {
    console.log(err);
    res.redirect("/register");
  }
});

app.post("/login", async function (req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, function (err) {
    if (err) {
      console.log(err);
      res.redirect("/login");
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/secrets");
      });
    }
  });
});

// app.post("/register", async function (req, res) {
//   try {
//     const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

//     const newUser = new User({
//       email: req.body.username,
//       password: hashedPassword, // Use bcrypt hash here
//     });

//     await newUser.save();
//     res.render("secrets");
//   } catch (err) {
//     console.log(err);
//     res.redirect("/register");
//   }
// });

// app.post("/login", async function (req, res) {
//   const username = req.body.username;
//   const password = req.body.password;

//   try {
//     const foundUser = await User.findOne({ email: username });

//     if (!foundUser) {
//       return res.send("No user found with that email.");
//     }

//     const match = await bcrypt.compare(password, foundUser.password);

//     if (match) {
//       console.log("Login successful");
//       res.render("secrets");
//     } else {
//       res.send("Incorrect password.");
//     }
//   } catch (err) {
//     console.log(err);
//     res.redirect("/login");
//   }
// });

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
