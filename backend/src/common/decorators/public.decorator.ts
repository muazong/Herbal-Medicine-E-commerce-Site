import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../contances';

// NOTE: Remember to use it. OK :3
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
