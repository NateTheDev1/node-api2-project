const router = require("express").Router();
// const { insert } = require("../data/db");
const db = require("../data/db");

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

module.exports = router;
