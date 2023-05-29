import { bytes, formatDateDayOfWeek } from '@okampus/shared/utils';
import { FileIcon } from '@okampus/ui/atoms';

export type DocumentCardProps = {
  document: {
    // id: string;
    name: string;
    yearVersion: number | null;
    // description: string;
    url: string;
    type: string;
    size: number;
    createdAt: string;
    // createdBy: {
    //   name: string;
    //   avatar: string;
    // };
  };
  onClick?: () => void;
};

export function DocumentCard({ document, onClick }: DocumentCardProps) {
  return (
    <div
      onClick={onClick}
      className="rounded-lg bg-[#2B2932] hover:bg-[#38363E] pt-8 pb-5 px-6 flex flex-col gap-4 text-1"
    >
      <div className="flex flex-col justify-center items-center grow gap-4">
        <FileIcon className="h-12 aspect-square" file={document} />
        <div className="text-white font-bold text-lg">{document.name}</div>
      </div>
      <hr className="border-color-3" />
      <div className="flex justify-between gap-6">
        <div className="flex flex-col">
          <div className="text-2">Taille</div>
          <div className="whitespace-nowrap">{bytes(document.size)}</div>
        </div>
        <div className="flex flex-col">
          <div className="text-2">Créé</div>
          <div>{formatDateDayOfWeek(document.createdAt)}</div>
        </div>
      </div>
    </div>
  );
}
