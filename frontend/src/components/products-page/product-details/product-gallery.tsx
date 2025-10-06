'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './product-detail.module.css';
import { env } from '@/common/config';
import { Media } from '@/common/interfaces';

type ProductGalleryProps = {
  media: Media[];
  name: string;
};

export default function ProductGallery({ media, name }: ProductGalleryProps) {
  const [mainImage, setMainImage] = useState(
    media && media.length > 0
      ? `${env.SERVER_URL}${media[0].path}`
      : env.PRODUCT_URL,
  );

  return (
    <div className={styles.images}>
      <div className={styles.mainImage}>
        <Image
          src={mainImage}
          alt={name}
          width={500}
          height={500}
          className={styles.image}
          priority
        />
      </div>

      <div className={styles.thumbnails}>
        {media && media.length > 0 ? (
          media.map((img) => {
            const imageUrl = `${env.SERVER_URL}${img.path}`;
            return (
              <div
                key={img.id}
                className={`${styles.thumb} ${
                  mainImage === imageUrl ? styles.active : ''
                }`}
                onClick={() => setMainImage(imageUrl)}
              >
                <Image
                  src={imageUrl}
                  alt={`thumb-${img.id}`}
                  width={80}
                  height={80}
                  className={styles.thumbImg}
                />
              </div>
            );
          })
        ) : (
          <div className={styles.noThumb}>Không có ảnh khác</div>
        )}
      </div>
    </div>
  );
}
