'use client';

import { useMemo } from 'react';
import { debounce } from 'lodash';
import { updateCartItemQuantityFromUserCart } from '@/services/cart-service';

export const useDebounceUpdate = () => {
  const debouncedFn = useMemo(
    () =>
      debounce(async (productId: string, quantity: number) => {
        await updateCartItemQuantityFromUserCart(productId, quantity);
      }, 500),
    [],
  );

  return debouncedFn;
};
