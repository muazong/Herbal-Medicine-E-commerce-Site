'use client';
import { CartItem } from '@/common/interfaces';
import styles from './cart-list.module.css';
import Image from 'next/image';
import { env } from '@/common/config';
import { deleteProductFromUserCart } from '@/services/cart-service';
import { toast } from 'sonner';
import useCartItemsStore from '@/stores/cart-item-store';
import Link from 'next/link';
import { PATH } from '@/common/enums';

function Cart({ cartItem }: { cartItem: CartItem }) {
  const { product } = cartItem;
  const deleteCartItem = useCartItemsStore((state) => state.deleteCartItem);

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

  return (
    <tr className={styles.cartItem}>
      <td className={styles.image}>
        <Image src={imgUrl} alt={product.name} fill />
      </td>
      <td>{product.name}</td>
      <td>{cartItem.quantity}</td>
      <td>Còn {cartItem.product.stock} sản phẩm</td>
      <td>{product.price * cartItem.quantity}₫</td>
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
