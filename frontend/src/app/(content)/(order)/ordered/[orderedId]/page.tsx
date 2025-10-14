import { OrderedDetail } from '@/components/ordered-page';
import styles from './page.module.css';

async function OrderedItem({
  params,
}: {
  params: Promise<{ orderedId: string }>;
}) {
  const orderId = (await params).orderedId;
  return (
    <div className={styles.container}>
      <OrderedDetail orderId={orderId} />
    </div>
  );
}

export default OrderedItem;
