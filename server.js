const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config();

const authRouter = require('./auth/auth.router');
const moviesRouter = require('./movies/movie.router');
// Comments are not related to movieId in the mFlix db, should not be used
// const commentsRouter = require("./comments/comment.router");

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/auth', authRouter);
app.use('/movies', moviesRouter);
// app.use("/comments", commentsRouter);

// db
require('./db/connectDb')();

// start server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
	console.log('running on port ' + PORT);
});
