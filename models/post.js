const mongoose = require('mongoose');


const PostsSchema = new mongoose.Schema({
    postImage:{
        type:String
      },
      postCaption:{
        type:String
      },
      postPublic:{
        type:Boolean,
        default:true
      },
      avatar:{
        type:String
      },
      name:{
        type:String
      },
      userId:{
        type:String
      }

  });

  const Post = mongoose.model('Post', PostsSchema);
  module.exports = Post;