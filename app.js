//INCLUDING PACKAGES
const express    = require("express");         //EXPRESS
const mongoose   = require('mongoose');       //INCLUDING MONGOOSE
const bodyParser = require("body-parser");    //INCLUDING BODY-PARSER
const methodOverride = require("method-override"); //INCLUDING method-override
const flash          = require('connect-flash');
const dotenv = require('dotenv');

const passport              = require('passport');
const localStrategy         = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');

//INCLUDING ROUTES
const indexRoutes      = require('./routes/index');
const commentRoutes    = require('./routes/comments');
const campgroundRoutes = require('./routes/campgrounds');
//===================================
//MODELS
//Campgrounds
const Campground = require('./models/campgrounds');
//Comment
const Comment = require('./models/comment');
//User
const User = require('./models/user');

//===================================
//CONNECTION TO DATABASE
// mongoose.connect('mongodb://localhost:27017/yelp_camp',{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false});

//Atlas
mongoose.connect('mongodb+srv://Arnab:%40admin@cluster0-cif3t.mongodb.net/test?retryWrites=true&w=majority',{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false,useCreateIndex:true});
// mongodb+srv://Arnab:<password>@cluster0-cif3t.mongodb.net/test?retryWrites=true&w=majority
mongoose.connection
              .once("open",()=> console.log("Connected"))
              .on("error",error=> console.log(error)); 

//===================================
//APP CONFIGURATION
const app = express();
app.set("view engine","ejs");                    //USING ejs
app.use(bodyParser.urlencoded({extended:true})); //USING body-parser
app.use(express.static(__dirname+'/public'));    //USING public directory
app.use(methodOverride('_method'))
app.use(flash());
dotenv.config();
//PASSPORT CONFIGURATION
app.use(require('express-session')({
  secret:"YelpCamp Project",
  resave:false,
  saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//
app.use((req,res,next)=>{
  res.locals.currentUser=req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

//ROUTES CONFIG
app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

//PORT 
const PORT = process.env.PORT || 3000

app.listen(PORT,process.env.IP,function(){
  console.log(`YelpCamp Server Started at PORT ${PORT}`);
});
