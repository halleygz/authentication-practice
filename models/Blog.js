const mongoose = require("mongoose");

const BlogSchema = new Schema({
    authorId: {
        type: Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },
    title: {
        type: String,
        required: [true, "Please enter a title"], 
    },
    content: {
        type: String,
        required: [true, "Please enter a content"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
      unpdatedAt: {
        type: Date,
        default: Date.now,
      },
})

const Blog = mongoose.model("blog", BlogSchema);
module.exports = Blog;