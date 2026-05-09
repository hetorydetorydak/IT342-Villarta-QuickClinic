import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    primary: '#2563EB',
    primaryHover: '#1D4ED8',
    secondary: '#7C3AED',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    border: '#E2E8F0',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    sidebarBg: '#FFFFFF',
    sidebarActive: '#2563EB',
    sidebarActiveText: '#FFFFFF',
    sidebarText: '#374151',
  },
  fonts: {
    body: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    heading: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  radii: {
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '18px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.06)',
    md: '0 4px 12px rgba(0,0,0,0.08)',
    lg: '0 8px 24px rgba(0,0,0,0.10)',
  },
};

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.body};
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.textPrimary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.6;
  }

  a { 
    text-decoration: none; 
    color: inherit; 
  }
  
  button { 
    cursor: pointer; 
    font-family: inherit; 
  }
  
  input, select, textarea { 
    font-family: inherit; 
  }
`;

export default GlobalStyles;