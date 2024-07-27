const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    if (connect.connection.readyState === 1) {
      console.log("DB connection is successfully");
    } else {
      console.log("Have some error while connect with mongodb");
    }
  } catch (error) {
    console.log("Cannot connect with database");
    throw new Error(error);
  }
};

module.exports = dbConnect;
