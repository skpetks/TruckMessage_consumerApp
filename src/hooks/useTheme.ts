import { useAppSelector } from '../store/hooks';

export const useTheme = () => {
  const { isDark, theme } = useAppSelector(state => state.theme);

  return {
    isDark,
    theme,
  };
};
