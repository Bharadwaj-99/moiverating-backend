const express = require("express");
const router = express.Router();
const movieService = require("./service");
router.post("/", movieService.createMovie);
router.put("/:id", movieService.updateMovie);
router.delete("/:id", movieService.deleteMovie);
router.get("/", movieService.getAllMovie);
router.get("/:id", movieService.getMovie);
module.exports = router;
