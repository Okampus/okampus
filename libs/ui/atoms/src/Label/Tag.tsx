export type TagItem = {
  label: string;
  backgroundColor?: string;
  slug?: string;
};

// TODO: add slug for linking to Tag page
export function Tag({ label, backgroundColor }: TagItem) {
  return (
    <div className="py-0.5 px-2.5 rounded-full w-fit text-sm contrast-125 bg-white text-black flex gap-2 items-center">
      {backgroundColor && <div className="w-2 h-2" style={{ backgroundColor }} />}
      <span>{label}</span>
    </div>
  );
}
