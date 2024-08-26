export const validateLang = (lang: string) => {
  if (lang === 'ar') return true;
  else return false;
};

export const validateDirection = (lang: string) => {
  if (lang === 'ar') return 'topRight';
  else return 'topLeft';
};
