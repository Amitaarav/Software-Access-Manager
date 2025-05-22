import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { AuthContext } from '../contexts/AuthContext';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { SiSimplelogin } from "react-icons/si";

interface LoginFormData {
  usernameOrEmail: string;
  password: string;
}

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.usernameOrEmail, data.password);
      await new Promise(resolve => setTimeout(resolve, 100));
      toast.success('Login successful!');
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4"
    >
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <motion.div 
            className="flex justify-center"
            whileHover={{ rotate: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <SiSimplelogin size={80} className="text-gray-600" />
          </motion.div>
          <h1 className="text-3xl font-extrabold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500">Sign in to continue</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="usernameOrEmail" className="text-sm font-medium text-gray-700">
              Username or Email*
            </label>
            <input
              id="usernameOrEmail"
              placeholder="Enter Username or Email"
              type="text"
              {...register('usernameOrEmail', { 
                required: 'Username or Email is required',
                minLength: { 
                  value: 3, 
                  message: 'Username or Email must be at least 3 characters' 
                }
              })}
              className={`mt-1 w-full px-4 py-2 border ${
                errors.usernameOrEmail ? 'border-red-500' : 'border-gray-300'
              } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500`}
            />
            {errors.usernameOrEmail && (
              <p className="text-sm text-red-600 mt-1">{errors.usernameOrEmail.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password*
            </label>
            <div className="relative">
              <input
                id="password"
                placeholder="Enter Your Password"
                type={showPassword ? 'text' : 'password'}
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                className={`w-full px-4 py-2 pr-10 border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileTap={{ scale: 0.95 }}
            className="w-full py-2 px-4 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-70 cursor-pointer"
          >
            {isLoading ? 'Signing in...' : (
              <div className="flex items-center justify-center space-x-2">
                <LogIn size={18} />
                <span>Sign in</span>
              </div>
            )}
          </motion.button>
        </form>

        <div className="text-center pt-2 text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-gray-600 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;
