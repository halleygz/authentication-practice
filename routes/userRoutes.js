const { Router } = require("express");
const { user_get, blog_post } = require("../controllers/userControllers");
const router = Router()
router.get("/user", user_get);
router.post("/post-blog", blog_post)
module.exports = router