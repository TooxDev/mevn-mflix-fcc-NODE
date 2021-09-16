const { Schema, model, Types } = require('mongoose');

const CommentSchema = new Schema({
	name: {
		type: String,
		required: false,
	},
	email: {
		type: String,
		required: true,
	},
	movie_id: {
		type: Types.ObjectId,
		ref: 'movie',
	},
	text: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
	},
});

module.exports = model('comment', CommentSchema);
