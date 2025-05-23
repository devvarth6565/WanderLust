const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const User = require("../models/user.js");



module.exports.signup = async(req,res)=>{

    try{let{username,email,password}= req.body;
    const newUser=new User({username,email});
    const registerUser=await User.register(newUser,password);
    console.log(registerUser);
    req.login(registerUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to WanderLust");
    res.redirect("/listings");
    }); 
    

    }catch(e){
       req.flash("error",e.message);
       res.redirect("/signup");
    }
    
};


module.exports.renderSignup = (req,res)=>{ 
    res.render("users/signup.ejs");
};

module.exports.renderLogin = (req,res)=>{
    res.render("users/login.ejs")
};

module.exports.login =async(req,res)=>{
    req.flash("success","Welcome bact to WanderLust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);

};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","You are logged out successfully from WanderLust");
        res.redirect("/listings");

    });
};
