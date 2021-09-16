const { Router } = require('express');
const { isValidObjectId } = require('mongoose');
const { verify } = require('jsonwebtoken');

const router = Router();

const UserModel = require('../auth/auth.model');
const MovieModel = require('./movie.model');
const CommentModel = require('./comment.model');

router.get('/', async (req, res, next) => {
	let movies;
	try {
		movies = await MovieModel.find({}).limit(50);
	} catch (error) {
		console.log(error);
	}

	if (!movies || movies.length === 0) {
		return res.send('No movies found');
	}

	res.status(200).json(movies);
});

router.get('/m/:mid', async (req, res, next) => {
	let movieDetails;
	try {
		movieDetails = await MovieModel.findById(req.params.mid);
	} catch (error) {
		console.log(error);
	}

	if (!movieDetails) {
		return res.send('No movies found');
	}

	res.status(200).json(movieDetails);
});

// add new comment
// Private
router.post(
	'/m/:mid/comment',
	(req, res, next) => {
		if (!isValidObjectId(req.params.mid)) {
			return res.status(400).json({ error: 'Not valid Mongo ID' });
		}
		if (!req.headers.authorization) {
			return res.status(400).json({ error: 'Not valid Auth header' });
		}

		let decodedToken;
		try {
			decodedToken = verify(
				req.headers.authorization.split(' ')[1],
				process.env.JWT_SECRET,
			);
		} catch (error) {
			return res.json(error);
		}

		req.userId = decodedToken.userId;
		req.userEmail = decodedToken.email;

		next();
	},
	async (req, res, next) => {
		const newComment = new CommentModel({
			name: req.body.name,
			email: req.userEmail,
			movie_id: req.params.mid,
			text: req.body.text,
		});

		let savedComment;
		try {
			savedComment = await newComment.save();
		} catch (error) {
			console.log(error);
		}

		res.json(savedComment);
	},
);

module.exports = router;
