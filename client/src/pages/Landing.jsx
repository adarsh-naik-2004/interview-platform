import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <nav className="p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">InterviewPrep</h1>
          <Link to="/login" className="text-gray-600 hover:text-blue-600">
            Login
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Ace Your Technical Interviews
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Practice with AI-powered mock interviews and get detailed feedback
        </p>
        <Link
          to="/register"
          className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg 
          hover:bg-blue-700 transition-all duration-300 shadow-lg"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}