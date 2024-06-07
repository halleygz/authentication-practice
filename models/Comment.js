const mongoose = require("mongoose");
const CommentSchema = new Schema({
    blogId: {
        type: Schema.Types.ObjectId,
        ref: "Blog",
        required: true,
    },
    commenterId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: [true, "Please enter your comment"],
    }
})

const Comment = mongoose.model("comment", CommentSchema);
module.exports = Comment;