const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const {listingSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const path = require("path");
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviewsController = require("../controllers/reviews.js");


//reviews post rout
router.post("/",validateReview,wrapAsync(reviewsController.postingReview));



//review deletee route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewsController.destroyingReview));

module.exports =router;