import styles from './dashboard-title.module.css';

type DashboardTitleProps = {
  title: string;
};

function DashboardTitle({ title }: DashboardTitleProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>
    </div>
  );
}

export default DashboardTitle;
