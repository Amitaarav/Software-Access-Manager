import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Shield, Home, Key, ClipboardList, Plus, ChevronDown } from 'lucide-react';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gray-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Shield className="h-8 w-8" />
            <span className="ml-2 text-lg font-semibold">AccessManager</span>
          </div>

          <nav className="hidden md:flex space-x-8 items-center">
            <Link to="/dashboard" className="hover:text-gray-100 transition-colors">
              <Home size={18} className="inline mr-1" />
              Dashboard
            </Link>
            <Link to="/request-access" className="hover:text-gray-100 transition-colors">
              <Key size={18} className="inline mr-1" />
              Request Access
            </Link>
            {user?.role === 'Admin' && (
              <Link to="/pending-requests" className="hover:text-gray-100 transition-colors">
                <ClipboardList size={18} className="inline mr-1" />
                Pending Requests
              </Link>
            )}
            {user?.role === 'Admin' && (
              <Link to="/create-software" className="hover:text-gray-100 transition-colors">
                <Plus size={18} className="inline mr-1" />
                Add Software
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-2 border-l pl-6 border-gray-500">
            <div className="flex flex-col items-end">
              <span className="font-medium">{user?.username}</span>
              <span className="ml-2 px-2 py-1 bg-gray-600 rounded-full text-xs">
                {user?.role}
              </span>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 hover:bg-gray-600 rounded-full"
            >
              <ChevronDown size={20} />
            </button>

            {isMenuOpen && (
              <div className="absolute right-4 top-16 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <Link
                    to="/profile"
                    className="hover:text-gray-900 transition-colors block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="hover:text-gray-900 transition-colors block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;