import * as fs from 'fs';
import { extname, join } from 'path';
import { diskStorage } from 'multer';

export const userImageStorage = (type: 'avatar' | 'cover') => {
  return diskStorage({
    destination: (req, _, cb) => {
      const userId = req.params.id;
      const dir = join(process.cwd(), 'uploads', 'users', `${userId}`);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      cb(null, dir);
    },
    filename: (_, file, cb) => {
      cb(null, `${type}${extname(file.originalname)}`);
    },
  });
};
