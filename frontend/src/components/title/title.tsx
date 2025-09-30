import styles from './title.module.css';

type TitleProps = {
  text: string;
};

function Title({ text }: TitleProps) {
  return (
    <div className={styles.title}>
      <h1>{text}</h1>
      <hr />
    </div>
  );
}

export default Title;
