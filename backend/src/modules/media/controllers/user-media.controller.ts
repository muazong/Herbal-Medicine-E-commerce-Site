import {
  Res,
  Get,
  Post,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  HttpStatus,
  Controller,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

import { UserMediaService } from '../services';
import { JwtAuthGuard } from '../../auth/guards';
import { Roles } from '../../../common/decorators';
import { RolesGuard } from '../../../common/guards';
import { mediaStorage } from '../../../common/utils';
import { MediaType, Role } from '../../../common/enums';

@Controller('media/user')
@Roles(Role.ADMIN, Role.CLIENT)
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserMediaController {
  constructor(private readonly userMediaService: UserMediaService) {}

  // ======================GET============================
  @Get(':userId/avatar')
  @HttpCode(HttpStatus.FOUND)
  findAvatar(@Param('userId') userId: string) {
    return this.userMediaService.findMedia(userId, MediaType.AVATAR);
  }

  @Get(':userId/cover')
  @HttpCode(HttpStatus.FOUND)
  findCover(@Param('userId') userId: string) {
    return this.userMediaService.findMedia(userId, MediaType.COVER);
  }

  @Get(':userId/images')
  @HttpCode(HttpStatus.FOUND)
  findImages(@Param('userId') userId: string) {
    return this.userMediaService.findImages(userId);
  }

  // ======================POST============================
  @Post(':userId/avatar')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: mediaStorage('avatar'),
    }),
  )
  async uploadAvatar(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const avatar = await this.userMediaService.uploadMedia(
      userId,
      file,
      MediaType.AVATAR,
    );
    return res.location(`/media/user/${userId}/avatar`).json(avatar);
  }

  @Post(':userId/cover')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: mediaStorage('cover'),
    }),
  )
  async uploadCover(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const cover = await this.userMediaService.uploadMedia(
      userId,
      file,
      MediaType.COVER,
    );
    return res.location(`/media/user/${userId}/cover`).json(cover);
  }

  // ======================DELETE============================
  @Delete(':userId/avatar')
  @HttpCode(HttpStatus.OK)
  removeAvatar(@Param('userId') userId: string) {
    return this.userMediaService.removeMedia(userId, MediaType.AVATAR);
  }

  @Delete(':userId/cover')
  @HttpCode(HttpStatus.OK)
  removeCover(@Param('userId') userId: string) {
    return this.userMediaService.removeMedia(userId, MediaType.COVER);
  }
}
