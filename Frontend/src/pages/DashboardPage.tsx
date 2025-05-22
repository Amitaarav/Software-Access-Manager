import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../contexts/AuthContext';
import { Package, UserCheck, Clock, Users, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { softwareService, requestService } from '../services';
import type { Software, Request } from '../types';

interface DashboardStat {
  icon: React.ReactNode;
  label: string;
  count: number;
  color: string;
}

const dashboardStats: DashboardStat[] = [
  {
    icon: <Package size={24} className="text-gray-600" />,
    label: 'Available Software',
    count: 0,
    color: 'bg-gray-100',
  },
  {
    icon: <UserCheck size={24} className="text-green-600" />,
    label: 'Approved Requests',
    count: 0,
    color: 'bg-green-100',
  },
  {
    icon: <Clock size={24} className="text-yellow-600" />,
    label: 'Pending Requests',
    count: 0,
    color: 'bg-yellow-100',
  },
  {
    icon: <Users size={24} className="text-blue-600" />,
    label: 'Total Users',
    count: 0,
    color: 'bg-blue-100',
  },
  {
    icon: <CheckCircle size={24} className="text-emerald-600" />,
    label: 'Active Users',
    count: 0,
    color: 'bg-emerald-100',
  },
  {
    icon: <XCircle size={24} className="text-red-600" />,
    label: 'Inactive Users',
    count: 0,
    color: 'bg-red-100',
  }
];

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [software, setSoftware] = useState<Software[]>([]);
  const [userRequests, setUserRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [softwareData, userRequestsData] = await Promise.all([
          softwareService.getAllSoftware(),
          requestService.getMyRequests()
        ]);
        
        if (isMounted) {
          setSoftware(softwareData);
          setUserRequests(userRequestsData);
          setError(null);
        }
      } catch (error) {
        if (isMounted) {
          setError('Failed to load dashboard data');
          toast.error('Failed to load dashboard data');
          console.error(error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = [
    {
      ...dashboardStats[0],
      count: software.length
    },
    {
      ...dashboardStats[1],
      count: userRequests.filter(r => r.status === 'Approved').length
    },
    {
      ...dashboardStats[2],
      count: userRequests.filter(r => r.status === 'Pending').length
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (isLoading) {
    return (
      <motion.div 
        className="flex justify-center items-center min-h-[400px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-transparent"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="flex justify-center items-center min-h-[400px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Data</h3>
          <p className="text-gray-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-lg shadow-md p-6"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl font-bold">Welcome, {user?.username}!</h1>
        <p className="mt-2 text-gray-100">
          You are logged in as <span className="font-semibold">{user?.role}</span>
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((card, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md flex items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <div className={`${card.color} p-3 rounded-full mr-4`}>{card.icon}</div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">{card.label}</h2>
              <p className="text-2xl font-semibold">{card.count}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="bg-white rounded-lg shadow-md overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Your Access Requests</h2>
        </div>

        {userRequests.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {userRequests.map((request, i) => (
              <motion.div
                key={request.id}
                className="p-6 hover:bg-gray-50 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-lg font-medium">{request.software?.name || 'Unknown Software'}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Access type: <span className="font-medium">{request.accessType}</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Requested on {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700">Reason:</h4>
                  <p className="text-sm text-gray-600 mt-1">{request.reason}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-500">You haven't made any access requests yet.</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;
