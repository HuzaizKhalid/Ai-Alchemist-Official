export default function EnterprisePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-9xl font-bold text-white">404</h1>
        <h2 className="text-3xl font-semibold text-white">Enterprise Coming Soon</h2>
        <p className="text-slate-300 max-w-md mx-auto">
          We're working on bringing you enterprise solutions. Stay tuned!
        </p>
        <a
          href="/"
          className="inline-block mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
}
