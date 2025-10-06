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
    try {
      // PERF: Check if product image already exists
      const product = await this.productService.findOne(productId);

      const mediaList = files.map((file) => {
        return this.mediaRepo.create({
          path: file.path.replace(/^.*products/, '/products'),
          mimetype: file.mimetype,
          filename: file.filename,
          size: file.size,
          type: MediaType.PRODUCT,
          product,
        });
      });

      await this.mediaRepo.save(mediaList);
      product.media = [...product.media!, ...mediaList];
      return await this.productRepo.save(product);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to upload product images`, err.stack);
      throw err;
    }
  }
}
