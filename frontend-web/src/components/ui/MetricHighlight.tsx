import { alpha } from '@mui/material/styles';
import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface MetricHighlightProps {
  title: string;
  value: string;
  helper?: string;
  chipLabel?: string;
  icon?: ReactNode;
}

export function MetricHighlight({ title, value, helper, chipLabel, icon }: MetricHighlightProps) {
  return (
    <Card
      sx={{
        background:
          'linear-gradient(140deg, rgba(13, 122, 109, 0.16) 0%, rgba(62, 123, 250, 0.07) 50%, rgba(255,255,255,0.9) 100%)',
      }}
    >
      <CardContent sx={{ p: 2.75 }}>
        <Stack direction="row" justifyContent="space-between" spacing={1.5} alignItems="flex-start">
          <Box>
            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: '0.08em' }}>
              {title}
            </Typography>
            <Typography variant="h2" sx={{ mt: 0.4, mb: 0.7 }}>
              {value}
            </Typography>
            {helper ? <Typography variant="body2" color="text.secondary">{helper}</Typography> : null}
          </Box>
          <Stack spacing={1} alignItems="flex-end">
            {chipLabel ? (
              <Chip
                label={chipLabel}
                sx={{ bgcolor: alpha('#0D7A6D', 0.15), color: 'primary.dark' }}
              />
            ) : null}
            {icon ? (
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2.5,
                  display: 'grid',
                  placeItems: 'center',
                  backgroundColor: alpha('#0D7A6D', 0.14),
                  color: 'primary.main',
                }}
              >
                {icon}
              </Box>
            ) : null}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default MetricHighlight;
