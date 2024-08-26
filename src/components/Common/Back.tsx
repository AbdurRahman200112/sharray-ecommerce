import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/localization';

export default function Back({ route }: { route?: string }) {
  const { t, currentLanguage } = useTranslation();
  const link = route ? route : '/';
  return (
    <Link href={link} className="cursor-pointer flex items-center gap-3">
      {currentLanguage === 'ar' ? <ChevronRight /> : <ChevronLeft />}
      <span className="mt-1">{t('back')}</span>
    </Link>
  );
}
