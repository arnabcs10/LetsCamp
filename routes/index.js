const express = require('express'); //INCLUDING express
const router = express.Router();
const passport = require('passport');

const User = require('../models/user');

//ROOT ROUTE
router.get("/",function(req,res){
    res.render("landing");
  });
//============================

//AUTH ROUTES
//SHOW - register form
router.get("/register",(req,res)=>{
    res.render('register');
  });
  //HANDLING USER SIGNUP
  router.post("/register",(req,res)=>{
    let newUser = new User({username:req.body.username});
    User.register(newUser,req.body.password,(err,user)=>{
      if(err)
      {
        console.log(err);
        req.flash("error",err.message);//
        return res.redirect("/register");
      }
      passport.authenticate('local')(req,res,()=>{
        req.flash("success","Welcome to YelpCamp "+user.username);
        res.redirect("/campgrounds");
      });
    });
  });
  //LOGIN ROUTES
  //SHOW Login form
  router.get("/login",(req,res)=>{
    res.render("login");
  });
  //HANDLING LOGIN LOGIC
  router.post("/login",passport.authenticate('local',{
    successRedirect:"/campgrounds",//############
    failureRedirect:"/login"//############
  }),(req,res)=>{
    
  });
  //Logut Route
  router.get("/logout",(req,res)=>{
    req.logout();
    req.flash("success","Successfully Logged Out");
    res.redirect("/campgrounds");
  });
  //-------------------------------
  

  module.exports = router;