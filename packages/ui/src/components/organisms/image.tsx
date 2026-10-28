'use client';

import {
  type CSSProperties,
  type ComponentProps,
  type ReactNode,
  type Ref,
  type SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useControllableState } from '@jbpark/use-hooks';
import { ImageOff } from 'lucide-react';

import { DEFAULT_LOCALE, useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import Button from '../atoms/button';
import Modal from './modal';

type Status = 'loading' | 'loaded' | 'error';

// A numeric `width`/`height` attribute as pixels, so the fallback keeps the
// size the image would have had.
const toPixels = (value: number | string | undefined) => {
  const pixels = Number(value);

  return value !== undefined && Number.isFinite(pixels) && pixels > 0
    ? pixels
    : undefined;
};

export interface PreviewOptions {
  /** A larger source for the viewer. Defaults to `src`. */
  src?: string;
  /** Viewer title. Defaults to `alt`, or to `label` for a decorative image. */
  title?: ReactNode;
  /**
   * Accessible name of the control that opens the viewer. Defaults to the
   * `preview` locale string followed by `alt`. A decorative image (`alt=""`)
   * gets a preview control only when this is set.
   */
  label?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface Props extends Omit<
  ComponentProps<'img'>,
  'src' | 'alt' | 'placeholder' | 'children' | 'className' | 'style' | 'ref'
> {
  src: string;
  /** Describes the image. Use an empty string for a decorative image. */
  alt: string;
  /** Shown over the image area while it loads. Give the image a size so it has room. */
  placeholder?: ReactNode;
  /**
   * Shown instead of the image when it fails to load. Defaults to an icon. It
   * takes the numeric `width` and `height` given to the image.
   */
  fallback?: ReactNode;
  /** Opens the image in a viewer. Off by default. */
  preview?: boolean | PreviewOptions;
  /** Applied to the root element, like `style` and `ref`. Use `classNames.image` for the `<img>`. */
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLSpanElement>;
  classNames?: {
    image?: string;
    placeholder?: string;
    fallback?: string;
    trigger?: string;
    preview?: string;
  };
}

const Image = ({
  src,
  alt,
  placeholder,
  fallback,
  preview = false,
  className,
  style,
  ref,
  classNames,
  onLoad,
  onError,
  ...props
}: Props) => {
  const { locale } = useConfig();

  const previewOptions = typeof preview === 'object' ? preview : {};
  const [isOpen, setIsOpen] = useControllableState<boolean>({
    value: previewOptions.open,
    defaultValue: previewOptions.defaultOpen ?? false,
    onChange: previewOptions.onOpenChange,
  });
  // The status belongs to the source it was reported for, so a new `src`
  // starts out loading without an extra render.
  const [result, setResult] = useState<{ src: string; status: Status }>({
    src,
    status: 'loading',
  });
  const imageRef = useRef<HTMLImageElement>(null);

  const status = result.src === src ? result.status : 'loading';
  const previewLabel =
    previewOptions.label ??
    (alt ? `${locale.preview ?? DEFAULT_LOCALE.preview}: ${alt}` : undefined);
  const canPreview =
    preview !== false && status !== 'error' && previewLabel !== undefined;
  const hasPlaceholder = status === 'loading' && placeholder !== undefined;

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    setResult({ src, status: 'loaded' });
    onLoad?.(event);
  };

  const handleError = (event: SyntheticEvent<HTMLImageElement>) => {
    setResult({ src, status: 'error' });
    onError?.(event);
  };

  // A server-rendered image can finish before hydration attaches the event
  // handlers, so read its state once it is mounted.
  useEffect(() => {
    const image = imageRef.current;

    if (!image?.complete) {
      return;
    }

    setResult({
      src,
      status: image.naturalWidth > 0 ? 'loaded' : 'error',
    });
  }, [src]);

  return (
    <span
      ref={ref}
      data-slot="image"
      data-status={status}
      className={cn(
        'relative inline-block max-w-full align-middle',
        className,
        //
      )}
      style={style}
    >
      {status === 'error' ? (
        <span
          role={alt ? 'img' : undefined}
          aria-label={alt || undefined}
          aria-hidden={alt ? undefined : true}
          title={locale.loadFailed ?? DEFAULT_LOCALE.loadFailed}
          style={{
            width: toPixels(props.width),
            height: toPixels(props.height),
          }}
          className={cn(
            `flex size-full min-h-16 max-w-full min-w-16 items-center
              justify-center`,
            'rounded-md bg-muted text-muted-foreground',
            classNames?.fallback,
            //
          )}
        >
          {fallback ?? <ImageOff aria-hidden="true" className="size-6" />}
        </span>
      ) : (
        <img
          {...props}
          ref={imageRef}
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'block h-auto max-w-full',
            hasPlaceholder && 'invisible',
            classNames?.image,
            //
          )}
        />
      )}
      {hasPlaceholder && (
        <span
          aria-hidden="true"
          className={cn(
            'absolute inset-0 flex items-center justify-center',
            classNames?.placeholder,
            //
          )}
        >
          {placeholder}
        </span>
      )}
      {canPreview && (
        <>
          <Button
            type="text"
            aria-label={previewLabel}
            aria-haspopup="dialog"
            onClick={() => setIsOpen(true)}
            className={cn(
              'absolute inset-0 size-full rounded-none p-0',
              'cursor-zoom-in hover:bg-black/5',
              classNames?.trigger,
              //
            )}
          />
          <Modal
            open={isOpen}
            title={previewOptions.title ?? (alt || previewLabel)}
            closable
            maskClosable
            footer={null}
            onCancel={() => setIsOpen(false)}
            // Keeps a long title clear of the close button.
            classNames={{ header: 'pe-8' }}
            className={cn(
              'sm:max-w-[min(90vw,64rem)]',
              classNames?.preview,
              //
            )}
          >
            <img
              src={previewOptions.src ?? src}
              alt={alt}
              className="mx-auto block max-h-[80vh] max-w-full object-contain"
            />
          </Modal>
        </>
      )}
    </span>
  );
};

export default Image;
