const path = require("path");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const APP_URL = process.env.APP_URL || "http://localhost:3000";

// PUJADA EN LOCAL
function uploadLocal(req, res) {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No s'ha enviat cap imatge" });
  }

  const filename = req.file.filename;
  const url = `${APP_URL}/uploads/${filename}`;

  return res.json({
    success: true,
    message: "Imatge pujada localment",
    image: {
      filename,
      path: `/uploads/${filename}`,
      url,
      size: req.file.size,
      mimetype: req.file.mimetype,
    },
  });
}

// PUJADA CLOUDINARY
function uploadCloud(req, res) {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No s'ha enviat cap imatge" });
  }

  new Promise((resolve, reject) => {
    const upload_stream = cloudinary.uploader.upload_stream(
      { folder: "task-manager/images" },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(upload_stream);
  })
    .then((result) => {
      res.json({
        success: true,
        message: "Imatge pujada a Cloudinary",
        image: {
          url: result.secure_url,
          public_id: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          size: result.bytes,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Error pujant a Cloudinary",
        error: err.message,
      });
    });
}
module.exports = {
  uploadLocal,
  uploadCloud,
};
