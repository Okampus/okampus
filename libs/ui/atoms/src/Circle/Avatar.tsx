export type AvatarProps = {
  src?: string;
  name?: string;
  size?: number;
  rounded?: number;
};

export function Avatar({ src, name, size = 14, rounded = 50 }: AvatarProps) {
  return (
    <div
      className="flex items-center overflow-hidden shrink-0"
      style={{
        width: `${size / 6}rem`,
        height: `${size / 6}rem`,
        borderRadius: `${rounded}%`,
        fontSize: `${size / 14}rem`,
      }}
    >
      {src ? (
        <img src={src} alt={`${name}`} />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gray-600">
          <span className="font-medium text-gray-300">{name?.[0] ?? '?'}</span>
        </div>
      )}
    </div>
  );
}