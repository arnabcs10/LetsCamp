const mongoose = require('mongoose');      //INCLUDING MONGOOSE
const passportLocalMongoose = require('passport-local-mongoose');  //INCLUDING passport-local-mongoose

//SETTING USER SCHEMA
const userSchema = new mongoose.Schema({
    username:String,
    password:String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user',userSchema);