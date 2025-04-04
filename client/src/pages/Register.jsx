import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    experienceLevel: 'entry',
    jobRole: 'software-engineer'
  });
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Register user
      const { data: { token } } = await api.post('/api/auth/register', formData);
      
      // Automatically log in after registration
      localStorage.setItem('token', token);
      
      // Fetch user details
      const { data: user } = await api.get('/api/auth/me');
      login(user);
      
      toast.success('Registration successful!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center">Create Account</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                className="mt-1 block w-full rounded border-gray-300"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-1 block w-full rounded border-gray-300"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="mt-1 block w-full rounded border-gray-300"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="experienceLevel" className="block text-sm font-medium">
                Experience Level
              </label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                className="mt-1 block w-full rounded border-gray-300"
                value={formData.experienceLevel}
                onChange={handleChange}
              >
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
              </select>
            </div>

            <div>
              <label htmlFor="jobRole" className="block text-sm font-medium">
                Target Job Role
              </label>
              <select
                id="jobRole"
                name="jobRole"
                className="mt-1 block w-full rounded border-gray-300"
                value={formData.jobRole}
                onChange={handleChange}
              >
                <option value="software-engineer">Software Engineer</option>
                <option value="frontend-engineer">Frontend Engineer</option>
                <option value="backend-engineer">Backend Engineer</option>
                <option value="fullstack-engineer">Fullstack Engineer</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}