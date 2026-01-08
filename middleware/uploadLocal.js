const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Defineix la carpeta on es guardaran els fitxers pujats
const uploadsDir = path.join(__dirname, "..", "uploads");

// Comprova si la carpeta existeix; si no, la crea
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true }); // 'recursive: true' permet crear subcarpetes si cal
}

// Llista de tipus MIME permesos (solament imatges)
const ALLOWED_MIMETYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/heic",
  "image/heif",
];

// Configuració de l'emmagatzematge de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir); // Carpeta on es guardarà el fitxer
  },
  filename: function (req, file, cb) {
    // Genera un nom únic: timestamp + nom original del fitxer (sense espais)
    const safeName = file.originalname.replace(/\s+/g, "-"); // Substitueix espais per guions
    const uniqueName = `${Date.now()}-${safeName}`; // Afegeix timestamp per fer-lo únic
    cb(null, uniqueName); // Retorna el nom final del fitxer
  },
});

// Funció per filtrar els fitxers segons el tipus MIME
function fileFilter(req, file, cb) {
  if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
    cb(null, true); // Fitxer permès, Multer l'accepta
  } else {
    cb(new Error("Tipus d'arxiu no vàlid. Només imatges acceptades. "), false);
  }
}

// Configuració final de Multer amb emmagatzematge, filtre i límit de mida
const uploadLocal = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Mida màxima per fitxer: 5 MB
});

// Exporta la configuració per poder usar-la en altres fitxers
module.exports = uploadLocal;
