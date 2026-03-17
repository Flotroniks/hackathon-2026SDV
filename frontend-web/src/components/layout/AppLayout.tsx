import { Box } from '@mui/material';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SideNavigation from './SideNavigation';
import TopBar from './TopBar';

const DRAWER_WIDTH = 268;

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <TopBar drawerWidth={DRAWER_WIDTH} onOpenNavigation={() => setMobileOpen(true)} />
      <SideNavigation
        drawerWidth={DRAWER_WIDTH}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { md: `${DRAWER_WIDTH}px` },
          px: { xs: 2, sm: 2.5, md: 3.5 },
          pt: { xs: 10.5, md: 12 },
          pb: 3,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default AppLayout;
