import { Button } from "./Button";
import { ErrorState } from "./ErrorState";
export function RetryPanel({
  onRetry,
  title,
  message,
}: {
  onRetry: () => void;
  title?: string;
  message?: string;
}) {
  return (
    <ErrorState
      title={title}
      message={message}
      action={
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      }
    />
  );
}
