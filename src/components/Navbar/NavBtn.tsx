import React from 'react';

export default function NavBtn({ children, func }: { children: any; func?: any }) {
  return (
    <button
      onClick={func}
      className="border-2 border-white rounded-full w-10 h-10 flex items-center justify-center"
    >
      {children}
    </button>
  );
}
