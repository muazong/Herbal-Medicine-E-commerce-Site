import * as fs from 'fs';
import { extname, join } from 'path';
import { diskStorage } from 'multer';

export const mediaStorage = (
  type: 'avatar' | 'cover' | 'product' | 'category',
) => {
  return diskStorage({
    destination: (req, _, cb) => {
      let id: string = req.params.userId;
      let folder: 'users' | 'products' | 'categories' = 'users';

      if (type === 'product') {
        id = req.params.productId;
        folder = 'products';
      } else if (type === 'category') {
        id = req.params.categoryId;
        folder = 'categories';
      }

      const dir = join(process.cwd(), 'uploads', folder, `${id}`);

      if (type === 'product') {
        if (fs.existsSync(dir)) {
          fs.unlinkSync(dir);
        }
      }

      // FIX: user avatar with different extname

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      } else if (type === 'product') {
        // TODO: Check the number of photos reached 6 pictures
      } else if (type === 'category') {
        // A category can have only one image.
        // If the category folder already has an image, delete it before uploading a new one.

        const files = fs.readdirSync(dir);
        for (const file of files) {
          fs.unlinkSync(join(dir, file));
        }
      }

      cb(null, dir);
    },
    filename: (_, file, cb) => {
      if (type === 'product' || type === 'category') {
        const uniqueSuffix = crypto.randomUUID();
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      } else {
        cb(null, `${type}${extname(file.originalname)}`);
      }
    },
  });
};
