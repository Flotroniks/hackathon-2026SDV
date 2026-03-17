import { Alert, Button, Stack } from '@mui/material';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';

interface ErrorStateProps {
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, retryLabel, onRetry }: ErrorStateProps) {
  return (
    <Stack spacing={1.5}>
      <Alert severity="error">{message}</Alert>
      {retryLabel && onRetry ? (
        <Button variant="outlined" startIcon={<ReplayRoundedIcon />} onClick={onRetry} sx={{ alignSelf: 'flex-start' }}>
          {retryLabel}
        </Button>
      ) : null}
    </Stack>
  );
}

export default ErrorState;
