import styles from './title.module.css';

type TitleProps = {
  text: string;
  className?: string;
};

function Title({ text, className }: TitleProps) {
  return (
    <div className={styles.title + ' ' + className}>
      <h1>{text}</h1>
      <hr />
    </div>
  );
}

export default Title;
