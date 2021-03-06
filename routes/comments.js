
const express = require('express');                  //requiring express
const router = express.Router({mergeParams:true});

const Campground = require('../models/campgrounds'); //requiring models
const Comment    = require('../models/comment');

const middleware = require('../middleware'); //requiring middlewares
//COMMENT ROUTES
//NEW comment
router.get("/new",middleware.isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id,(err,foundCampground)=>{
      if(err)
        console.log(err);
      else
        res.render('comments/new',{camp:foundCampground});
    });
  });
  //CREATE comment
  router.post("/",middleware.isLoggedIn,(req,res)=>{
    //find the campground by id
    //create a new comment in db
    //connect new comment to campground and save
    //redirect to show page
    Campground.findById(req.params.id,(err,foundCampground)=>{
      if(err)
        {
          console.log(err);
          res.redirect("/campgrounds");
        }  
      else
        {
          Comment.create(req.body.comment,(err,comment)=>{
            if(err)
              {
                console.log(err);
                res.redirect("/campgrounds");
              } 
              else
              {
                //associate user and comment
                comment.author.username = req.user.username;
                comment.author.id = req.user['_id'];
                //save comment
                comment.save();
                //connect new comment to campground and save
                foundCampground.comments.push(comment);
                foundCampground.save();
                req.flash("success","Please refresh the page");
                res.redirect("/campgrounds/"+foundCampground['_id']);
              } 
          });
  
        }  
    });
  });

//EDIT  
router.get("/:comment_id/edit",middleware.checkCommentOwnership,(req,res)=>{
  Comment.findById(req.params.comment_id,(err,foundComment)=>{
    if(err)
    {
      console.log(err);
      res.redirect("back");
    }
    else
    {
      res.render('../views/comments/edit',{campId:req.params.id,comment:foundComment});
    }
  });
});
//UPDATE - comment
router.put("/:comment_id",middleware.checkCommentOwnership,(req,res)=>{
  Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,updatedComment)=>{
    if(err)
    {
      console.log(err);
      res.redirect("back");
    }
    else
    {
      res.redirect("/campgrounds/"+req.params.id);
    }
  });
});
//DELETE - comment
router.delete("/:comment_id",middleware.checkCommentOwnership,(req,res)=>{
  Comment.findByIdAndRemove(req.params.comment_id,(err)=>{
    if(err)
    {
      console.log(err);
      res.redirect("back");
    }
    else
    res.redirect("/campgrounds/"+req.params.id);
  });
});


module.exports = router;