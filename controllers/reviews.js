const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.postingReview =async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    await newReview.save();
    listing.reviews.push(newReview);
    
    await listing.save();
    console.log("new review is saved");
    req.flash("success","Review Created");

    res.redirect(`/listings/${listing._id}`); // ✅ Redirect back to the listing



};

module.exports.destroyingReview = async(req,res) => {
   let{id,reviewId}=req.params;
   await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
   await Review.findByIdAndDelete(reviewId);
   req.flash("success","Review Deleted");

   res.redirect(`/listings/${id}`);
};
