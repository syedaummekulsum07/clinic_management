const mongoose = require("mongoose");


// mongoose.connect(process.env.MONGO_URI).then(()=>{
//     console.log("Connected to database successfully");
// }).catch(err => console.log(err));

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 30000 });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('DB connection error:', err.message);
    process.exit(1); // Crash fast for Render restart
  }
}
module.exports = connectDB;