import { Star } from 'lucide-react';

interface RenderStarsProps {
    rating: number;
    setRating: React.Dispatch<React.SetStateAction<number>>
}
export const RenderStars: React.FC<RenderStarsProps> = ({ rating, setRating } ) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star 
        key={index} 
        onClick={() => setRating(index + 1)}
        className={`w-8 h-8 cursor-pointer ${index < rating ? 'text-yellow-500' : 'text-gray-300'}`}
        fill={index < rating ? 'currentColor' : 'none'}
        stroke="currentColor"
      />
    ));
  };

const RenderedStars = ({rating}: {rating: number}) => {
    return Array.from({ length: 5 }, (_, index) => (
        <Star
            key={index}
            className={`h-5 w-5 ${index < (Number(rating)) ? 'text-yellow-500' : 'text-gray-300'}`}
            fill={index < (Number(rating)) ? 'currentColor' : 'none'}
        />
    ));
}
export default RenderedStars