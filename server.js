const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config()
const app = express();
const PORT = process.env.PORT;

app.use(cors());

// Yükleme dizininin varlığını kontrol edin ve yoksa oluşturun
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Multer konfigürasyonu
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Yükleme route'u
app.post('/upload', upload.single('image'), (req, res) => {
  try {
    const filePath = `https://uploadimage-839o.onrender.com/uploads/${req.file.filename}`;
    res.status(200).json({ message: 'Image uploaded successfully', filePath });
  } catch (error) {
    res.status(500).json({ message: 'Image upload failed', error });
  }
});

// Yüklenen dosyaları sunmak için statik bir dosya servisi ekleyin
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
