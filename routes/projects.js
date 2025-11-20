const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const {
  getAllProjects,
  getFeaturedProjects,
  getProjectsByCategory,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// utnuk mengambil data semua project dari database
router.get('/', getAllProjects);
// untuk mengambil data project unggulan jika admin ingin menandai suatu projek unggulannya
router.get('/featured', getFeaturedProjects);
// route ini untuk mengambil data projek dengan katergori tertentu
router.get('/category/:category', getProjectsByCategory);
// untuk mengambil data satu projek 
router.get('/:id', getProjectById);
// route untuk admin membuat/menambahkan project
router.post('/', requireAdmin, upload.single('image'), createProject);
// route ini untuk mengupdate suatu project
router.put('/:id', requireAdmin, upload.single('image'), updateProject);
// route ini untuk menghapus suatu project
router.delete('/:id', requireAdmin, deleteProject);

module.exports = router;
