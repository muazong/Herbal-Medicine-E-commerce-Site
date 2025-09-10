import { MediaType } from '../../../common/enums';

export class CreateMediaDto {
  path: string;
  filename: string;
  mimetype: string;
  size: number;
  type: MediaType;
}
