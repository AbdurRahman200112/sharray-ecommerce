import { Languages } from 'lucide-react';
import { useTranslation } from '../../localization/index';

interface LangSwitcherProps {
  textColor: string;
}

const LangSwitcher = ({ textColor }: LangSwitcherProps) => {
  const { changeLanguage, currentLanguage } = useTranslation();

  const handleSwitchLanguage = () => {
    const nextLanguage = currentLanguage === 'ar' ? 'en' : 'ar';
    changeLanguage(nextLanguage);
  };

  return (
    <div className="flex items-center justify-center p-5 gap-5 w-full mx-auto">
      <button
        onClick={handleSwitchLanguage}
        className="flex items-center justify-left gap-2 w-full"
        style={{ color: textColor }}
      >
        <Languages strokeWidth={1.5} size={18} />
        {currentLanguage === 'ar' ? 'English' : 'العربية'}
      </button>
    </div>
  );
};

export default LangSwitcher;
