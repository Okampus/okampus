import clsx from 'clsx';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export type CategoryCardProps = {
  link: string;
  name: string;
  color: string;
  image?: string;
  className?: string;
};

export function CategoryCard({ link, name, color, image, className }: CategoryCardProps) {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      className={clsx(
        'card-sm min-w-[12rem] aspect-square p-3 relative overflow-hidden cursor-pointer contrast-125',
        className
      )}
      style={{ backgroundColor: color }}
    >
      <div className="font-semibold text-white text-2xl">{name}</div>
      {image && (
        <motion.img
          src={image}
          alt=""
          className="rounded-lg absolute right-0 bottom-0 shadow w-24 h-24"
          initial={{ translateX: '18%', translateY: '20%', rotate: 25, scale: 0.7 }}
          variants={{
            rest: { translateX: '18%', right: 0, translateY: '20%', rotate: 25, scale: 0.7 },
            hover: { translateX: '50%', right: '50%', translateY: '-20%', rotate: 0, scale: 1 },
          }}
        />
      )}
      <Link to={link} className="card-link z-20" />
    </motion.div>
  );
}
