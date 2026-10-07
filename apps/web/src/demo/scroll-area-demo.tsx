import { ScrollArea } from '@repo/ui';

export default function ScrollAreaDemo() {
  return (
    <div className="flex flex-wrap gap-6">
      <ScrollArea
        label="Recent activity"
        className="h-56 w-64 rounded-lg border"
      >
        <ul className="space-y-2 p-3">
          {Array.from({ length: 20 }, (_, index) => (
            <li key={index} className="bg-muted rounded-sm p-2">
              Activity {index + 1}
            </li>
          ))}
        </ul>
      </ScrollArea>
      <ScrollArea
        orientation="both"
        label="Data grid"
        className="h-56 w-64 rounded-lg border"
      >
        <div className="grid w-[40rem] grid-cols-5 gap-2 p-3">
          {Array.from({ length: 40 }, (_, index) => (
            <div key={index} className="bg-muted rounded-sm p-3">
              Cell {index + 1}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
