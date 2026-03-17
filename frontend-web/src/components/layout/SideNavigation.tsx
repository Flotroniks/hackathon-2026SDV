import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import CompareArrowsRoundedIcon from '@mui/icons-material/CompareArrowsRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import EnergySavingsLeafRoundedIcon from '@mui/icons-material/EnergySavingsLeafRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

interface SideNavigationProps {
  drawerWidth: number;
  mobileOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/dashboard', icon: <DashboardRoundedIcon />, labelKey: 'navbar.links.dashboard' },
  { to: '/sites', icon: <ApartmentRoundedIcon />, labelKey: 'navbar.links.sites' },
  { to: '/comparison', icon: <CompareArrowsRoundedIcon />, labelKey: 'navbar.links.comparison' },
  { to: '/profile', icon: <PersonRoundedIcon />, labelKey: 'navbar.links.profile' },
];

function isRouteActive(currentPath: string, targetPath: string): boolean {
  if (targetPath === '/dashboard') {
    return currentPath === '/dashboard' || currentPath === '/';
  }
  return currentPath.startsWith(targetPath);
}

export function SideNavigation({ drawerWidth, mobileOpen, onClose }: SideNavigationProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const content = (
    <Box sx={{ height: '100%', px: 1.5, pb: 2 }}>
      <Toolbar sx={{ minHeight: { xs: 68, md: 72 }, px: '8px !important' }}>
        <Box display="flex" alignItems="center" gap={1.25}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            }}
          >
            <EnergySavingsLeafRoundedIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.05 }}>
              {t('navbar.brand')}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '0.04em' }}>
              {t('layout.navigation')}
            </Typography>
          </Box>
        </Box>
      </Toolbar>

      <List sx={{ mt: 1 }}>
        {navItems.map((item) => {
          const selected = isRouteActive(pathname, item.to);
          return (
            <ListItem key={item.to} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={selected}
                onClick={() => {
                  navigate(item.to);
                  onClose();
                }}
                sx={{
                  borderRadius: 2.5,
                  px: 1.25,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={t(item.labelKey)}
                  primaryTypographyProps={{ fontSize: 14, fontWeight: selected ? 650 : 500 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {content}
      </Drawer>
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {content}
      </Drawer>
    </>
  );
}

export default SideNavigation;
