const Listing = require("../models/listing.js");
 

module.exports.index=async (req,res)=>
    {
        const allListings =await Listing.find({});
        res.render("listings/index.ejs",{allListings});
    };

  module.exports.renderNewForm=(req,res)=>
    {
       
        res.render("listings/new.ejs");
    };
    
    module.exports.showListing = async (req, res, next) => {
        let { id } = req.params;
        const listing = await Listing.findById(id).populate({path:"reviews",populate:{
            path:"author"
        },
    })
        .populate("owner");
    
        if (!listing) {
            req.flash("error","Listing you requested for does not exist")
            return res.redirect("/listings"); // Redirect if listing is not found
        }
        console.log(listing);
    
        res.render("listings/show.ejs", { listing });
    };

    module.exports.createListings = async(req,res,next)=>{
        let url = req.file.path;
        let filename = req.file.filename;
        
        console.log(req.body);
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image={url,filename};
        await newListing.save();
        req.flash("success","New Listing Created");
        res.redirect("/listings");

  
   
};

module.exports.editListing = async (req, res) => {  
    
        let { id } = req.params;
        const listing = await Listing.findById(id);

        let orignalImageUrl = listing.image.url;
        orignalImageUrl =orignalImageUrl.replace("/upload","/upload/h_300,w_250");
        res.render("listings/edit.ejs", { listing,orignalImageUrl });
    };


 module.exports.updateListing = async(req,res)=>{
       
         let {id} = req.params;
         const listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
        if(typeof req.file !== "undefined")
            {
         let url = req.file.path;
         let filename = req.file.filename;
         listing.image={url,filename};
         await listing.save();
        }
         req.flash("success","New Listing Updated");
 
         res.redirect(`/listings/${id}`);
     };   

     module.exports.destroyListing = async(req,res)=>{
         let {id} = req.params;
         //console.log(id);
         //here error is find by using console.log
         let deletedListing=await Listing.findByIdAndDelete(id);
         req.flash("success","Listing is deleted");
         console.log(deletedListing);
         res.redirect("/listings");
         
     };