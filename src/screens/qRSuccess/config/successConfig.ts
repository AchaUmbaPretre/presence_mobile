// screens/qr-success/config/successConfig.ts
import { COLORS } from '@/screens/dashboard/constants/color';

export interface SuccessConfig {
  primary: {
    main: string;
    light: string;
    dark: string;
  };
  secondary: {
    main: string;
    light: string;
    dark: string;
  };
  title: string;
  subtitle: string;
  gradientColors: [string, string, string]; // ✅ Type tuple explicite
}

export const getConfig = (typeScan: 'ENTREE' | 'SORTIE'): SuccessConfig => {
  const isEntry = typeScan === 'ENTREE';
  
  return {
    primary: {
      main: isEntry ? COLORS.success.main : COLORS.warning.main,
      light: isEntry ? COLORS.success.light : COLORS.warning.light,
      dark: isEntry ? COLORS.success.dark : COLORS.warning.dark,
    },
    secondary: {
      main: isEntry ? COLORS.success.light : COLORS.warning.light,
      light: isEntry ? COLORS.success.light : COLORS.warning.light,
      dark: isEntry ? COLORS.success.dark : COLORS.warning.dark,
    },
    title: isEntry ? 'Bienvenue !' : 'À bientôt !',
    subtitle: isEntry ? 'Pointage d\'entrée enregistré' : 'Pointage de sortie enregistré',
    gradientColors: isEntry
      ? [COLORS.success.main, COLORS.success.dark, '#1B5E20']
      : [COLORS.warning.main, COLORS.warning.dark, '#BF360C'],
  };
};