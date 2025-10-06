'use client';

import { IoIosAddCircleOutline } from 'react-icons/io';
import { CiCircleMinus } from 'react-icons/ci';

import styles from './product-detail.module.css';
import { useState } from 'react';
import { addProductToCart } from '@/services/cart-service';
import { toast } from 'sonner';

function ProductDetailButtons({
  stock,
  productId,
}: {
  stock: number;
  productId: string;
}) {
  const [quantity, setQuantity] = useState(1);

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
    } else toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ`);
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
        <button className="buy">Mua ngay</button>
        <button className="cart" onClick={handleAddToCart}>
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}

export default ProductDetailButtons;
