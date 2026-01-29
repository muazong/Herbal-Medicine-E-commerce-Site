import styles from './stat-card.module.css';

export interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  suffix?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, suffix }) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.icon}>{icon}</span>
        <span>{title}</span>
      </div>

      <div className={styles.value}>
        {value.toLocaleString()}
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>
    </div>
  );
};

export default StatCard;
