import {
  Res,
  Get,
  Post,
  Param,
  HttpCode,
  UseGuards,
  HttpStatus,
  Controller,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { Response } from 'express';
import { Role } from '../../../common/enums';
import { JwtAuthGuard } from '../../auth/guards';
import { ProductMediaService } from '../services';
import { Roles } from '../../../common/decorators';
import { RolesGuard } from '../../../common/guards';
import { mediaStorage } from '../../../common/utils';

@Roles(Role.ADMIN)
@Controller('media/product')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductMediaController {
  constructor(private readonly productMediaService: ProductMediaService) {}

  @Get(':productId/images')
  @HttpCode(HttpStatus.FOUND)
  findImages(@Param('productId') productId: string) {
    return this.productMediaService.findImages(productId);
  }

  @Post(':productId/images')
  @HttpCode(HttpStatus.FOUND)
  @UseInterceptors(
    FilesInterceptor('files', 6, {
      storage: mediaStorage('product'),
    }),
  )
  async uploadImages(
    @Param('productId') productId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Res() res: Response,
  ) {
    const product = await this.productMediaService.uploadImages(
      productId,
      files,
    );
    return res.location(`/media/product/${productId}/images`).json(product);
  }
}
