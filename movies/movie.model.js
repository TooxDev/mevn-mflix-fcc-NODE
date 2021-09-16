const { Schema, model } = require('mongoose');

const MovieSchema = new Schema({});

module.exports = model('movie', MovieSchema);
