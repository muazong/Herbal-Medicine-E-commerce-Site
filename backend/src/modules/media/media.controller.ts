import {
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  Controller,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '../auth/guards';
import { MediaService } from './media.service';
import { Roles } from '../../common/decorators';
import { RolesGuard } from '../../common/guards';
import { mediaStorage } from '../../common/utils';
import { MediaType, Role } from '../../common/enums';

@Controller('media')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.CLIENT)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('user/:id/avatar')
  findUserAvatar(@Param('id') id: string) {
    return this.mediaService.findUserMedia(id, MediaType.AVATAR);
  }

  @Get('user/:id/cover')
  findUserCover(@Param('id') id: string) {
    return this.mediaService.findUserMedia(id, MediaType.COVER);
  }

  @Get('user/:id/images')
  findUserImages(@Param('id') id: string) {
    return this.mediaService.findUserImages(id);
  }

  @Post('user/:id/avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: mediaStorage('avatar'),
    }),
  )
  uploadUserAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.mediaService.uploadUserMedia(id, file, MediaType.AVATAR);
  }

  @Post('user/:id/cover')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: mediaStorage('cover'),
    }),
  )
  uploadUserCover(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.mediaService.uploadUserMedia(id, file, MediaType.COVER);
  }

  @Delete('user/:id/avatar')
  removeUserAvatar(@Param('id') id: string) {
    return this.mediaService.removeUserMedia(id, MediaType.AVATAR);
  }

  @Delete('user/:id/cover')
  removeUserCover(@Param('id') id: string) {
    return this.mediaService.removeUserMedia(id, MediaType.COVER);
  }

  @Get('product/:id/images')
  findProductImages(@Param('id') id: string) {
    return this.mediaService.findProductImages(id);
  }

  @Post('product/:id/images')
  @UseInterceptors(
    FilesInterceptor('files', 6, {
      storage: mediaStorage('product'),
    }),
  )
  uploadProductImages(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.mediaService.uploadProductImages(id, files);
  }

  @Post('category/:id/image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: mediaStorage('category'),
    }),
  )
  uploadCategoryImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.mediaService.uploadCategoryImage(id, file);
  }
}
