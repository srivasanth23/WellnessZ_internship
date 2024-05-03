const express = require("express");
const router = express.Router();
const {getPosts, newPost} = require("../controller/posts.controller.js");

router.get("/", getPosts);
router.post("/", newPost);

module.exports = router;