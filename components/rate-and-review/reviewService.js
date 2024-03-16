const Review = require("./schema");
const Movie = require("../movies/schema");


async function rateAndReviewMovie(req, res) {
  try {
    const { id } = req.params;
    const { rating, text } = req.body;

    
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

   
    const review = new Review({
      movie: id,
      user: req.user._id,
      rating,
      text,
    });

    
    await review.save();

    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}


async function updateReview(req, res) {
  try {
    const { movieId, reviewId } = req.params;
    const { rating, text } = req.body;

    
    const review = await Review.findOne({ _id: reviewId, movie: movieId });
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    
    if (!review.user.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this review" });
    }

    
    review.rating = rating;
    review.text = text;
    await review.save();

    res.json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}


async function deleteReview(req, res) {
  try {
    const { movieId, reviewId } = req.params;

    
    const review = await Review.findOne({ _id: reviewId, movie: movieId });
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    
    if (!review.user.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this review" });
    }

    
    await review.deleteOne({_id:review._id});

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}


async function listReviews(req, res) {
  try {
    const { id } = req.params;

    
    const reviews = await Review.find({ movie: id });

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}


async function movieAverageRating(req, res) {
  try {
    const { id } = req.params;

    
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
