import { motion } from 'framer-motion';

export type CategoryCardProps = {
  name: string;
  color: string;
  image?: string;
};

export function CategoryCard({ name, color, image }: CategoryCardProps) {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="rounded-lg min-w-[12rem] aspect-square p-3 relative overflow-hidden"
      style={{ backgroundColor: color }}
    >
      <h1 className="font-bold text-white text-2xl">{name}</h1>
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
    </motion.div>
  );
}
