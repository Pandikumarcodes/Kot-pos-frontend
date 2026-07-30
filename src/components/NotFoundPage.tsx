import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="min-h-screen bg-kot-primary flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <p className="text-sm font-semibold text-kot-dark mb-2">404</p>
        <h1 className="text-2xl font-bold text-kot-darker mb-2">
          Page not found
        </h1>
        <p className="text-sm text-kot-text mb-6">
          The page you requested does not exist or is no longer available.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-5 py-2.5 bg-kot-dark hover:bg-kot-darker text-white font-semibold rounded-xl transition-colors"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
