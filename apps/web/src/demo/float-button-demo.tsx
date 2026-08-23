import { Settings } from 'lucide-react';

import { FloatButton, Typography } from '@repo/ui';

// FloatButton is `fixed`-positioned by design (it floats over the whole
// viewport in real use). For this scoped demo, `className="absolute"`
// overrides that so it stays contained inside this box instead of
// escaping over the rest of the docs page.
export default function FloatButtonDemo() {
  return (
    <div
      className="border-border bg-muted/30 relative h-56 w-full overflow-hidden
        rounded-md border"
    >
      <Typography.Text
        className="text-muted-foreground absolute top-3 left-3 text-sm"
      >
        Scoped preview — normally fixed to the viewport corner
      </Typography.Text>
      <FloatButton
        icon={<Settings />}
        aria-label="Settings"
        className="absolute right-5 bottom-5"
      />
    </div>
  );
}
