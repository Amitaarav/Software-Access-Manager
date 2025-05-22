import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Shield, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { softwareService, requestService } from '../services';
import type { Software } from '../types';

interface RequestFormData {
  software: string;
  accessType: 'Read' | 'Write' | 'Admin';
  reason: string;
}

const RequestAccessPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [softwareList, setSoftwareList] = useState<Software[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RequestFormData>();

  useEffect(() => {
    const fetchSoftware = async () => {
      try {
        const software = await softwareService.getAllSoftware();
        setSoftwareList(software);
      } catch (error) {
        toast.error('Failed to load software list');
      }
    };

    fetchSoftware();
  }, []);

  const onSubmit = async (data: RequestFormData) => {
    setIsLoading(true);
    try {
      await requestService.createRequest({
        softwareId: parseInt(data.software),
        accessType: data.accessType,
        reason: data.reason
      });
      toast.success('Access request submitted successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Shield size={40} className="text-gray-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Request Software Access</h1>
          <p className="mt-2 text-gray-600">Fill out the form below to request access to software</p>
        </div>

        <motion.div
          className="bg-white shadow-xl rounded-lg overflow-hidden"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div>
              <label htmlFor="software" className="block text-sm font-medium text-gray-700">
                Select Software*
              </label>
              <select
                id="software"
                {...register('software', { required: 'Software selection is required' })}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.software ? 'border-red-500' : 'border-gray-300'
                } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500`}
              >
                <option value="">Choose software...</option>
                {softwareList.map((sw) => (
                  <option key={sw.id} value={sw.id}>
                    {sw.name}
                  </option>
                ))}
              </select>
              {errors.software && (
                <p className="mt-1 text-sm text-red-600">{errors.software.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="accessType" className="block text-sm font-medium text-gray-700">
                Access Type*
              </label>
              <select
                id="accessType"
                {...register('accessType', { required: 'Access type is required' })}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.accessType ? 'border-red-500' : 'border-gray-300'
                } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500`}
              >
                <option value="">Select access type...</option>
                <option value="Read">Read</option>
                <option value="Write">Write</option>
                <option value="Admin">Admin</option>
              </select>
              {errors.accessType && (
                <p className="mt-1 text-sm text-red-600">{errors.accessType.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                Reason for Access*
              </label>
              <textarea
                id="reason"
                {...register('reason', {
                  required: 'Please provide a reason for access',
                  minLength: { value: 10, message: 'Reason must be at least 10 characters' }
                })}
                rows={4}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.reason ? 'border-red-500' : 'border-gray-300'
                } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500`}
                placeholder="Explain why you need access to this software..."
              />
              {errors.reason && (
                <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition disabled:opacity-70"
            >
              {isLoading ? (
                'Submitting...'
              ) : (
                <>
                  <Send size={18} />
                  Submit Request
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        <div className="mt-4 text-center text-sm text-gray-600">
          Need to check your existing requests?{' '}
          <Link to="/dashboard" className="font-medium text-gray-600 hover:text-gray-500">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default RequestAccessPage;
