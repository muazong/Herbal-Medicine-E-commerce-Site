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
import { useDebounceUpdateCartItem } from '@/common/hooks';
import { deleteProductFromUserCart } from '@/services/cart-service';

function Cart({ cartItem }: { cartItem: CartItem }) {
  const { product, isOrdered } = cartItem;
  const deleteCartItem = useCartItemsStore((state) => state.deleteCartItem);
  const getCartItem = useCartItemsStore((state) => state.getCartItem);
  const updateCartItem = useCartItemsStore((state) => state.updateCartItem);
  const debounceUpdateCartItem = useDebounceUpdateCartItem();

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
      updateCartItem(cartItem, { quantity: cartItem.quantity + 1 });
    } else {
      if (cartItem.quantity <= 1) return;
      isUpdated = true;
      updateCartItem(cartItem, { quantity: cartItem.quantity - 1 });
    }

    if (isUpdated) {
      const cartItemQuantity = getCartItem(cartItem.id);
      if (!cartItemQuantity) return;
      debounceUpdateCartItem(cartItem.id, {
        quantity: cartItemQuantity.quantity,
      });
    }
  };

  const handleIsOrderedChange = async (isOrdered: boolean) => {
    updateCartItem(cartItem, { isOrdered });

    await debounceUpdateCartItem(cartItem.id, {
      isOrdered,
    });
  };

  return (
    <tr className={styles.cartItem}>
      <td>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={isOrdered}
          onChange={(e) => handleIsOrderedChange(e.target.checked)}
        />
      </td>
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
