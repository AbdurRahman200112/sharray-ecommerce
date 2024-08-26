import React from 'react';

export default function Spacer({ axis, size }: { axis: string; size: number }) {
  const axisDir = axis === 'x' ? 'x' : 'y';
  const styleProperties = `m${axisDir}-${size} w-full h-${size}`;
  return <div className={styleProperties}></div>;
}
