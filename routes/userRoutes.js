const { Router } = require("express");
const { user_get, blog_post, comment_post, allBlogs } = require("../controllers/userControllers");
const router = Router()
router.get("/user", user_get);
router.post("/post-blog", blog_post)
router.get("/allblogs", allBlogs)
router.post("/post-comment", comment_post)
module.exports = router