'use client';

import Image from 'next/image';
import { toast } from 'sonner';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { PATH } from '@/common/enums';
import { env } from '@/common/config';
import styles from './page.module.css';
import { notoSerif } from '@/common/fonts';
import { useUserStore } from '@/stores/user-store';
import useCartItemsStore from '@/stores/cart-item-store';
import { orderProducts } from '@/services/order-service';

function OrderPage() {
  const router = useRouter();
  const cartItems = useCartItemsStore((state) => state.cartItems);
  const orderedItems = cartItems.filter((item) => item.isOrdered);
  const deleteCartItem = useCartItemsStore((state) => state.deleteCartItem);
  const user = useUserStore((state) => state.user);

  const totalPrice = useMemo(
    () =>
      orderedItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      ),
    [orderedItems],
  );

  if (!user) {
    return router.push(PATH.LOGIN);
  }

  const handleOrderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await orderProducts();

    if (res) {
      toast.success('Đặt hàng thành công!');

      for (const item of orderedItems) {
        deleteCartItem(item);
      }

      router.push(PATH.ORDERED);
    } else {
      toast.error('Đặt hàng thất bại!');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={`${styles.title} ${notoSerif.className}`}>Đặt hàng</h1>

      <div className={styles.orderSection}>
        <div className={styles.productList}>
          <h2>Sản phẩm đã chọn</h2>

          {orderedItems.length === 0 ? (
            <p>Không có sản phẩm nào được chọn để đặt hàng.</p>
          ) : (
            orderedItems.map((item) => (
              <div key={item.id} className={styles.productCard}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={
                      item.product.media.length > 0
                        ? `${env.SERVER_URL}${item.product.media[0].path}`
                        : env.PRODUCT_URL
                    }
                    alt={item.product.name}
                    fill
                    className={styles.image}
                  />
                </div>
                <div className={styles.productInfo}>
                  <h3>{item.product.name}</h3>
                  <p>{item.product.description}</p>
                  <div className={styles.priceRow}>
                    <span>
                      {item.quantity} ×{' '}
                      {item.product.price.toLocaleString('vi-VN')}₫
                    </span>
                    <strong>
                      {(item.product.price * item.quantity).toLocaleString(
                        'vi-VN',
                      )}
                      ₫
                    </strong>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <form className={styles.form} onSubmit={handleOrderSubmit}>
          <h2>Thông tin giao hàng</h2>
          <label>
            Họ và tên:
            <input
              defaultValue={user.fullName}
              type="text"
              name="fullName"
              required
            />
          </label>
          <label>
            Số điện thoại:
            <input defaultValue={user.phone} type="tel" name="phone" required />
          </label>
          <label>
            Địa chỉ giao hàng:
            <textarea
              defaultValue={user.address}
              name="address"
              rows={3}
              required
            />
          </label>

          <div className={styles.total}>
            <span>Tổng tiền:</span>
            <strong>{totalPrice.toLocaleString('vi-VN')}₫</strong>
          </div>

          <button type="submit" className={styles.submitButton}>
            Xác nhận đặt hàng
          </button>
        </form>
      </div>
    </div>
  );
}

export default OrderPage;
