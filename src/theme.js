export const COLORS = {
  primary: '#1A6B3C',
  primaryLight: '#E8F5EE',
  primaryDark: '#0F4226',
  secondary: '#F5A623',
  secondaryLight: '#FEF3DC',
  danger: '#D0021B',
  dangerLight: '#FDECEA',
  warning: '#F5A623',
  warningLight: '#FEF3DC',
  success: '#1A6B3C',
  successLight: '#E8F5EE',
  info: '#2D6DB5',
  infoLight: '#E8F0FB',
  gray50: '#F8F9FA',
  gray100: '#F1F3F5',
  gray200: '#E9ECEF',
  gray300: '#DEE2E6',
  gray400: '#CED4DA',
  gray500: '#ADB5BD',
  gray600: '#6C757D',
  gray700: '#495057',
  gray800: '#343A40',
  gray900: '#212529',
  white: '#FFFFFF',
  black: '#000000',
};

export const CATEGORIAS = {
  buraco: {
    label: 'Buraco / Pavimento',
    icon: 'construct',
    color: '#D0021B',
    bg: '#FDECEA',
  },
  iluminacao: {
    label: 'Iluminação Pública',
    icon: 'bulb',
    color: '#F5A623',
    bg: '#FEF3DC',
  },
  dengue: {
    label: 'Foco de Dengue',
    icon: 'bug',
    color: '#7B2D8B',
    bg: '#F3E8F9',
  },
  saneamento: {
    label: 'Saneamento / Esgoto',
    icon: 'water',
    color: '#1565C0',
    bg: '#E3F2FD',
  },
  calcada: {
    label: 'Calçada Danificada',
    icon: 'footsteps',
    color: '#795548',
    bg: '#EFEBE9',
  },
  lixo: {
    label: 'Descarte Irregular',
    icon: 'trash',
    color: '#37474F',
    bg: '#ECEFF1',
  },
  outros: {
    label: 'Outros',
    icon: 'alert-circle',
    color: '#546E7A',
    bg: '#ECEFF1',
  },
};

export const STATUS = {
  aberto: {
    label: 'Aberto',
    color: '#D0021B',
    bg: '#FDECEA',
    icon: 'alert-circle',
  },
  em_andamento: {
    label: 'Em Andamento',
    color: '#F5A623',
    bg: '#FEF3DC',
    icon: 'time',
  },
  resolvido: {
    label: 'Resolvido',
    color: '#1A6B3C',
    bg: '#E8F5EE',
    icon: 'checkmark-circle',
  },
};

export const FONTS = {
  regular: { fontWeight: '400' },
  medium: { fontWeight: '500' },
  semibold: { fontWeight: '600' },
  bold: { fontWeight: '700' },
};

export const SHADOW = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
};
