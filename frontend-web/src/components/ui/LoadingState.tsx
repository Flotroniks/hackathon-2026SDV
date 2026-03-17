import { CircularProgress, Stack, Typography } from '@mui/material';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <Stack
      direction="column"
      spacing={2}
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: 260 }}
    >
      <CircularProgress size={34} />
      {message ? <Typography variant="body2" color="text.secondary">{message}</Typography> : null}
    </Stack>
  );
}

export default LoadingState;
