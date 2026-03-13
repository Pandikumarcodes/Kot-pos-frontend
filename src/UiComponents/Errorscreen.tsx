import { Button } from "./Button";

interface ErrorScreenProps {
  message: string;
  onRetry: () => void;
}

export function ErrorScreen({ message, onRetry }: ErrorScreenProps) {
  return (
    <div className="h-screen flex items-center justify-center bg-kot-primary px-4">
      <div className="text-center">
        <p className="text-4xl mb-3">⚠️</p>
        <p className="text-red-600 font-medium mb-4">{message}</p>
        <Button onClick={onRetry}>Retry</Button>
      </div>
    </div>
  );
}
