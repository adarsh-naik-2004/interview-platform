import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-100 to-white relative overflow-hidden flex flex-col">
      {/* Background decorative blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute top-20 right-0 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

      {/* Navbar */}
      <nav className="p-6 z-10 relative">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-indigo-700 tracking-tight">
            InterviewPrep
          </h1>
          <Link
            to="/login"
            className="px-5 py-2 rounded-full bg-white/60 backdrop-blur-md shadow-md text-indigo-700 font-medium hover:bg-white hover:shadow-lg transition-all duration-200"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-24 z-10 relative text-center flex-grow">
        <h1 className="text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
          Ace Your <span className="text-indigo-600">Technical Interviews</span>
        </h1>
        <p className="text-2xl text-gray-700 mb-10 max-w-2xl mx-auto">
          Practice with intelligent AI-driven mock interviews and get insightful feedback to improve your performance.
        </p>
        <Link
          to="/register"
          className="inline-block bg-indigo-600 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-indigo-700 transition-all duration-300"
        >
          Get Started
        </Link>
      </main>

      {/* Footer */}
      <footer className="z-10 relative text-center py-6 mt-12 bg-white/60 backdrop-blur-md border-t border-white/50 shadow-inner">
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-gray-700">
            🚀 Built with 💙 by <span className="font-semibold text-indigo-700">Team - Bug_fighters</span>
          </p>
          <a
            href="https://github.com/adarsh-naik-2004/interview-platform"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-700 border border-indigo-300 rounded-full hover:bg-indigo-50 transition"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.1 3.29 9.42 7.85 10.96.58.1.79-.26.79-.58v-2.04c-3.2.7-3.87-1.4-3.87-1.4-.53-1.36-1.29-1.72-1.29-1.72-1.05-.73.08-.71.08-.71 1.16.08 1.77 1.2 1.77 1.2 1.04 1.78 2.74 1.27 3.4.97.1-.76.4-1.27.72-1.56-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.3 1.2-3.11-.12-.3-.52-1.5.11-3.12 0 0 .97-.31 3.18 1.19a11.14 11.14 0 0 1 5.8 0c2.2-1.5 3.17-1.19 3.17-1.19.63 1.62.24 2.82.12 3.12.75.81 1.2 1.85 1.2 3.11 0 4.42-2.7 5.4-5.26 5.69.41.35.77 1.04.77 2.1v3.11c0 .32.21.69.8.58A10.52 10.52 0 0 0 23.5 12C23.5 5.74 18.27.5 12 .5Z" />
            </svg>
            View on GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
