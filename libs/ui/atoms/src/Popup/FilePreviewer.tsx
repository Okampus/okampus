import { FileIcon } from '../Icon/FileIcon';

import { ReactComponent as ArrowLeftIcon } from '@okampus/assets/svg/icons/arrow-left.svg';
import { checkImage, checkPdf, toBase64, toText } from '@okampus/shared/utils';

import clsx from 'clsx';

import { Document, Page } from 'react-pdf/dist/esm/entry.vite';
import { useEffect, useRef, useState } from 'react';

import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import { motion } from 'framer-motion';
import type { FileLike } from '@okampus/shared/types';

export type FilePreviewerProps = {
  file: FileLike;
  onClose: () => void;
};

export function FilePreviewer({ file, onClose }: FilePreviewerProps) {
  const [preview, setPreview] = useState<JSX.Element | null>(null);
  const [numPages, setNumPages] = useState(0);
  // const [pageNumber, setPageNumber] = useState(1);

  const [fileSrc, setFileSrc] = useState<string | ArrayBuffer | null>(null);

  const firstUpdate = useRef(true);
  useEffect(() => {
    if (!firstUpdate.current) {
      return setPreview(
        <Document
          file={fileSrc}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          renderMode={'svg'}
          className="flex flex-col gap-6"
        >
          {Array.from({ length: numPages }).map((_, page) => (
            <Page pageNumber={page + 1} key={page} />
          ))}
        </Document>
      );
    }

    firstUpdate.current = false;
  }, [numPages]);

  const filePreviewClassName = 'shadow-2xl rounded-lg overflow-hidden h-fit';
  useEffect(() => {
    async function filePreview() {
      if (checkImage(file)) {
        if (file instanceof File) {
          return setPreview(
            <img
              className={clsx(filePreviewClassName, 'h-auto w-auto max-h-full')}
              onClick={(e) => e.stopPropagation()}
              src={URL.createObjectURL(file)}
              alt={file.name}
            />
          );
        }

        return setPreview(
          <img
            className={clsx(filePreviewClassName, 'h-auto w-auto max-h-full')}
            onClick={(e) => e.stopPropagation()}
            src={file.src}
            alt={file.name}
          />
        );
      } else if (checkPdf(file)) {
        const data = file instanceof File ? await toBase64(file) : file.src;
        setFileSrc(data);

        return setPreview(
          <Document
            file={data}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            renderMode={'svg'}
            className="flex flex-col gap-6"
          />
        );
      } // TODO: add more file types

      if (file instanceof File) {
        const text = await toText(file);
        if (text && typeof text === 'string')
          return setPreview(<pre className="bg-white p-4 rounded-lg h-fit">{text}</pre>);
      }

      return setPreview(
        <div className="flex flex-col gap-4 items-center justify-center bg-white text-black h-fit rounded-lg p-5">
          <div className="text-2xl">Prévisualisation</div>
          <div className="text-lg">Aucune prévisualisation possible</div>
        </div>
      );
    }
    filePreview();
  }, [file]);

  return (
    <motion.div
      className="absolute top-0 left-0 flex flex-col w-screen h-screen"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="p-6 flex gap-6 text-white font-semibold items-center bg-gradient-to-b from-[#000000ee] to-transparent z-10"
      >
        <ArrowLeftIcon onClick={onClose} className="cursor-pointer " height="30" />
        <FileIcon className="h-12 aspect-square" file={file} />
        <div>{file.name}</div>
      </div>
      <div className="absolute flex justify-center h-full w-full pt-12 pb-8 overflow-scroll scrollbar">
        <div className="h-fit" onClick={(e) => e.stopPropagation()}>
          {preview}
        </div>
      </div>
      {/* <div className="absolute bottom-10 w-full flex justify-center" onClick={(e) => e.stopPropagation()}>
        {numPages > 0 && (
          <div className="flex items-center gap-4 rounded-lg bg-black p-2 w-fit">
            <button
              className="bg-white text-black rounded-full p-1 w-8"
              onClick={(e) => {
                setPageNumber((prev) => (prev === 1 ? prev : prev - 1));
                e.stopPropagation();
              }}
            >
              <ChevronLeft />
            </button>
            <div className="text-white">
              {pageNumber} / {numPages}
            </div>
            <button
              className="bg-white text-black rounded-full p-1 w-8"
              onClick={(e) => {
                setPageNumber((prev) => (prev === numPages ? prev : prev + 1));
                e.stopPropagation();
              }}
            >
              <ChevronRight />
            </button>
          </div>
        )}
      </div> */}
    </motion.div>
  );
}
