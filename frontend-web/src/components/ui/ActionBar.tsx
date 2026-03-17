import { Stack } from '@mui/material';
import type { ReactNode } from 'react';

interface ActionBarProps {
  children: ReactNode;
}

export function ActionBar({ children }: ActionBarProps) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1}
      alignItems={{ xs: 'stretch', sm: 'center' }}
      justifyContent="flex-end"
      sx={{ mb: 2 }}
    >
      {children}
    </Stack>
  );
}

export default ActionBar;
