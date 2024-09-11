import React from 'react';

export default function Spacer({ axis = 'y', size = 1 }: { axis?: 'x' | 'y'; size?: number }) {
  const style = {
    width: axis === 'x' ? `${size}px` : '100%', // Full width for vertical spacer
    height: axis === 'y' ? `${size}px` : '100%', // Full height for horizontal spacer
  };

  return <div style={style} />;
}
