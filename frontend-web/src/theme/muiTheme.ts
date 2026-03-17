import { alpha, createTheme } from '@mui/material/styles';

const primaryMain = '#0D7A6D';
const secondaryMain = '#4B5E77';
const backgroundDefault = '#F5F7FA';
const backgroundPaper = '#FFFFFF';

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: primaryMain,
      light: '#2E9E8E',
      dark: '#075D53',
      contrastText: '#F7FFFD',
    },
    secondary: {
      main: secondaryMain,
      light: '#6E8098',
      dark: '#314459',
      contrastText: '#F5F7FB',
    },
    background: {
      default: backgroundDefault,
      paper: backgroundPaper,
    },
    success: {
      main: '#2E8B57',
    },
    warning: {
      main: '#D38B2C',
    },
    error: {
      main: '#C24444',
    },
    info: {
      main: '#3E7BFA',
    },
    text: {
      primary: '#132238',
      secondary: '#607188',
    },
    divider: alpha('#4B5E77', 0.18),
  },
  typography: {
    fontFamily: 'Inter, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h1: {
      fontSize: '2.05rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '1.65rem',
      fontWeight: 700,
      letterSpacing: '-0.015em',
    },
    h3: {
      fontSize: '1.3rem',
      fontWeight: 650,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.1rem',
      fontWeight: 650,
    },
    subtitle1: {
      fontSize: '0.95rem',
      fontWeight: 500,
      color: '#5E6E83',
    },
    body1: {
      fontSize: '0.95rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.86rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            'radial-gradient(circle at 10% 5%, rgba(13, 122, 109, 0.14), transparent 38%), radial-gradient(circle at 90% 4%, rgba(62, 123, 250, 0.1), transparent 28%), #F5F7FA',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#FFFFFF', 0.85),
          color: '#132238',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 10px 30px -24px rgba(14, 31, 53, 0.5)',
          borderBottom: `1px solid ${alpha('#4B5E77', 0.16)}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${alpha('#4B5E77', 0.15)}`,
          backgroundImage:
            'linear-gradient(180deg, rgba(13, 122, 109, 0.08) 0%, rgba(13, 122, 109, 0.01) 36%, rgba(255,255,255,0.95) 100%)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 16px 40px -28px rgba(16, 35, 56, 0.45)',
          border: `1px solid ${alpha('#4B5E77', 0.12)}`,
          backgroundImage:
            'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.93) 100%)',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 12,
          paddingInline: 16,
          paddingBlock: 8,
        },
        containedPrimary: {
          boxShadow: `0 12px 24px -14px ${alpha(primaryMain, 0.55)}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: alpha('#FFFFFF', 0.72),
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: `1px solid ${alpha('#4B5E77', 0.16)}`,
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: `1px solid ${alpha('#4B5E77', 0.14)}`,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(primaryMain, 0.06),
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          color: '#1C2D44',
          borderBottom: `1px solid ${alpha('#4B5E77', 0.17)}`,
        },
      },
    },
  },
});

export default appTheme;
