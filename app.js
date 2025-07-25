if(process.env.NODE_ENV != "production"){
require("dotenv").config();
}


const express = require ("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require ("ejs");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require ("method-override");
const ejsMate = require ("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const {listingSchema} = require("./schema.js");
const Review = require("./models/review.js");
const {reviewSchema} = require("./schema.js");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

const session = require ("express-session");
const mongoStore = require("connect-mongo");
const flash = require ("connect-flash");
const MongoStore = require("connect-mongo");


app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")))


//const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const dbUrl=process.env.ATLASDB_URL;


main().then(()=> {
    console.log("connection connected")
    
})
.catch((err)=>{
    console.log(err)
});
async function main() {
    await mongoose.connect(dbUrl)};

//we have to use flash before our routes



const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter: 24*3600,

});

store.on("error",()=>{
    console.log("error in mongo session store",err);
});

const sessionOptions = {
    store:store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    Cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    },  
};



app.use(session(sessionOptions));
app.use(flash());

app.use (passport.initialize());
app.use (passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




//locals

app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.currentUser = req.user; 
    next();
});



//routes
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


app.all("*",(req,res,next)=>
    {
        next(new expressError(404,"Page not found"));
    });
    

//error middleware for create route
app.use((err,req,res,next)=>
{
    let{statusCode=500,message="Something went wrong"}=err;
   // res.status(statusCode).send(message);
   res.status(statusCode).render("listings/error.ejs",{err});
});




app.listen(8080,()=>{
    console.log ("port 8080 is listning");
});

module.exports.createListings = async(req,res,next)=>{
    if (!req.file) {
        req.flash("error", "Image upload failed or no image selected.");
        return res.redirect("/listings/new");
    }
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
};
