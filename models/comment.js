const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text:String,
     author:
     {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        },
        username:String
    }
});

const Comment = mongoose.model('comment',commentSchema);

module.exports = Comment;