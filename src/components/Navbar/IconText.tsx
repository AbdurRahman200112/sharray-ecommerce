import Link from 'next/link';

const IconText = ({ children, link, color }: { children: any; link: any; color: any }) => {
  return (
    <Link
      href={link}
      className="flex items-center justify-center p-5 gap-5 w-full mx-auto hover:opacity-80"
    >
      <div
        className="flex items-center justify-left gap-2 w-full hover:opacity-80 hover:outline-none focus:outline-none"
        style={{
          color: color,
        }}
      >
        {children}
      </div>
    </Link>
  );
};

export default IconText;
