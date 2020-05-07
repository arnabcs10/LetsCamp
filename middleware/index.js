//ALL MIDDLEWARES GOES HERE

const Campground = require('../models/campgrounds');
const Comment = require('../models/comment');

const middlewareObj={};
//middleware for edit delete authorization for campgrounds
middlewareObj.checkCampgroundOwnership = function(req,res,next){
  if(req.isAuthenticated())
  {
        Campground.findById(req.params.id,(err,foundCampground)=>{
        if(err)
        {
            console.log(err);
            res.redirect("back");
        }
        else
        {
            if(foundCampground.author.id.equals(req.user._id))
            next();
            else
            {
              req.flash("error","You need to be logged in to do that");
              res.redirect("back");
            }
        }
        });
  }
  else
    res.redirect("/login");
}
//middleware for edit delete authorization for comments
middlewareObj.checkCommentOwnership = function(req,res,next)
{
  if(req.isAuthenticated())
  {
    Comment.findById(req.params.comment_id,(err,foundComment)=>{
      if(err)
      {
        req.flash("error","Something went wrong");
        console.log(err);
        res.redirect("back");
      }
      else
      {
        if(foundComment.author.id.equals(req.user._id))
          next();
        else
         {
          req.flash("error","You need to be logged in to do that");
          res.redirect("back");
         } 
      }
    })
  }
  else
  {
    req.flash("error","You need to be logged in to do that");
    res.redirect("/login");
  }
}
//middleware for login check
middlewareObj.isLoggedIn= function (req,res,next)
{
    if(req.isAuthenticated())
      return next();
    req.flash("error","Please Login First!");
    res.redirect("/login");
}

module.exports = middlewareObj;
