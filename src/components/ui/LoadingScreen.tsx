interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  return (
    <div
      className="h-screen flex items-center justify-center bg-kot-primary"
      role="status"
      aria-live="polite"
    >
      <div className="text-center">
        <div
          className="w-14 h-14 border-4 border-kot-dark border-t-transparent rounded-full animate-spin mx-auto mb-3"
          aria-hidden="true"
        />
        <p className="text-kot-text">{message}</p>
      </div>
    </div>
  );
}
