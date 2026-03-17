import { Box, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  overline?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageHeader({ overline, title, subtitle, actions }: PageHeaderProps) {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      alignItems={{ xs: 'flex-start', md: 'center' }}
      justifyContent="space-between"
      sx={{ mb: 3 }}
    >
      <Box>
        {overline ? (
          <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.secondary' }}>
            {overline}
          </Typography>
        ) : null}
        <Typography variant="h1" component="h1" sx={{ mt: overline ? 0.5 : 0 }}>
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant="subtitle1" sx={{ mt: 0.5, maxWidth: 900 }}>
            {subtitle}
          </Typography>
        ) : null}
      </Box>
      {actions ? <Stack direction="row" spacing={1.25}>{actions}</Stack> : null}
    </Stack>
  );
}

export default PageHeader;
