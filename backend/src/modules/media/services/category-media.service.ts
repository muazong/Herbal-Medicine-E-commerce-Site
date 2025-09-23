import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger, Injectable, Inject, forwardRef } from '@nestjs/common';

import { Media } from '../entities/media.entity';
import { MediaType } from '../../../common/enums';
import { Category } from '../../categories/entities/category.entity';
import { CategoriesService } from '../../categories/categories.service';

@Injectable()
export class CategoryMediaService {
  private readonly logger = new Logger(CategoryMediaService.name);

  constructor(
    @InjectRepository(Media) private readonly mediaRepo: Repository<Media>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,

    @Inject(forwardRef(() => CategoriesService))
    private readonly categoryService: CategoriesService,
  ) {}

  /**
   * Upload category image
   * @param id category id
   * @param file file to upload
   * @returns Promise<Category> - category
   * @throws Error
   */
  async uploadImage(id: string, file: Express.Multer.File): Promise<Category> {
    try {
      let category = await this.categoryService.findOne(id);

      if (!category.image) {
        const image = this.mediaRepo.create({
          path: file.path.replace(/^.*categories/, '/categories'),
          mimetype: file.mimetype,
          filename: file.filename,
          size: file.size,
          type: MediaType.CATEGORY,
        });

        await this.mediaRepo.save(image);
        category.image = image;
        await this.categoryRepo.save(category);
      } else {
        category = await this.updateImage(category, category.image, file);
      }

      return category;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to upload category image`, err.stack);
      throw err;
    }
  }

  /**
   * Update category image
   * @param category category
   * @param image image
   * @param file file to upload
   * @returns Promise<Category> - category
   * @throws Error
   */
  async updateImage(
    category: Category,
    image: Media,
    file: Express.Multer.File,
  ): Promise<Category> {
    try {
      image.path = file.path.replace(/^.*categories/, '/categories');
      image.mimetype = file.mimetype;
      image.filename = file.filename;
      image.size = file.size;
      image.type = MediaType.CATEGORY;

      category.image = image;

      return category;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to update category image`, err.stack);
      throw err;
    }
  }
}
