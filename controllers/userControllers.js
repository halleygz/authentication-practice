const User = require("../models/User");
const Blog = require("../models/Blog");
const Comment = require("../models/Comment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const secret = process.env.JWT_SECRET;
//handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  };
  if (err.message === "incorrect cridentials") {
    errors.username = "incorrect cridentials";
  }

  // duplicate error code
  if (err.message.includes("E11000 duplicate key error collection")) {
    const msg = Object.values(err.errorResponse)[4];
    const property = msg.hasOwnProperty("email") ? "email" : "username";
    const respond =
      property === "email" ? "email already in use" : "username already in use";
    errors[property] = respond;
  }

  //validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
    console.log(errors);
  }
  return errors;
};

module.exports.user_get = (req, res) => {
  res.render("userhome");
};

module.exports.blog_post = async (req, res) => {
  const { title, content } = req.body;
  let user = "";
  const token = req.cookies.jwt;
  jwt.verify(token, secret, async (err, decodedToken) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log(decodedToken);
      user = decodedToken.id;
    }
  });
  try {
    const blog = await Blog.create({
      authorId: user,
      title,
      content,
    });
    res.status(201).json({ blog });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(401).json(errors);
  }
};

module.exports.comment_post = async (req, res) => {
  const { content, blogId } = req.body;
  let user = "";
  const token = req.cookies.jwt;
  jwt.verify(token, secret, async (err, decodedToken) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log(decodedToken);
      user = decodedToken.id;
    }
  });
  try {
    const comment = await Comment.create({
      commenterId: user,
      blogId,
      content,
    });
    res.status(201).json({ comment });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(401).json(errors);
  }
};
module.exports.allBlogs = async (req, res) => {
  try {
    let perPage = 10;
    let page = req.query.page || 1;
    const data = await Blog.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await Blog.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);
    res.locals.data = data
    res.render("allblogs", {
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
    });
  } catch (err) {
    console.log(err)
  }
};
