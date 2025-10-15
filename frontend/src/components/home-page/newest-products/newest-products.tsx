import { use } from 'react';

import Title from '@/components/title/title';
import Products from '@/components/products/products';
import { getProducts } from '@/services/products-service';

function NewestProducts() {
  const products = use(getProducts(8, 'createdAt'));

  if (!products) {
    return <p>Đang tải...</p>;
  }

  return (
    <>
      <Title text="sản phẩm mới nhất" />
      <Products products={products} />
    </>
  );
}

export default NewestProducts;
