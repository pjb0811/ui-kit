'use client';

import { useEffect, useId, useRef } from 'react';

import {
  useControllableState,
  useFileDrop,
  useFileToDataUrl,
} from '@jbpark/use-hooks';
import { Upload as UploadIcon, X } from 'lucide-react';

import { cn } from '@repo/ui/utils';

import { formatLocale, useLocale } from '../../providers/config';
import Button from '../atoms/button';

// Monotonic per-session counter used as a uniqueness tiebreaker for file
// uids. Guarantees a unique suffix even for the same file (identical
// name/lastModified/size) added twice, which name+lastModified+size alone
// can't. These uids are internal React keys, not cryptographic, so a plain
// counter is enough — and it avoids a runtime `uuid` dependency.
let uidCounter = 0;
const nextUid = () => (uidCounter += 1);

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
  /**
   * Called once per file that didn't make it in — either bumped by
   * `maxCount` or failed to read.
   */
  onReject?: (info: { file: File; reason: 'max-count' | 'read-error' }) => void;
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
  onReject,
}: Props) => {
  const inputId = useId();
  const localeText = useLocale();
  const readAsDataUrl = useFileToDataUrl();
  const [files, setFiles] = useControllableState<UploadFile[]>({
    value: _value,
    defaultValue,
    onChange: _onChange,
  });
  // Reads finish after the render that started them, so the list and the
  // `maxCount` budget come from refs, not from this render's `files`.
  const filesRef = useRef(files);
  // Files accepted by reads still in flight; they count against `maxCount`.
  const pendingCount = useRef(0);
  // Each batch commits after the batches added before it, so the list keeps
  // the order files were added in even when a later read finishes first.
  const commitQueue = useRef<Promise<void>>(Promise.resolve());

  const commitFiles = (next: UploadFile[]) => {
    // The effect below refreshes the ref only after the next commit, and
    // another batch can settle before that.
    filesRef.current = next;
    setFiles(next);
  };

  const addFiles = async (incoming: File[]) => {
    const remaining =
      typeof maxCount === 'number'
        ? Math.max(0, maxCount - filesRef.current.length - pendingCount.current)
        : incoming.length;

    const accepted = incoming.slice(0, remaining);
    const rejected = incoming.slice(remaining);

    rejected.forEach(file => onReject?.({ file, reason: 'max-count' }));

    if (accepted.length === 0) {
      return;
    }

    pendingCount.current += accepted.length;

    const reads = Promise.all(
      accepted.map(async file => {
        try {
          return {
            // `nextUid()` guarantees uniqueness even for the same file
            // added twice (identical name/lastModified/size), which
            // name+lastModified+size alone can't — a collision there
            // corrupted React's item keys and made removeFile's
            // uid-based filter delete both copies at once.
            uid: `${file.name}-${file.lastModified}-${file.size}-${nextUid()}`,
            name: file.name,
            url: await readAsDataUrl(file),
          };
        } catch {
          onReject?.({ file, reason: 'read-error' });
          return null;
        }
      }),
    );
    const commit = commitQueue.current.then(async () => {
      const uploaded = (await reads).filter(
        (file): file is UploadFile => file !== null,
      );

      pendingCount.current -= accepted.length;

      if (uploaded.length > 0) {
        commitFiles([...filesRef.current, ...uploaded]);
      }
    });

    commitQueue.current = commit;
    await commit;
  };

  const removeFile = (uid: string) => {
    commitFiles(filesRef.current.filter(file => file.uid !== uid));
  };

  // Runs after every commit, so a controlled `value` the caller kept
  // unchanged also resets the ref.
  useEffect(() => {
    filesRef.current = files;
  });

  const { dropRef, isDragging } = useFileDrop<HTMLLabelElement>({
    accept,
    multiple,
    disabled,
    onDrop: addFiles,
  });

  return (
    <div
      data-slot="upload"
      className={cn(
        'flex flex-col gap-3',
        className,
        //
      )}
    >
      <label
        ref={dropRef}
        htmlFor={inputId}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2',
          'rounded-md border border-dashed p-6 text-center',
          'text-sm text-muted-foreground',
          'transition-colors',
          `has-focus-visible:border-ring has-focus-visible:ring-[3px]
          has-focus-visible:ring-ring/50`,
          isDragging && 'border-primary bg-accent',
          disabled && 'pointer-events-none cursor-not-allowed opacity-50',
          classNames?.dropzone,
          //
        )}
      >
        <UploadIcon className="size-6" />
        <span>
          {multiple ? localeText.Upload.hintMultiple : localeText.Upload.hint}
        </span>
        <input
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          // `sr-only` keeps the input in the tab order, where it opens the
          // file dialog on Enter and Space; `display: none` would remove it.
          className="sr-only"
          onChange={e => {
            if (e.target.files?.length) {
              addFiles(Array.from(e.target.files));
            }
            e.target.value = '';
          }}
        />
      </label>

      {files.length > 0 && (
        <ul
          className={cn(
            'm-0 flex list-none flex-col gap-2 p-0',
            classNames?.list,
            //
          )}
        >
          {files.map(file => (
            <li
              key={file.uid}
              className={cn(
                // `m-0` completes the list reset the `ul` above starts — see
                // Radio.Group for the host rule this guards against.
                'm-0 flex items-center gap-2 rounded-md border p-2',
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
              <Button
                variant="text"
                shape="circle"
                size="small"
                icon={<X className="size-4" />}
                disabled={disabled}
                onClick={() => removeFile(file.uid)}
                className="shrink-0 text-muted-foreground hover:text-foreground"
                aria-label={formatLocale(localeText.Upload.remove, {
                  name: file.name,
                })}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Upload;
