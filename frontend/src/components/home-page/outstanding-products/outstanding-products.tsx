import { use } from 'react';

import Title from '@/components/title/title';
import Products from '@/components/products/products';
import { getProducts } from '@/services/products-service';

function OutstandingProducts() {
  const products = use(getProducts(8, 1, 'sold'));

  if (!products) {
    return <p>Đang tải...</p>;
  }

  return (
    <>
      <Title text="sản phẩm nổi bật" />
      <Products products={products} />
    </>
  );
}

export default OutstandingProducts;
