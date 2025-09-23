import {
  Res,
  Post,
  Param,
  UseGuards,
  Controller,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

import { Role } from '../../../common/enums';
import { JwtAuthGuard } from '../../auth/guards';
import { Roles } from '../../../common/decorators';
import { CategoryMediaService } from '../services';
import { RolesGuard } from '../../../common/guards';
import { mediaStorage } from '../../../common/utils';

@Roles(Role.ADMIN)
@Controller('media/category')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoryMediaController {
  constructor(private readonly categoryMediaService: CategoryMediaService) {}

  @Post(':id/image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: mediaStorage('category'),
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  // Upload category image
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const category = await this.categoryMediaService.uploadImage(id, file);
    return res.location(`/categories/${category.id}`).json(category);
  }
}
