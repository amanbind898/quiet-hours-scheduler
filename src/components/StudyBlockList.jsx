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
    return new Date(dateString).toLocaleString();
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
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {block.title}
            </h3>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(block.start_time, block.end_time)}`}>
                {getStatusText(block.start_time, block.end_time)}
              </span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onBlockEdit(block)}
                  className="text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 p-1 rounded transition-colors"
                  title="Edit study block"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(block._id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                  title="Delete study block"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600 space-y-2 mt-4">
            <p>
              <span className="font-medium">Start:</span> {formatDateTime(block.start_time)}
            </p>
            <p>
              <span className="font-medium">End:</span> {formatDateTime(block.end_time)}
            </p>
            {block.description && (
              <p>
                <span className="font-medium">Description:</span> {block.description}
              </p>
            )}
            <p>
              <span className="font-medium">Reminder:</span> {block.reminder_sent ? 'Sent' : 'Pending'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudyBlockList;
