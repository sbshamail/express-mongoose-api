const mongoose = require('mongoose');

module.exports = async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.DB);
    console.log("Connection to the database successful");
  } catch (error) {
    console.error("DB error:", error);
  }
}