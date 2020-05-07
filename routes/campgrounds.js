const express = require('express'); //INCLUDING express
const router = express.Router();   //SETTING UP THE express router

const Campground = require('../models/campgrounds');
const Comment = require('../models/comment');

const middleware = require('../middleware'); //no need to add index.js as it will be automatically included,
                                             // becoz it is named as index 
//CAMPGROUNDS
  //INDEX -Displays the list of all campgrounds
  router.get("/",function(req,res){
   
    //console.log(req.user);- shows logged in user info
    
    Campground.find({},(error,allCampgrounds)=>{
      if(error)
      {
        console.log(error);
        res.send("OOPS! SOMETHING WENT WRONG");
      }
      else
      {
        res.render("campgrounds/index",{campgrounds:allCampgrounds});
      }
    })
    //res.render("campgrounds",{campgrounds:campgrounds});
  });
  //CREATE - Add/create new campground to db
  router.post("/",middleware.isLoggedIn,function(req,res){
    //get data from form and add to DB
    //redirect to the campgronds
    //console.log(req.body);
  
     let name=req.body.name;
     let image=req.body.image;
     let description=req.body.description;
     let author ={
       id: req.user._id,
       username: req.user.username
     };
     let newCampground={name:name,image:image,description:description,author:author} ;
     Campground.create(newCampground,(error)=>{
       if(error)
        console.log(error);
        else{
          console.log("NEW CAMPGROUND ADDED");

        }
        
     });
     
     
     res.redirect("/campgrounds");
  });
  //NEW - Displays a form to add a new campground
  router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new.ejs");
  });
  //SHOW - shows more info about one campground
  router.get("/:id",(req,res)=>{
    
    let campId = req.params.id;  //.find also works, returns an array
    Campground.findById({"_id":campId}).populate('comments').exec((error,camp)=>{  //.populate fills comments array with actual data
      if(error){
        console.log(error);
        res.send("OOPS! SOMETHING WENT WRONG");
      }
      else
      {
       // console.log(camp);
        res.render("campgrounds/show",{camp:camp});
      }
    });
    
  });

//EDIT 
router.get("/:id/edit",middleware.checkCampgroundOwnership,(req,res)=>{
  Campground.findById(req.params.id,(err,foundCampground)=>{
    if(err){
      req.flash("error","Something went wrong");
      console.log(err);
      res.redirect("back");
    }
    res.render("campgrounds/edit",{camp:foundCampground});       
  });   
});
//Update
router.put("/:id",middleware.checkCampgroundOwnership,(req,res)=>{
  
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,(err,foundCampground)=>{
      if(err)
      {
        req.flash("error","Something went wrong");
        console.log(err);
        res.redirect("/campgrounds");
      }
      else
      {    req.flash("success","Successfully updated");
           res.redirect("/campgrounds/"+req.params.id); 
      } 
    });
});
//DELETE Route
router.delete("/:id",middleware.checkCampgroundOwnership,(req,res)=>{
  Campground.findByIdAndRemove(req.params.id,(err,removedCampground)=>{
    if(err)
    {
      req.flash("error","Something went wrong");
      console.log(err);
      res.redirect("/campgrounds");
    }
    //Deleting associate comments
    Comment.deleteMany({_id:{$in:removedCampground.comments}},(err)=>{ 
      if(err)
        console.log(err);
      res.redirect("/campgrounds");  
    });
  });
});

  module.exports = router;