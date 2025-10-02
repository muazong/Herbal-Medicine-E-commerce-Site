import Link from 'next/link';

type ButtonProps = {
  text: string;
  type: 'link' | 'button';
  href?: string;
  styles?: string;
  className?: string;
};

function Button({ text, type, className, href = '' }: ButtonProps) {
  if (type === 'link') {
    return (
      <Link href={href} className={className}>
        {text}
      </Link>
    );
  }

  if (type === 'button') {
    return <button className={className}>{text}</button>;
  }
}

export default Button;
