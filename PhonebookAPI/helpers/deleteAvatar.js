import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const deleteAvatar = (PORT, avatarPath) => {
    return new Promise((resolve, reject) => {
      if (avatarPath) {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
  
        const relativePath = avatarPath.replace(`http://localhost:${PORT}/`, '');
        const absolutePath = path.join(__dirname, '..', relativePath);
  
        console.log('Deleting avatar at:', absolutePath);
  
        fs.unlink(absolutePath, (err) => {
          if (err) {
            console.error('Failed to delete avatar file:', err);
            reject('Failed to delete avatar file');
          } else {
            console.log('Avatar file deleted successfully');
            resolve();
          }
        });
      } else {
        resolve(); // No avatar to delete
      }
    });
  };

  export default deleteAvatar;