const express = require("express");
const app = express();
app.use(express.json());
const PORT = 8000;

const postRoutes = require("./routes/postRoutes");
app.use("/api/posts", postRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
