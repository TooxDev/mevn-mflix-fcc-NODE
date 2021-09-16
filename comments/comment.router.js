const { Router } = require("express");
const router = Router();

const CommentModel = require("./comment.model");
const MovieModel = require("../movies/movie.model");

router.get("/", async (req, res, next) => {
  let comments;
  try {
    comments = await CommentModel.find({}).limit(50);
  } catch (error) {
    console.log(error);
  }

  console.log(comments);
  let moviesForComments;
  try {
    moviesForComments = await MovieModel.find();
  } catch (error) {
    console.log(error);
  }

  if (!comments || comments.length === 0) {
    return res.send("No movies found");
  }

  res.status(200).json(comments);
});

module.exports = router;
