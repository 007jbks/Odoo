import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';

const LoginForm = ({ onToggle }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    isAdmin: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we're simulating successful login
      setTimeout(() => {
        // Check if email and password are valid (for demo purposes)
        if (formData.email && formData.password.length >= 6) {
          const userData = {
            email: formData.email,
            // Don't store passwords in localStorage in a real app
            // This is just for demo purposes
            id: Math.random().toString(36).substr(2, 9),
            isAdmin: formData.isAdmin
          };
          
          // Navigate to admin dashboard if admin login
          if (formData.isAdmin) {
            navigate('/admin-dashboard');
          } else {
            navigate('/user-dashboard');
          }
        } else {
          setError('Invalid email or password (password must be at least 6 characters)');
        }
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 w-full max-w-md">
      <h2 className="text-2xl text-gray-900">Log in to your account</h2>
      <p className="text-gray-600 text-xs">Enter your email address and password to log in</p>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <form onSubmit={handleLogin} className="space-y-3">
        <div className="relative">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email address"
            className="w-full px-4 py-2 bg-[#F8FBFF] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F77B4F2] pl-10 text-sm"
            required
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        
        <div className="relative">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            className="w-full px-4 py-2 bg-[#F8FBFF] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F77B4F2] pl-10 text-sm"
            required
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isAdmin"
            id="isAdmin"
            checked={formData.isAdmin}
            onChange={handleInputChange}
            className="h-4 w-4 text-[#1F77B4F2] focus:ring-[#1F77B4F2] border-gray-300 rounded"
          />
          <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-600">
            Log in as administrator
          </label>
        </div>

        <a href="#" className="text-[#1F77B4F2] text-xs hover:underline self-end">
          forgot password?
        </a>

        <button 
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 bg-[#1F77B4F2] text-white rounded-lg text-sm hover:bg-[#1F77B4] transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="text-center text-gray-500 text-xs">or</div>

      <button className="w-full py-2 px-4 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors">
        <img src="/google.svg" alt="Google" className="w-4 h-4" />
        <span>Connect with Google</span>
      </button>

      <p className="text-center text-gray-600 text-xs">
        Don't have an account?{' '}
        <button onClick={onToggle} className="text-[#1F77B4F2] hover:underline">
          SIGN UP
        </button>
      </p>
    </div>
  );
};

const SignUpForm = ({ onToggle }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    isAdmin: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we're simulating successful signup
      setTimeout(() => {
        const userData = {
          email: formData.email,
          // Don't store passwords in localStorage in a real app
          // This is just for demo purposes
          id: Math.random().toString(36).substr(2, 9),
          isAdmin: formData.isAdmin
        };
        
        // Navigate to admin dashboard if admin signup
        if (formData.isAdmin) {
          navigate('/admin-dashboard');
        } else {
          navigate('/user-dashboard');
        }
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Signup failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 w-full max-w-md">
      <h2 className="text-2xl text-gray-900">Sign up to create an account</h2>
      <p className="text-gray-600 text-xs">Enter your email address and create a password to sign up</p>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSignUp} className="space-y-3">
        <div className="relative">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email address"
            className="w-full px-4 py-2 bg-[#F8FBFF] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F77B4F2] pl-10 text-sm"
            required
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        
        <div className="relative">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            className="w-full px-4 py-2 bg-[#F8FBFF] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F77B4F2] pl-10 text-sm"
            required
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <div className="relative">
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm Password"
            className="w-full px-4 py-2 bg-[#F8FBFF] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F77B4F2] pl-10 text-sm"
            required
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isAdmin"
            id="isAdmin"
            checked={formData.isAdmin}
            onChange={handleInputChange}
            className="h-4 w-4 text-[#1F77B4F2] focus:ring-[#1F77B4F2] border-gray-300 rounded"
          />
          <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-600">
            Sign up as administrator
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 bg-[#1F77B4F2] text-white rounded-lg text-sm hover:bg-[#1F77B4] transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Signing up...' : 'Sign up'}
        </button>
      </form>

      <div className="text-center text-gray-500 text-xs">or</div>

      <button className="w-full py-2 px-4 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors">
        <img src="/google.svg" alt="Google" className="w-4 h-4" />
        <span>Connect with Google</span>
      </button>

      <p className="text-center text-gray-600 text-xs">
        Already have an account?{' '}
        <button onClick={onToggle} className="text-[#1F77B4F2] hover:underline">
          LOG IN
        </button>
      </p>
    </div>
  );
};

const DashboardPreview = () => {
  return (
    <div className="w-full h-full bg-[#1F77B4F2] rounded-l-[50px] overflow-hidden flex items-center justify-center">
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="z-10 absolute top-[40px] w-[350px] right-[20px]"
        >
          <img
            src="/images/img3.png"
            alt="Dashboard Preview 1"
            className="w-full rounded-lg"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="z-10 absolute top-[180px] w-[350px] right-[80px]"
        >
          <img
            src="/images/img1.png"
            alt="Dashboard Preview 2"
            className="w-full rounded-lg"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="z-10 absolute top-[320px] w-[350px] right-[140px]"
        >
          <img
            src="/images/img3.png"
            alt="Dashboard Preview 3"
            className="w-full rounded-lg"
          />
        </motion.div>
      </div>
    </div>
  );
};

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  
  // Redirect to dashboard if user is already logged in
  // React.useEffect(() => {
  //   if (user) {
  //     navigate('/dashboard');
  //   }
  // }, [user, navigate]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Side - Auth Form */}
      <div className="w-full lg:w-[45%] p-4 lg:p-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Back to Dashboard Link */}
          <div className="absolute top-6 left-6 z-50">
            <Link
            to="/"
            className="flex items-center text-[#1F77B4F2] hover:text-[#1F77B4] transition-colors font-medium"
            >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
                />
            </svg>
            Back to Dashboard
            </Link>
            </div>

          <div className="flex items-center mb-8">
            <div className="text-2xl font-bold text-[#1F77B4F2]">€</div>
            <div className="ml-2 text-lg text-gray-900">COMPANY NAME</div>
          </div>
          
          <div className="relative">
            <motion.div
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full"
            >
              {isLogin ? (
                <LoginForm onToggle={() => setIsLogin(false)} />
              ) : (
                <SignUpForm onToggle={() => setIsLogin(true)} />
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right Side - Dashboard Preview */}
      <div className="hidden lg:block lg:w-[55%] bg-[#1F77B4F2] rounded-l-[50px]">
        <DashboardPreview />
      </div>
    </div>
  );
}

export default AuthPage; 