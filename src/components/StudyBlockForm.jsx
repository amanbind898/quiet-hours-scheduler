'use client';

import { useState, useEffect } from 'react';

const StudyBlockForm = ({ onBlockCreated, existingBlocks, onCancel, editingBlock }) => {
  const [formData, setFormData] = useState({
    title: '',
    start_time: '',
    end_time: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (editingBlock) {
      setFormData({
        title: editingBlock.title || '',
        start_time: editingBlock.start_time ? new Date(editingBlock.start_time).toISOString().slice(0, 16) : '',
        end_time: editingBlock.end_time ? new Date(editingBlock.end_time).toISOString().slice(0, 16) : '',
        description: editingBlock.description || ''
      });
    } else {
      setFormData({
        title: '',
        start_time: '',
        end_time: '',
        description: ''
      });
    }
  }, [editingBlock]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: ''
      });
    }
  };

  const checkForOverlap = (startTime, endTime) => {
    const newStart = new Date(startTime);
    const newEnd = new Date(endTime);

    return existingBlocks.some(block => {
      const existingStart = new Date(block.start_time);
      const existingEnd = new Date(block.end_time);

      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    try {
      // Basic client-side validation
      const startTime = new Date(formData.start_time);
      const endTime = new Date(formData.end_time);

      if (startTime >= endTime) {
        throw new Error('End time must be after start time');
      }

      if (startTime < new Date()) {
        throw new Error('Start time cannot be in the past');
      }

      // Check for overlaps on client side
      if (checkForOverlap(formData.start_time, formData.end_time)) {
        throw new Error('This time slot overlaps with an existing study block');
      }

      // Call the parent handler which will make the API call
      await onBlockCreated(formData);
      
      // Reset form on success only if not editing
      if (!editingBlock) {
        setFormData({
          title: '',
          start_time: '',
          end_time: '',
          description: ''
        });
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 bg-white transition-colors placeholder-gray-700 text-gray-900 ${
              fieldErrors.title 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
            placeholder="Study session title"
          />
          {fieldErrors.title && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-1">
            Start Time
          </label>
          <input
            id="start_time"
            name="start_time"
            type="datetime-local"
            value={formData.start_time}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 bg-white transition-colors placeholder-gray-700 text-gray-900 ${
              fieldErrors.start_time 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
          />
          {fieldErrors.start_time && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.start_time}</p>
          )}
        </div>

        <div>
          <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-1">
            End Time
          </label>
          <input
            id="end_time"
            name="end_time"
            type="datetime-local"
            value={formData.end_time}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 bg-white transition-colors placeholder-gray-700 text-gray-900 ${
              fieldErrors.end_time 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
          />
          {fieldErrors.end_time && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.end_time}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white resize-none placeholder-gray-700 text-gray-900"
            placeholder="What will you be studying?"
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200">{error}</div>
        )}

        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-2 px-4 rounded-md transition duration-200 shadow-sm disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {editingBlock ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              editingBlock ? 'Update Study Block' : 'Create Study Block'
            )}
          </button>
        </div>
      </form>
  );
};

export default StudyBlockForm;
