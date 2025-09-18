'use client';

const StudyBlockList = ({ studyBlocks, onBlockDeleted, onBlockEdit }) => {
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this study block?')) {
      return;
    }

    try {
      await onBlockDeleted(id);
    } catch (error) {
      console.error('Error deleting study block:', error);
      alert('Failed to delete study block');
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    
    // Format: "Sep 20, 2025 at 4:10 AM" in local timezone
    const dateOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    
    const timeOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true, // 12-hour format with AM/PM
    };
    
    const formattedDate = date.toLocaleDateString('en-US', dateOptions);
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
    
    return `${formattedDate} at ${formattedTime}`;
  };

  const isUpcoming = (startTime) => {
    return new Date(startTime) > new Date();
  };

  const getStatusColor = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) return 'bg-blue-100 text-blue-800 border border-blue-200';
    if (now >= start && now <= end) return 'bg-green-100 text-green-800 border border-green-200';
    return 'bg-gray-100 text-gray-700 border border-gray-200';
  };

  const getStatusText = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) return 'Upcoming';
    if (now >= start && now <= end) return 'Active';
    return 'Completed';
  };

  if (studyBlocks.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z" />
          </svg>
        </div>
        <p className="text-gray-600 font-medium">No study blocks scheduled yet.</p>
        <p className="text-sm mt-2 text-gray-500">Create your first study block to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {studyBlocks.map((block) => (
        <div
          key={block._id}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {block.title}
              </h3>
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(block.start_time, block.end_time)}`}>
                {getStatusText(block.start_time, block.end_time)}
              </span>
            </div>
            <div className="flex items-center space-x-1 ml-4">
              <button
                onClick={() => onBlockEdit(block)}
                className="text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 p-2 rounded-md transition-colors"
                title="Edit study block"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => handleDelete(block._id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors"
                title="Delete study block"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Start:</span>
                <span>{formatDateTime(block.start_time)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">End:</span>
                <span>{formatDateTime(block.end_time)}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 7H4l5-5v5zM12 3v18" />
                </svg>
                <span className="font-medium">Reminder:</span>
                <span className={`px-2 py-1 rounded text-xs ${block.reminder_sent ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {block.reminder_sent ? 'Sent' : 'Pending'}
                </span>
              </div>
            </div>
          </div>
          
          {block.description && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-start space-x-2">
                <svg className="w-4 h-4 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <span className="font-medium text-gray-700">Description:</span>
                  <p className="text-gray-600 mt-1">{block.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StudyBlockList;
