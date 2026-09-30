import { useState } from 'react';

import { Pagination } from '@repo/ui';

export default function PaginationDemo() {
  const [page, setPage] = useState(5);

  return (
    <div className="space-y-3">
      <p>Page {page} of 20</p>
      <Pagination total={200} pageSize={10} page={page} onChange={setPage} />
    </div>
  );
}
