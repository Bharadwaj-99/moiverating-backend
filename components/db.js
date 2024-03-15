const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://rishabhbharadwaj99:fvEMIJviJoDoYXyn@movie-rating.ce8pqd4.mongodb.net/movierat",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;
db.on("connected", () => {
  console.log("Connected to MongoDB");
});
mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

module.exports = mongoose;
