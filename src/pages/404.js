import * as notFound from '../lotties/404.json';
import Lottie from 'lottie-react';
import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="max-w-7xl mx-auto h-screen relative">
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="image-container lg:w-1/2">
          <Lottie animationData={notFound} autoPlay={true} height={250} width={250} />
        </div>
        <div className="text-center p-10 lg:p-0 lg:w-1/2 flex flex-col items-center justify-center gap-4">
          <h1 className="font-bold text-xl lg:text-3xl text-neutral-500">Oops! Page Not Found</h1>
          <p className="text-sm font-light text-neutral-500">
            We're sorry, but it seems like you've ventured off the beaten path. The page you're
            looking for might have been moved, deleted, or simply never existed. Don't worry, though
            - getting lost happens to the best of us. You can always return to our homepage and
            start fresh
          </p>
          <Link
            replace
            className="w-32 h-12 flex items-center justify-center font-light py-2 px-5 mt-5 rounded-full transition-all ease-linear shadow-lg hover:scale-110 bg-blue-500 hover:bg-blue-400 text-white text-sm"
            href={'/'}
          >
            Home Page
          </Link>
        </div>
        <h6 className="text-xs absolute bottom-0 text-neutral-500 my-10">
          All Rights Reserved © 2023 eSITE Information Technology
        </h6>
      </div>
    </div>
  );
}
