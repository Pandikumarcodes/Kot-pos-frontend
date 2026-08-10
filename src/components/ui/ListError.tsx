import { Button } from "./Button";
import { EmptyState } from "./EmptyState";

interface ListErrorProps {
  onRetry: () => void;
  title?: string;
  message?: string;
  retryLabel?: string;
  retrying?: boolean;
}

export function ListError({
  onRetry,
  title = "Unable to load this list",
  message = "Something went wrong while loading the latest data.",
  retryLabel = "Try again",
  retrying = false,
}: ListErrorProps) {
  return (
    <EmptyState
      icon="⚠️"
      title={title}
      sub={message}
      action={
        <Button onClick={onRetry} disabled={retrying}>
          {retrying ? "Retrying..." : retryLabel}
        </Button>
      }
    />
  );
}
