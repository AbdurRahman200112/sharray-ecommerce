import { selectBusiness } from '@/redux/reducers/businessSlice';
import { useSelector } from 'react-redux';

export const LoaderWhite = () => {
  const bs = useSelector(selectBusiness);
  
  return (
    <div className="w-full flex items-center justify-center">
      <span className="loader"></span>
      
      {/* Scoped styles for the loader */}
      <style jsx>{`
        .loader {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          position: relative;
          animation: rotate 1s linear infinite;
        }

        .loader::before {
          content: '';
          box-sizing: border-box;
          position: absolute;
          inset: 0px;
          border-radius: 50%;
          border: 5px solid white; /* Hard-coded white color */
          animation: prixClipFix 2s linear infinite;
        }

        @keyframes rotate {
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes prixClipFix {
          0% {
            clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0);
          }
          25% {
            clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0);
          }
          50% {
            clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%);
          }
          75% {
            clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%);
          }
          100% {
            clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 0);
          }
        }
      `}</style>
    </div>
  );
};
