import { useTranslation } from '@/localization/index';
import Navbar from '@/components/Navbar/Navbar';

export default function OverlayLayout({ children }: { children: any }) {
  const { currentLanguage } = useTranslation();

  return (
    <>
      <div dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'} className="relative z-20">
        <main className="relative max-w-7xl mx-auto lg:p-5 p-3">{children}</main>
      </div>
    </>
  );
}
