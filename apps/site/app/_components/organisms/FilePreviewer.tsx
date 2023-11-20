'use client';

import FileIcon from '../atoms/Icon/FileIcon';
import { checkImage, checkPdf, toDataUri, toText } from '@okampus/shared/utils';

import { ArrowLeft } from '@phosphor-icons/react/dist/ssr';

import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import { motion } from 'framer-motion';
import Image from 'next/image';

import type { ExternalFile } from '@okampus/shared/types';

export type FilePreviewerProps = { file: File | ExternalFile; onClose: () => void };

export default function FilePreviewer({ file, onClose }: FilePreviewerProps) {
  const [preview, setPreview] = useState<React.JSX.Element | null>(null);
  const [numPages, setNumPages] = useState(0);
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
          {Array.from({ length: numPages }).map((_, idx) => (
            <Page pageNumber={idx + 1} key={idx} />
          ))}
        </Document>,
      );
    }

    firstUpdate.current = false;
  }, [fileSrc, numPages]);

  const filePreviewClassName = 'shadow-2xl rounded-lg overflow-hidden h-fit';
  useEffect(() => {
    async function filePreview() {
      const checkPayload = { mimetype: file.type ?? '', name: file.name };

      if (checkImage(checkPayload)) {
        if (file instanceof File) {
          return setPreview(
            <Image
              className={clsx(filePreviewClassName, 'h-auto w-auto max-h-full')}
              onClick={(e) => e.stopPropagation()}
              src={URL.createObjectURL(file)}
              alt={file.name}
            />,
          );
        }

        return setPreview(
          <Image
            className={clsx(filePreviewClassName, 'h-auto w-auto max-h-full')}
            onClick={(e) => e.stopPropagation()}
            src={file.url}
            alt={file.name ?? ''}
          />,
        );
      } else if (checkPdf(checkPayload)) {
        const data = file instanceof File ? await toDataUri(file) : file.url;
        setFileSrc(data);

        return setPreview(
          // <embed src={data?.toString()} type="application/pdf" width="100%" height="100%" />
          <Document
            file={data}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            renderMode={'svg'}
            className="flex flex-col gap-6"
          />,
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
        </div>,
      );
    }
    filePreview();
  }, [file]);

  return (
    <motion.div
      className="absolute top-0 left-0 flex flex-col w-screen h-screen bg-[#0009]"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="p-6 flex gap-6 text-white font-semibold items-center bg-gradient-to-b from-[#000000ee] to-transparent z-10"
      >
        <ArrowLeft onClick={onClose} className="cursor-pointer " height="30" />
        <FileIcon className="h-12 aspect-square" type={file.type} name={file.name} />
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
