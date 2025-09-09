import {
  Get,
  Put,
  Post,
  Param,
  Delete,
  Controller,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UserMedia } from '../common/enums';
import { MediaService } from './media.service';
import { userImageStorage } from '../common/utils';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('user/:id/avatar')
  findUserAvatar(@Param('id') id: string) {
    return this.mediaService.findUserMedia(id, UserMedia.AVATAR);
  }

  @Get('user/:id/cover')
  findUserCover(@Param('id') id: string) {
    return this.mediaService.findUserMedia(id, UserMedia.COVER);
  }

  @Get('user/:id/images')
  findUserImages(@Param('id') id: string) {
    return this.mediaService.findUserImages(id);
  }

  @Post('user/:id/avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: userImageStorage('avatar'),
    }),
  )
  uploadUserAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.mediaService.uploadUserMedia(id, file, UserMedia.AVATAR);
  }

  @Post('user/:id/cover')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: userImageStorage('cover'),
    }),
  )
  uploadUserCover(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.mediaService.uploadUserMedia(id, file, UserMedia.COVER);
  }

  @Put('user/:id/avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: userImageStorage('avatar'),
    }),
  )
  updateUserAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.mediaService.updateUserMedia(id, file, UserMedia.AVATAR);
  }

  @Put('user/:id/cover')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: userImageStorage('cover'),
    }),
  )
  updateUserCover(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.mediaService.updateUserMedia(id, file, UserMedia.COVER);
  }

  @Delete('user/:id/avatar')
  removeUserAvatar(@Param('id') id: string) {
    return this.mediaService.removeUserMedia(id, UserMedia.AVATAR);
  }

  @Delete('user/:id/cover')
  removeUserCover(@Param('id') id: string) {
    return this.mediaService.removeUserMedia(id, UserMedia.COVER);
  }
}
