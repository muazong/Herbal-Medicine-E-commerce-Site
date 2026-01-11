'use client';

import Link from 'next/link';

import { PATH } from '@/common/enums';
import styles from './sidebar.module.css';
import { Category } from '@/common/interfaces';
import { useSearchParams } from 'next/navigation';

function SidebarItem({ category }: { category: Category }) {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId');

  return (
    <li
      className={
        styles.item + (categoryId === category.id ? ` ${styles.active}` : '')
      }
    >
      <Link href={`${PATH.PRODUCTS}?categoryId=${category.id}`}>
        {category.name}
      </Link>
    </li>
  );
}

export default SidebarItem;
