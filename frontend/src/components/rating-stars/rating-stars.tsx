import { Rating } from '@smastrom/react-rating';

type RatingProps = {
  className?: string;
  value: number;
  readOnly?: boolean;
};

function RatingStars({ value, className, readOnly }: RatingProps) {
  return <Rating className={className} value={value} readOnly={readOnly} />;
}

export default RatingStars;
