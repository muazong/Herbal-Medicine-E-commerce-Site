import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../contances';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
