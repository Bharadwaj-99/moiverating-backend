const express = require("express");
const router = express.Router();
const reviewsService = require("./reviewService.js");

router.post("/:id/reviews", reviewsService.rateAndReviewMovie);

router.put("/:movieId/reviews/:reviewId", reviewsService.updateReview);

router.delete("/:movieId/reviews/:reviewId", reviewsService.deleteReview);

router.get("/:id/reviews", reviewsService.listReviews);

router.get("/:id/averageRating", reviewsService.movieAverageRating);

module.exports = router;
