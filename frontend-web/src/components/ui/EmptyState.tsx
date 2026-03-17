import { Box, Button, Stack, Typography } from '@mui/material';
import InsertChartOutlinedRoundedIcon from '@mui/icons-material/InsertChartOutlinedRounded';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export function EmptyState({ title, description, actionLabel, onAction, icon }: EmptyStateProps) {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={1.4}
      sx={{
        minHeight: 220,
        textAlign: 'center',
        border: (theme) => `1px dashed ${theme.palette.divider}`,
        borderRadius: 3,
        px: 2,
        py: 4,
      }}
    >
      <Box sx={{ color: 'text.secondary' }}>{icon ?? <InsertChartOutlinedRoundedIcon fontSize="large" />}</Box>
      <Typography variant="h4">{title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 480 }}>
        {description}
      </Typography>
      {actionLabel && onAction ? (
        <Button variant="contained" onClick={onAction} sx={{ mt: 1 }}>
          {actionLabel}
        </Button>
      ) : null}
    </Stack>
  );
}

export default EmptyState;
