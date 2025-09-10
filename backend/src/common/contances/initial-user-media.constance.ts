import { MediaType } from '../enums';
import { DefaultImagesName } from './default-images-name.constance';
import { DefaultImagesPath } from './default-images.constance';

export const InitialUserMedia = {
  avatar: {
    path: DefaultImagesPath.LOCAL_AVATAR,
    filename: DefaultImagesName.LOCAL_AVATAR,
    mimetype: 'svg',
    size: 0,
    type: MediaType.AVATAR,
  },
  cover: {
    path: DefaultImagesPath.LOCAL_COVER,
    filename: DefaultImagesName.LOCAL_COVER,
    mimetype: 'svg',
    size: 0,
    type: MediaType.COVER,
  },
};
