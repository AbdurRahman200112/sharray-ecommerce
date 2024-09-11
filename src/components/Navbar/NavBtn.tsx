import React, { ReactNode } from 'react';

interface NavBtnProps {
  children: ReactNode; // ReactNode is more flexible for handling various child elements
  func?: () => void; // Optional function type for the button's onClick event
}

export default function NavBtn({ children, func }: NavBtnProps) {
  return (
    <button
      onClick={func} // Optional onClick handler, works only if a function is provided
      className="border-2 border-white rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200 hover:scale-105"
    >
      {children}
    </button>
  );
}
