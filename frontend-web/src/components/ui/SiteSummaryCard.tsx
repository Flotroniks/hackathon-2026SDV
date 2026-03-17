import { Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface SiteSummaryCardProps {
  name: string;
  code: string;
  location: string;
  updatedAt?: string;
  action?: ReactNode;
  children?: ReactNode;
}

export function SiteSummaryCard({ name, code, location, updatedAt, action, children }: SiteSummaryCardProps) {
  return (
    <Card>
      <CardContent sx={{ p: { xs: 2.25, md: 2.75 } }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
          <Stack spacing={0.8}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Typography variant="h3">{name}</Typography>
              <Chip label={code} color="primary" variant="outlined" />
            </Stack>
            <Typography variant="body2" color="text.secondary">{location}</Typography>
            {updatedAt ? <Typography variant="caption" color="text.secondary">{updatedAt}</Typography> : null}
          </Stack>
          {action}
        </Stack>
        {children ? (
          <>
            <Divider sx={{ my: 2 }} />
            {children}
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default SiteSummaryCard;
