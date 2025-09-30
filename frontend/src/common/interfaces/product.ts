import { AbstractInterface } from './abstract-interface';
import { Category } from './category';
import { Media } from './media';

export interface Product extends AbstractInterface {
  name: string;
  description: string;
  price: number;
  stock: number;
  rating: number;
  media: Media[];
  category: Category;
}
