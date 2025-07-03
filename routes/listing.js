const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const {reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js"); 

const listingController = require("../controllers/listings.js");

const multer = require("multer");
const {storage} = require("../cloudConfig.js"); 
const upload =multer({storage});



  //Delete route
  router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));



  router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn,upload.single("listing[image]"),wrapAsync(listingController.createListings));


   //new route
   router.get("/new",isLoggedIn,listingController.renderNewForm);
    
  router.route("/:id")
  .get( wrapAsync(listingController.showListing))
  .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing));
    
   
  
    //edit route
    router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editListing));
    



    module.exports = router;
