import Link from 'next/link';
import { ReactNode } from 'react';

interface IconTextProps {
  children: ReactNode;
  link: string;
  color: string;
}

const IconText = ({ children, link, color }: IconTextProps) => {
  return (
    <Link
      href={link}
      className="flex items-center justify-center p-5 gap-5 w-full mx-auto hover:opacity-80"
    >
      <div
        className="flex items-center justify-left gap-2 w-full hover:opacity-80 focus:outline-none"
        style={{ color }}
      >
        {children}
      </div>
    </Link>
  );
};

export default IconText;
