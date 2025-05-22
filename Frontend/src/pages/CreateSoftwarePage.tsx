import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Package, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { softwareService } from '../services';
import type { AccessType } from '../types';

interface SoftwareFormData {
  name: string;
  description: string;
  accessLevels: AccessType[];
}

const CreateSoftwarePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SoftwareFormData>();

  const onSubmit = async (data: SoftwareFormData) => {
    setIsLoading(true);
    try {
      await softwareService.createSoftware(data);
      toast.success('Software created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create software');
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
          <Package size={40} className="text-gray-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Add New Software</h1>
          <p className="mt-2 text-gray-600">Create a new software entry in the system</p>
        </div>

        <motion.div
          className="bg-white shadow-xl rounded-lg overflow-hidden"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Software Name*
              </label>
              <input
                id="name"
                type="text"
                {...register('name', {
                  required: 'Software name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' }
                })}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500`}
                placeholder="Enter software name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description*
              </label>
              <textarea
                id="description"
                {...register('description', {
                  required: 'Description is required',
                  minLength: { value: 10, message: 'Description must be at least 10 characters' }
                })}
                rows={4}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500`}
                placeholder="Describe the software and its purpose..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Access Levels*</label>
              <div className="mt-2 space-y-2">
                {['Read', 'Write', 'Admin'].map((level) => (
                  <div key={level} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`level-${level}`}
                      value={level}
                      {...register('accessLevels', {
                        required: 'At least one access level must be selected'
                      })}
                      className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`level-${level}`} className="ml-2 text-sm text-gray-700">
                      {level}
                    </label>
                  </div>
                ))}
              </div>
              {errors.accessLevels && (
                <p className="mt-1 text-sm text-red-600">{errors.accessLevels.message}</p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition disabled:opacity-70"
            >
              {isLoading ? (
                'Creating...'
              ) : (
                <>
                  <Plus size={18} />
                  Create Software
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CreateSoftwarePage;
