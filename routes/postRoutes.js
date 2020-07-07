const router = require("express").Router();

router.post("/", (req, res) => {
  res.json("Hello");
});

module.exports = router;
