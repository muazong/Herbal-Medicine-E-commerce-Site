import { AbstractInterface } from './abstract-interface';
import { Media } from './media';

export interface Category extends AbstractInterface {
  name: string;
  description: string;
  image: Media;
}
