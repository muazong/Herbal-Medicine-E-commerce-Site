'use client';

import Link from 'next/link';
import { FaShoppingCart } from 'react-icons/fa';
import styles from './header.module.css';
import { PATH } from '@/common/enums';
import { useEffect } from 'react';
import { getProductsFromUserCart } from '@/services/cart-service';
import useCartItemsStore from '@/stores/cart-item-store';

function CartLink() {
  const length = useCartItemsStore((state) => state.length);
  const setCartItems = useCartItemsStore((state) => state.setCartItems);

  useEffect(() => {
    (async () => {
      const cartItems = await getProductsFromUserCart();
      if (cartItems) {
        setCartItems(cartItems);
      }
    })();
  }, [setCartItems]);

  return (
    <Link href={PATH.CART} className={styles.cart}>
      <FaShoppingCart className={styles.cartIcon} />
      {length && length > 0 ? (
        <span className={styles.dot}>{length}</span>
      ) : null}
    </Link>
  );
}

export default CartLink;
