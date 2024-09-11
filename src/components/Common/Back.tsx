import { useRouter } from 'next/router';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/localization';

interface BackProps {
  route?: string;
}

export default function Back({ route }: BackProps) {
  const { t, currentLanguage } = useTranslation();
  const router = useRouter();

  // Handle back navigation
  const handleBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!route) {
      e.preventDefault(); // Prevent link navigation if no route is provided
      router.back(); // Use Next.js router to go back
    }
  };

  return (
    <Link href={route || '#'} onClick={handleBack} className="cursor-pointer flex items-center gap-3">
      {/* Render the appropriate icon based on the language */}
      {currentLanguage === 'ar' ? <ChevronRight /> : <ChevronLeft />}
      <span className="mt-1">{t('back')}</span>
    </Link>
  );
}
