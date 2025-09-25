export default {
  // Primary Brand Colors
  primary: '#6B46C1',
  primaryDark: '#3902A1',
  primaryLight: '#8B5CF6',
  
  // Secondary Colors
  secondary: '#1E40AF',
  secondaryLight: '#3B82F6',
  
  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#dc2626',
  error: '#e74c3c',
  
  // Background Colors
  background: '#f5f6fa',
  backgroundLight: '#f2fbfb', 
  backgroundWhite: '#ffffff',
  backgroundGray: '#F9FAFB',
  backgroundLightGray: '#F3F4F6',
  backgroundCard: '#F5F0FF',
  
  // Text Colors
  text: '#2c3e50',
  textDark: '#000000',
  textLight: '#ffffff',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textGray: '#374151',
  textLightGray: '#666666',
  
  // Border Colors
  border: '#E5E7EB',
  borderLight: '#DEDEDE',
  borderGray: '#D1D5DB',
  
  // Icon Colors
  iconPrimary: '#6B46C1',
  iconSecondary: '#3902A1',
  iconSuccess: '#10B981',
  iconWarning: '#F59E0B',
  iconDanger: '#dc2626',
  iconGray: '#6B7280',
  
  // Shadow Colors
  shadow: '#000000',
  shadowLight: '#000000',
  
  // Badge Colors
  badgeSuccess: '#10B981',
  badgeWarning: '#F59E0B',
  badgeDanger: '#dc2626',
  badgeGray: '#6B7280',
  
  // Button Colors
  buttonPrimary: '#6B46C1',
  buttonSecondary: '#1E40AF',
  buttonSuccess: '#10B981',
  buttonDanger: '#dc2626',
  buttonDisabled: '#9CA3AF',
  buttonDetails: '#FEF3C7',
  
  // Card Colors
  cardBackground: '#ffffff',
  cardBorder: '#E5E7EB',
  
  // Input Colors
  inputBackground: '#F9FAFB',
  inputBorder: '#E5E7EB',
  inputFocusBorder: '#6B46C1',
  
  // Tab Colors
  tabActive: '#1E40AF',
  tabInactive: '#6B7280',
  tabBackground: '#ffffff',
  
  // Rating Colors
  rating: '#FFD700',
  
  // Legacy Colors
  containerBg: '#6B46C1',
  serviceCardBg: '#1E40AF',
};

  export const hexToRgba = (hex, alpha) => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex.slice(1, 3), 16);
      g = parseInt(hex.slice(3, 5), 16);
      b = parseInt(hex.slice(5, 7), 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };