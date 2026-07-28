'use client';

import { useId, useState } from 'react';

import { useFileToDataUrl } from '@jbpark/use-hooks';
import { Upload as UploadIcon, X } from 'lucide-react';

import { cn } from '@repo/ui/utils';

export interface UploadFile {
  uid: string;
  name: string;
  url: string;
}

export interface Props {
  defaultValue?: UploadFile[];
  value?: UploadFile[];
  multiple?: boolean;
  accept?: string;
  maxCount?: number;
  disabled?: boolean;
  className?: string;
  classNames?: {
    dropzone?: string;
    list?: string;
    item?: string;
  };
  onChange?: (files: UploadFile[]) => void;
}

const isImage = (file: UploadFile) =>
  /^data:image\//.test(file.url) ||
  /\.(png|jpe?g|gif|webp|svg)$/i.test(file.name);

const Upload = ({
  defaultValue = [],
  value: _value,
  multiple = true,
  accept = 'image/*',
  maxCount,
  disabled,
  className,
  classNames,
  onChange: _onChange = () => {},
}: Props) => {
  const inputId = useId();
  const readAsDataUrl = useFileToDataUrl();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] =
    useState<UploadFile[]>(defaultValue);

  const controlled = _value !== undefined;
  const files = controlled ? _value : uncontrolledValue;

  const onChange = (next: UploadFile[]) => {
    if (!controlled) {
      setUncontrolledValue(next);
    }
    _onChange(next);
  };

  const addFiles = async (fileList: FileList) => {
    const incoming = Array.from(fileList);
    const remaining =
      typeof maxCount === 'number'
        ? Math.max(0, maxCount - files.length)
        : incoming.length;

    const accepted = incoming.slice(0, remaining);

    const uploaded = await Promise.all(
      accepted.map(async file => ({
        uid: `${file.name}-${file.lastModified}-${file.size}`,
        name: file.name,
        url: await readAsDataUrl(file),
      })),
    );

    onChange([...files, ...uploaded]);
  };

  const removeFile = (uid: string) => {
    onChange(files.filter(file => file.uid !== uid));
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        className,
        //
      )}
    >
      <label
        htmlFor={inputId}
        onDragOver={e => {
          e.preventDefault();
          if (!disabled) {
            setIsDragOver(true);
          }
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={e => {
          e.preventDefault();
          setIsDragOver(false);

          if (disabled) {
            return;
          }

          if (e.dataTransfer.files.length) {
            addFiles(e.dataTransfer.files);
          }
        }}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2',
          'rounded-md border border-dashed p-6 text-center',
          'text-muted-foreground text-sm',
          'transition-colors',
          isDragOver && 'border-primary bg-accent',
          disabled && 'pointer-events-none cursor-not-allowed opacity-50',
          classNames?.dropzone,
          //
        )}
      >
        <UploadIcon className="size-6" />
        <span>Click or drag file{multiple ? 's' : ''} to upload</span>
        <input
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="hidden"
          onChange={e => {
            if (e.target.files?.length) {
              addFiles(e.target.files);
            }
            e.target.value = '';
          }}
        />
      </label>

      {files.length > 0 && (
        <ul
          className={cn(
            'flex flex-col gap-2',
            classNames?.list,
            //
          )}
        >
          {files.map(file => (
            <li
              key={file.uid}
              className={cn(
                'flex items-center gap-2 rounded-md border p-2',
                classNames?.item,
                //
              )}
            >
              {isImage(file) && (
                <img
                  src={file.url}
                  alt=""
                  className="size-10 shrink-0 rounded object-cover"
                />
              )}
              <span className="flex-1 truncate text-sm">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(file.uid)}
                className="text-muted-foreground hover:text-foreground shrink-0"
                aria-label={`Remove ${file.name}`}
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Upload;
