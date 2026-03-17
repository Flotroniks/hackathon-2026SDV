import { alpha } from '@mui/material/styles';
import { Box, Card, CardContent, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface KpiCardProps {
  title: string;
  value: string;
  caption?: string;
  icon?: ReactNode;
  accentColor?: string;
}

export function KpiCard({ title, value, caption, icon, accentColor }: KpiCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 'auto 16px 0 16px',
          height: 4,
          borderRadius: 20,
          backgroundColor: accentColor || 'primary.main',
        },
      }}
    >
      <CardContent sx={{ p: 2.25 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.3}>
          <Typography variant="overline" sx={{ lineHeight: 1.2, color: 'text.secondary', letterSpacing: '0.08em' }}>
            {title}
          </Typography>
          {icon ? (
            <Box
              sx={{
                width: 36,
                height: 36,
                display: 'grid',
                placeItems: 'center',
                borderRadius: 2,
                color: accentColor || 'primary.main',
                backgroundColor: alpha(accentColor || '#0D7A6D', 0.12),
              }}
            >
              {icon}
            </Box>
          ) : null}
        </Box>
        <Typography variant="h3" sx={{ mb: 0.4 }}>
          {value}
        </Typography>
        {caption ? <Typography variant="body2" color="text.secondary">{caption}</Typography> : null}
      </CardContent>
    </Card>
  );
}

export default KpiCard;
