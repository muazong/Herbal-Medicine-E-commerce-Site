'use client';

import { useEffect } from 'react';

import EditForm from './edit-form';
import CreateForm from './create-form';
import { getCategories } from '@/services/categories-service';
import { useCategoryStore } from '@/stores/category-store';

function DashboardProductForm({
  type = 'create',
  productId,
}: {
  type: 'create' | 'edit';
  productId?: string;
}) {
  const categories = useCategoryStore((state) => state.categories);
  const setCategories = useCategoryStore((state) => state.setCategories);

  useEffect(() => {
    (async () => {
      const categories = await getCategories();
      setCategories(categories || []);
    })();
  }, [setCategories]);

  if (type === 'create' || !productId) {
    return <CreateForm categories={categories} />;
  } else {
    return <EditForm productId={productId} categories={categories} />;
  }
}

export default DashboardProductForm;
