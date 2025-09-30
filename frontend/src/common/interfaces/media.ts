import { AbstractInterface } from './abstract-interface';

export interface Media extends AbstractInterface {
  path: string;
  filename: string;
  mimetype: string;
  size: number;
  type: string;
}
