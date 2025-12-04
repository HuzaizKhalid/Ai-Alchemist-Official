export default function GalleryPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-9xl font-bold text-white">404</h1>
        <h2 className="text-3xl font-semibold text-white">Gallery Coming Soon</h2>
        <p className="text-slate-300 max-w-md mx-auto">
          We're working on bringing you an amazing gallery experience. Stay tuned!
        </p>
        <a
          href="/"
          className="inline-block mt-8 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
}
