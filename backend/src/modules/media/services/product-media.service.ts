import { extname, join } from 'path';
import * as fs from 'fs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger, Injectable } from '@nestjs/common';

import { Media } from '../entities/media.entity';
import { MediaType } from '../../../common/enums';
import { Product } from '../../products/entities/product.entity';
import { ProductsService } from '../../products/products.service';

@Injectable()
export class ProductMediaService {
  private readonly logger = new Logger(ProductMediaService.name);

  constructor(
    @InjectRepository(Media) private readonly mediaRepo: Repository<Media>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    private readonly productService: ProductsService,
  ) {}

  /**
   * Finds the product's images.
   * @param productId - The ID of the product to find the images for.
   * @returns Promise<Media[]> - The found product's images.
   * @throws Error if any other error occurs.
   */
  async findImages(productId: string) {
    try {
      const product = await this.productService.findOne(productId);
      return product.media;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to fetch product images`, err.stack);
      throw err;
    }
  }

  /**
   * Uploads product images.
   * @param productId - The ID of the product to upload the images for.
   * @param files - The product images to upload.
   * @returns Promise<Product> - The updated product.
   * @throws Error if any other error occurs.
   */
  async uploadImages(productId: string, files: Express.Multer.File[]) {
    const product = await this.productService.findOne(productId);

    const savedMediaList: Media[] = [];

    for (const file of files) {
      const media = this.mediaRepo.create({
        path: '',
        filename: '',
        mimetype: file.mimetype,
        size: file.size,
        type: MediaType.PRODUCT,
        product,
      });

      const savedMedia = await this.mediaRepo.save(media);

      const ext = extname(file.originalname);
      const newFilename = `${savedMedia.id}${ext}`;
      const oldPath = file.path;
      const newPath = join(file.destination, newFilename);

      fs.renameSync(oldPath, newPath);

      savedMedia.filename = newFilename;
      savedMedia.path = newPath.replace(/^.*products/, '/products');
      await this.mediaRepo.save(savedMedia);

      savedMediaList.push(savedMedia);
    }

    product.media = [...product.media!, ...savedMediaList];
    return await this.productRepo.save(product);
  }

  async updateImages(productId: string, files: Express.Multer.File[]) {
    try {
      const product = await this.productService.findOne(productId);
      if (!product.media) {
        return;
      }

      const savedMediaList: Media[] = [];

      for (const file of files) {
        const media = this.mediaRepo.create({
          path: '',
          filename: '',
          mimetype: file.mimetype,
          size: file.size,
          type: MediaType.PRODUCT,
          product,
        });

        const savedMedia = await this.mediaRepo.save(media);

        const ext = extname(file.originalname);
        const newFilename = `${savedMedia.id}${ext}`;
        const oldPath = file.path;
        const newPath = join(file.destination, newFilename);

        fs.renameSync(oldPath, newPath);

        savedMedia.filename = newFilename;
        savedMedia.path = newPath.replace(/^.*products/, '/products');
        await this.mediaRepo.save(savedMedia);

        savedMediaList.push(savedMedia);
      }

      product.media = [...product.media!, ...savedMediaList];
      return await this.productRepo.save(product);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to update product images`, err.stack);
      throw err;
    }
  }

  async deleteImages(productId: string) {
    try {
      const product = await this.productService.findOne(productId);
      if (!product.media) {
        return;
      }

      const mediaList = product.media;

      for (const media of mediaList) {
        const dir = join(process.cwd(), 'uploads', 'products', productId);
        fs.unlinkSync(join(dir, media.filename));
      }

      product.media = [];
      return await this.productRepo.save(product);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to delete product images`, err.stack);
      throw err;
    }
  }
}
