const mongoose = require('mongoose');

const CampgroundSchema = new mongoose.Schema({
    name:String,
    image:String,
    description:String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        },
        username:String
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'comment'
        }
    ]
  });

const Campground = mongoose.model('Campground',CampgroundSchema);

module.exports = Campground;