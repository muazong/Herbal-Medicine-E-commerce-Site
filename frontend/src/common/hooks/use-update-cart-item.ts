'use client';

import { useMemo } from 'react';
import { debounce } from 'lodash';
import { updateCartItem } from '@/services/cart-service';

export const useDebounceUpdateCartItem = () => {
  const debouncedFn = useMemo(
    () =>
      debounce(
        async (
          productId: string,
          { quantity, isOrdered }: { quantity?: number; isOrdered?: boolean },
        ) => {
          await updateCartItem(productId, { quantity, isOrdered });
        },
        500,
      ),
    [],
  );

  return debouncedFn;
};
