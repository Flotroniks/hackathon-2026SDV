import { Card, CardContent, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface ModernDataCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}

export function ModernDataCard({ title, subtitle, action, children }: ModernDataCardProps) {
  return (
    <Card>
      <CardContent sx={{ p: { xs: 2.25, md: 2.75 } }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          spacing={1}
          sx={{ mb: 1.75 }}
        >
          <Stack spacing={0.4}>
            <Typography variant="h3">{title}</Typography>
            {subtitle ? <Typography variant="body2" color="text.secondary">{subtitle}</Typography> : null}
          </Stack>
          {action}
        </Stack>
        {children}
      </CardContent>
    </Card>
  );
}

export default ModernDataCard;
