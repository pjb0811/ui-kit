import { useState } from 'react';

// Pausing on hover alone leaves keyboard users with no way to stop the
// marquee, so focus/blur (which bubble from any interactive child) pause it
// the same way hover does.
const usePauseOnHover = (enabled: boolean) => {
  const [pause, setPause] = useState(false);

  const hoverEvents = enabled
    ? {
        onMouseEnter: () => {
          setPause(true);
        },
        onMouseLeave: () => {
          setPause(false);
        },
        onFocus: () => {
          setPause(true);
        },
        onBlur: () => {
          setPause(false);
        },
      }
    : {};

  return { pause, hoverEvents };
};

export default usePauseOnHover;
