type AvatarProps = {
  src?: string;
  name?: string;
  size?: number;
};

export function Avatar({ src, name, size = 4 }: AvatarProps) {
  return (
    <div
      className="flex items-center overflow-hidden rounded-[50%]"
      style={{ width: `${size / 2}rem`, height: `${size / 2}rem` }}
    >
      {src ? (
        <img src={src} alt={`${name}`} />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gray-600">
          <span className="text-sm font-medium text-gray-300">{name?.[0] ?? '?'}</span>
        </div>
      )}
    </div>
  );
}
