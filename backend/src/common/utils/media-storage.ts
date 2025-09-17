import * as fs from 'fs';
import { extname, join } from 'path';
import { diskStorage } from 'multer';

export const mediaStorage = (type: 'avatar' | 'cover' | 'product-images') => {
  return diskStorage({
    destination: (req, _, cb) => {
      let folder: 'users' | 'products' = 'users';

      if (type === 'product-images') {
        folder = 'products';
      }

      const id = req.params.id;
      const dir = join(process.cwd(), 'uploads', folder, `${id}`);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      cb(null, dir);
    },
    filename: (_, file, cb) => {
      if (type === 'product-images') {
        const uniqueSuffix = crypto.randomUUID();
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      } else {
        cb(null, `${type}${extname(file.originalname)}`);
      }
    },
  });
};
