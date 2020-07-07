const router = require("express").Router();
// const { insert } = require("../data/db");
const db = require("../data/db");
const { restart } = require("nodemon");

router.post("/", async (req, res) => {
  const { title, contents } = req.body;
  if (title === undefined || contents === undefined) {
    return res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  }

  const newPost = await db.insert(req.body);
  if (!newPost) {
    return res.status(500).json({
      error: "There was an error while saving the post to the database",
    });
  }
  res.status(201).json({ ...newPost, ...req.body });
});

router.post("/:id/comments", async (req, res) => {
  const foundPost = await db.findById(req.params.id);
  if (foundPost.length < 1) {
    return res
      .status(404)
      .json({ message: "The post with the specified ID does not exist." });
  }

  if (req.body.text === undefined) {
    return res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment." });
  }

  const newComment = {
    post_id: req.params.id,
    text: req.body.text,
  };

  const savedComment = await db.insertComment(newComment);
  if (!savedComment) {
    return res
      .status(500)
      .json({ errorMessage: "Please provide text for the comment." });
  }

  res.status(201).json({ ...savedComment, ...req.body });
});

router.get("/", async (req, res) => {
  const posts = await db.find();
  if (!posts) {
    return res
      .status(500)
      .json({ error: "The posts information could not be retrieved." });
  }

  res.status(200).json({ ...posts });
});

router.get("/:id", async (req, res) => {
  const foundPost = await db.findById(req.params.id);
  if (foundPost.length < 1) {
    return res
      .status(400)
      .json({ message: "The post with the specified ID does not exist." });
  }
  res.json({ ...foundPost });
});

router.get("/:id/comments", async (req, res) => {
  const foundPost = await db.findPostComments(req.params.id);
  if (foundPost.length < 1) {
    return res
      .status(400)
      .json({ message: "The post with the specified ID does not exist." });
  }
  res.json({ ...foundPost });
});

router.delete("/:id", async (req, res) => {
  const toDelete = await db.findById(req.params.id);
  const deleted = await db.remove(req.params.id);
  if (deleted < 1) {
    return res
      .status(404)
      .json({ message: "The post with the specified ID does not exist." });
  }
  res.json({
    message: `${deleted} post/posts was deleted`,
    deleted: { ...toDelete },
  });
});

router.put("/:id", async (req, res) => {
  const foundPost = await db.findById(req.params.id);
  if (foundPost.length < 1) {
    return res
      .status(400)
      .json({ message: "The post with the specified ID does not exist." });
  }
  const { title, contents } = req.body;
  if (title === undefined || contents === undefined) {
    return res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  }

  const updated = await db.update(req.params.id, { ...req.body });
  const updatedPost = await db.findById(req.params.id);
  if (updated < 1) {
    return res
      .status(500)
      .json({ error: "The post information could not be modified." });
  }
  res
    .status(200)
    .json({
      message: `${updated} post was modified`,
      updated: { ...updatedPost },
    });
});

module.exports = router;
