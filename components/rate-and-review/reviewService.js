const Review = require("./schema");
const Movie = require("../movies/schema");

// Rate and Review Movie
async function rateAndReviewMovie(req, res) {
  try {
    const { id } = req.params;
    const { rating, text } = req.body;

    // Check if the movie exists
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Create the review
    const review = new Review({
      movie: id,
      user: req.user._id,
      rating,
      text,
    });

    // Save the review
    await review.save();

    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

// Update Review
async function updateReview(req, res) {
  try {
    const { movieId, reviewId } = req.params;
    const { rating, text } = req.body;

    // Check if the review exists
    const review = await Review.findOne({ _id: reviewId, movie: movieId });
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if the user is the owner of the review
    if (!review.user.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this review" });
    }

    // Update the review
    review.rating = rating;
    review.text = text;
    await review.save();

    res.json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

// Delete Review
async function deleteReview(req, res) {
  try {
    const { movieId, reviewId } = req.params;

    // Check if the review exists
    const review = await Review.findOne({ _id: reviewId, movie: movieId });
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if the user is the owner of the review
    if (!review.user.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this review" });
    }

    // Delete the review
    await review.deleteOne({_id:review._id});

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

// List Reviews
async function listReviews(req, res) {
  try {
    const { id } = req.params;

    // Fetch all reviews for the movie
    const reviews = await Review.find({ movie: id });

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

// Movie Average Rating
async function movieAverageRating(req, res) {
  try {
    const { id } = req.params;

    // Calculate the average rating for the movie
    const averageRating = await Review.aggregate([
      { $match: { movie: id } },
      { $group: { _id: "$movie", averageRating: { $avg: "$rating" } } },
    ]);

    if (averageRating.length === 0) {
      return res
        .status(404)
        .json({ message: "No ratings available for this movie" });
    }

    res.json({ averageRating: averageRating[0].averageRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  rateAndReviewMovie,
  updateReview,
  deleteReview,
  listReviews,
  movieAverageRating,
};
