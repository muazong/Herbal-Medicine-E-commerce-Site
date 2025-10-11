'use client';

import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CiCircleMinus } from 'react-icons/ci';
import { IoIosAddCircleOutline } from 'react-icons/io';

import { PATH } from '@/common/enums';
import styles from './product-detail.module.css';
import useCartItemsStore from '@/stores/cart-item-store';
import { addProductToCart } from '@/services/cart-service';

function ProductDetailButtons({
  stock,
  productId,
}: {
  stock: number;
  productId: string;
}) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const addCartItem = useCartItemsStore((state) => state.addCartItem);

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    if (type === 'increase') {
      if (quantity >= stock) return;
      setQuantity(quantity + 1);
    } else {
      if (quantity <= 1) return;
      setQuantity(quantity - 1);
    }
  };
  const handleAddToCart = async () => {
    const res = await addProductToCart(productId, quantity);

    if (res.message === 'Out of stock') {
      toast.warning('Đã thêm đến giới hạn!');
    } else {
      addCartItem(res.cartItem, quantity);
      toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ`);
    }
  };
  const handleBuy = () => {
    handleAddToCart();
    router.push(PATH.CART);
  };

  return (
    <div className={styles.actions}>
      <div className={styles.quantityWrapper}>
        <p>Số lượng: </p>
        <div className={styles.quantity}>
          <IoIosAddCircleOutline
            className={styles.icon}
            onClick={() => handleQuantityChange('increase')}
          />
          <p>{quantity}</p>
          <CiCircleMinus
            className={styles.icon}
            onClick={() => handleQuantityChange('decrease')}
          />
        </div>
      </div>
      <div className={styles.buttons}>
        <button className={styles.buy} onClick={handleBuy}>
          Mua
        </button>
        <button className={styles.cart} onClick={handleAddToCart}>
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}

export default ProductDetailButtons;
