const express = require("express");
const router = express.Router();

const uploadLocal = require("../middleware/uploadLocal");
const uploadCloud = require("../middleware/uploadCloud");
const controller = require("../controllers/uploadController");

// Pujada Local
router.post("/local", uploadLocal.single("image"), (req, res) => {
  controller.uploadLocal(req, res);
});

// Pujada Cloudinary
router.post("/cloud", uploadCloud.single("image"), (req, res) => {
  controller.uploadCloud(req, res);
});

module.exports = router;
