import {
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  Controller,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '../auth/guards';
import { MediaService } from './media.service';
import { Roles } from '../../common/decorators';
import { RolesGuard } from '../../common/guards';
import { MediaType, Role } from '../../common/enums';
import { userImageStorage } from '../../common/utils';

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
      storage: userImageStorage('avatar'),
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
      storage: userImageStorage('cover'),
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
}
