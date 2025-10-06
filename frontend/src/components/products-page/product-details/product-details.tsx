import { use } from 'react';
import styles from './product-detail.module.css';
import { getProduct } from '@/services/products-service';
import ProductGallery from './product-gallery';
import Link from 'next/link';
import { PATH } from '@/common/enums';
import RatingStars from '@/components/rating-stars/rating-stars';
import ProductDetailButtons from './product-detail-buttons';

type Props = { productId: string };

export default function ProductDetails({ productId }: Props) {
  const product = use(getProduct(productId));

  if (!product) return <div>Không tìm thấy sản phẩm</div>;

  const { media, sold, name, category, description, price, rating, stock } =
    product;

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href={PATH.HOME}>
          <p>Trang chủ</p>
          <span>{' > '}</span>
        </Link>
        <Link href={PATH.PRODUCTS}>
          <p>Sản phẩm</p>
          <span>{' > '}</span>
        </Link>
        {category && (
          <Link href={`${PATH.PRODUCTS}?categoryId=${category.id}`}>
            <p>{category.name}</p>
            <span>{' > '}</span>
          </Link>
        )}
        <p>{name}</p>
      </div>
      <div className={styles.product}>
        <ProductGallery media={media} name={name} />
        <div className={styles.details}>
          <h2>{name}</h2>

          <div className={styles.price}>
            <span>Giá:</span>
            <span>{price.toLocaleString()}</span>
            <span>VNĐ</span>
          </div>

          <div className={styles.rating}>
            <span>Đánh giá: {rating}/5</span>
            <RatingStars value={rating} className={styles.stars} readOnly />
          </div>

          <div className={styles.sold}>
            <span>Đã bán:</span>
            <span>{sold}</span>
          </div>

          <div className={styles.stock}>
            <span>Tình trạng:</span>
            <span>{stock > 0 ? `Còn ${stock} sản phẩm` : 'Hết hàng'}</span>
          </div>

          <ProductDetailButtons productId={productId} stock={stock} />
        </div>
      </div>
      <div className={styles.info}>
        <div className={styles.description}>
          <h3>Mô tả sản phẩm</h3>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}
