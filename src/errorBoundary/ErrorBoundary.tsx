import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen bg-kot-primary flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h2 className="text-xl font-bold text-kot-darker mb-2">
                Something went wrong
              </h2>
              <p className="text-sm text-kot-text mb-2">
                {this.state.error?.message || "An unexpected error occurred"}
              </p>
              <p className="text-xs text-kot-text/60 mb-6">
                Don't worry — your data is safe!
              </p>
              <div className="flex gap-3">
                <button
                  onClick={this.handleReset}
                  className="flex-1 py-2.5 bg-kot-dark hover:bg-kot-darker text-white font-semibold rounded-xl transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="flex-1 py-2.5 border-2 border-kot-dark text-kot-darker font-semibold rounded-xl hover:bg-kot-primary transition-colors"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
