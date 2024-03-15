const express = require("express");
const app = express();
const userRoutes = require("./components/users/routes");
const moviesRoutes = require("./components/movies/routes");
const authenticateToken = require("./components/users/authenticate");
const reviewRouter = require("./components/rate-and-review/router");
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/movies", moviesRoutes);
app.use("/api/movies", authenticateToken, reviewRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
