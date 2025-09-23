import {
  Post,
  Param,
  UseGuards,
  Controller,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
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
  uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.categoryMediaService.uploadImage(id, file);
  }
}
