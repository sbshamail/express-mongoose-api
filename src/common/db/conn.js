const mongoose = require('mongoose');

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connection db successful");
  } catch (error) {
    console.error("DB error:", error);
  }
}

connectToDatabase();