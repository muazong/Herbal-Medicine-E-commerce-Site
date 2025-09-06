import {
  Get,
  Put,
  Post,
  Param,
  Controller,
  UploadedFile,
  UseInterceptors,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { MediaService } from './media.service';
import { userImageStorage } from '../common/utils';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('user/:id/avatar')
  findUserAvatar(@Param('id') id: string) {
    return this.mediaService.findUserAvatar(id);
  }

  @Get('user/:id/cover')
  findUserCover(@Param('id') id: string) {
    return this.mediaService.findUserCover(id);
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
    return this.mediaService.uploadUserAvatar(id, file);
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
    return this.mediaService.updateUserAvatar(id, file);
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
    return this.mediaService.uploadUserCover(id, file);
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
    return this.mediaService.updateUserCover(id, file);
  }

  @Delete('user/:id/avatar/:avatarId')
  removeUserAvatar(
    @Param('id') id: string,
    @Param('avatarId') avatarId: string,
  ) {}

  @Delete('user/:id/cover/:coverId')
  removeUserCover(@Param('id') id: string, @Param('coverId') coverId: string) {}
}
