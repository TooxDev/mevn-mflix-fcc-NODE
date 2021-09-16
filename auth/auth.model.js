const { Schema, model, Types } = require('mongoose');

const AuthSchema = new Schema({
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		minlength: 6,
		required: true,
	},
	favorites: [
		{
			type: Types.ObjectId,
			ref: 'movie',
		},
	],
});

module.exports = model('user', AuthSchema);
