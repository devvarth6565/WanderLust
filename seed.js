require('dotenv').config();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const { data: sampleListings } = require('./init/data');

const dbUrl = process.env.ATLASDB_URL;

async function seedDB() {
  try {
    await mongoose.connect(dbUrl);
    console.log('Connected to MongoDB Atlas');
    await Listing.deleteMany({});
    await Listing.insertMany(sampleListings);
    console.log('Database seeded with sample listings!');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
  }
}

seedDB(); 