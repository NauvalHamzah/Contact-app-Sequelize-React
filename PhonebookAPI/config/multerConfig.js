import multer from 'multer';
import path from 'path';

// Configure storage and file settings
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/avatar'),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images are allowed!'));
    },
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});

export default upload; // Export the multer instance
