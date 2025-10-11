'use client';

import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { CiCircleMinus } from 'react-icons/ci';
import { IoIosAddCircleOutline } from 'react-icons/io';

import { PATH } from '@/common/enums';
import { env } from '@/common/config';
import styles from './cart-list.module.css';
import { CartItem } from '@/common/interfaces';
import useCartItemsStore from '@/stores/cart-item-store';
import formatCurrency from '@/common/lib/format-currency';
import { deleteProductFromUserCart } from '@/services/cart-service';
import { useDebounceUpdate } from '@/common/hooks/use-debounce-update';

function Cart({ cartItem }: { cartItem: CartItem }) {
  const { product } = cartItem;
  const deleteCartItem = useCartItemsStore((state) => state.deleteCartItem);
  const getCartItem = useCartItemsStore((state) => state.getCartItem);
  const updateCartItemQuantity = useCartItemsStore(
    (state) => state.updateCartItemQuantity,
  );
  const debouncedUpdateCartItemQuantity = useDebounceUpdate();

  const imgUrl =
    product.media.length > 0
      ? `${env.SERVER_URL}${product.media[0].path}`
      : env.PRODUCT_URL;

  const handleActions = async (type: 'detail' | 'delete') => {
    if (type === 'detail') {
    } else {
      const res = await deleteProductFromUserCart(product.id);
      if (res) {
        toast.success('Đã xoá sản phẩm khỏi giỏ');
        deleteCartItem(cartItem);
      }
    }
  };

  const handleQuantityChange = async (type: 'increase' | 'decrease') => {
    let isUpdated = false;

    if (type === 'increase') {
      if (cartItem.quantity >= product.stock) return;
      isUpdated = true;
      updateCartItemQuantity(cartItem, cartItem.quantity + 1);
    } else {
      if (cartItem.quantity <= 1) return;
      isUpdated = true;
      updateCartItemQuantity(cartItem, cartItem.quantity - 1);
    }

    if (isUpdated) {
      const cartItemQuantity = getCartItem(cartItem.id);
      if (!cartItemQuantity) return;
      debouncedUpdateCartItemQuantity(
        cartItem.product.id,
        cartItemQuantity.quantity,
      );
    }
  };

  return (
    <tr className={styles.cartItem}>
      <td className={styles.image}>
        <Image src={imgUrl} alt={product.name} fill />
      </td>
      <td>{product.name}</td>
      <td className={styles.quantity}>
        <IoIosAddCircleOutline
          className={styles.icon}
          onClick={() => handleQuantityChange('increase')}
        />
        <p>{cartItem.quantity}</p>
        <CiCircleMinus
          className={styles.icon}
          onClick={() => handleQuantityChange('decrease')}
        />
      </td>
      <td>Còn {cartItem.product.stock} sản phẩm</td>
      <td>{formatCurrency(product.price * cartItem.quantity)}</td>
      <td>
        <div className={styles.actions}>
          <Link
            href={`${PATH.PRODUCTS}/${product.id}`}
            className={styles.detail}
          >
            Xem
          </Link>
          <button
            className={styles.delete}
            onClick={() => handleActions('delete')}
          >
            Xoá
          </button>
        </div>
      </td>
    </tr>
  );
}

export default Cart;
