interface AlertBannerProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export function AlertBanner({ type = 'info', message }: AlertBannerProps) {
  return (
    <div className={`alert alert-${type}`}>
      <span>{message}</span>
    </div>
  );
}
