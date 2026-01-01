import { useTranslation } from 'react-i18next';

/**
 * Custom hook for accessing translations
 * Usage: const { t } = useTranslate();
 *        Then use: t('common.save')
 */
export const useTranslate = () => {
  const { t, i18n } = useTranslation();
  return { t, i18n };
};

export default useTranslate;
