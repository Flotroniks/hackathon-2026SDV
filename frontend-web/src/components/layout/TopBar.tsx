import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { AppBar, Box, Button, FormControl, IconButton, MenuItem, Select, Stack, Toolbar, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { changeAppLanguage } from '../../i18n';

interface TopBarProps {
  drawerWidth: number;
  onOpenNavigation: () => void;
}

function mapPageTitle(pathname: string, t: (key: string) => string): string {
  if (pathname.startsWith('/dashboard')) return t('navbar.links.dashboard');
  if (pathname === '/sites/new') return t('siteFormPage.createTitle');
  if (pathname.includes('/sites/') && pathname.endsWith('/edit')) return t('siteFormPage.editTitle');
  if (pathname.startsWith('/sites/')) return t('sites.title');
  if (pathname.startsWith('/sites')) return t('sites.title');
  if (pathname.startsWith('/comparison')) return t('navbar.links.comparison');
  if (pathname.startsWith('/profile')) return t('navbar.links.profile');
  return t('navbar.brand');
}

export function TopBar({ drawerWidth, onOpenNavigation }: TopBarProps) {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  const currentLanguage = i18n.language.startsWith('fr') ? 'fr' : 'en';
  const title = mapPageTitle(pathname, t);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 68, md: 72 } }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexGrow: 1 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={onOpenNavigation}
            sx={{ display: { md: 'none' } }}
          >
            <MenuRoundedIcon />
          </IconButton>

          <Box>
            <Typography variant="h4" component="p" sx={{ lineHeight: 1.1 }}>
              {title}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '0.03em' }}>
              {t('layout.subtitle')}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1.25}>
          <FormControl size="small" sx={{ minWidth: 112 }}>
            <Select
              value={currentLanguage}
              onChange={(event) => changeAppLanguage(event.target.value as 'fr' | 'en')}
              sx={{ bgcolor: 'background.paper' }}
            >
              <MenuItem value="fr">FR</MenuItem>
              <MenuItem value="en">EN</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.15 }}>
              {user?.fullName}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.1 }}>
              {user?.role === 'ADMIN' ? t('profile.roles.admin') : t('profile.roles.user')}
            </Typography>
          </Box>

          <Button variant="outlined" color="secondary" startIcon={<LogoutRoundedIcon />} onClick={logout}>
            {t('navbar.logout')}
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
