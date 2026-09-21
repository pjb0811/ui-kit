import { Upload } from '@repo/ui';

export default function UploadDemo() {
  return (
    <div className="w-full max-w-80">
      <Upload accept="image/*" maxCount={3} />
    </div>
  );
}
