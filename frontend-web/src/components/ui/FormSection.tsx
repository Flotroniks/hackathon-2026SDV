import { Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <Card>
      <CardContent sx={{ p: { xs: 2.25, md: 2.75 } }}>
        <Stack spacing={0.6}>
          <Typography variant="h4">{title}</Typography>
          {description ? <Typography variant="body2" color="text.secondary">{description}</Typography> : null}
        </Stack>
        <Divider sx={{ my: 2 }} />
        {children}
      </CardContent>
    </Card>
  );
}

export default FormSection;
