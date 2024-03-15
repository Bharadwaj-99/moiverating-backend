const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: String,
  director: String,
  genre: String,
  releaseYear: Number,
  description: String
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;