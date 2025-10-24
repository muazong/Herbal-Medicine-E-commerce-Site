import Link from 'next/link';
import styles from './dashboard-breadcrumb.module.css';

function DashboardBreadcrumb({
  parenTitle,
  parentHref,
  childTitle,
}: {
  parenTitle: string;
  parentHref: string;
  childTitle: string;
}) {
  return (
    <div className={styles.breadcrumb}>
      <Link href={parentHref}>{parenTitle}</Link>
      <span> \ </span>
      <p>{childTitle}</p>
    </div>
  );
}

export default DashboardBreadcrumb;
