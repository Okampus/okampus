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
      className={clsx('rounded-xl p-5 aspect-square relative cursor-pointer hover:contrast-150', className)}
      variants={{
        rest: { scale: 0.97 },
        hover: { scale: 1 },
      }}
      style={{ backgroundColor: color }}
    >
      <div className="absolute bottom-[0.75rem] subtitle text-white pr-2">{name}</div>
      {image && (
        <motion.img
          src={image}
          alt=""
          className="rounded-full absolute top-[-1rem] right-[-1rem] w-20 h-20 shadow-lg"
          variants={{
            rest: { rotate: 10, scale: 0.8 },
            hover: { rotate: 0, scale: 1 },
          }}
        />
      )}
      <Link to={link} className="card-link z-20" />
    </motion.div>
  );
}
