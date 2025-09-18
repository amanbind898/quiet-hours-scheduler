'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useStudyBlocks } from '@/hooks/useStudyBlocks';
import StudyBlockForm from './StudyBlockForm';
import StudyBlockList from './StudyBlockList';
import Modal from './Modal';
import FloatingActionButton from './FloatingActionButton';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { studyBlocks, loading, createStudyBlock, deleteStudyBlock, updateStudyBlock } = useStudyBlocks();
  const [showForm, setShowForm] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);

  const handleBlockCreated = async (blockData) => {
    try {
      await createStudyBlock(blockData);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating block:', error);
      throw error;
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBlock(null);
  };

  const handleEditBlock = (block) => {
    setEditingBlock(block);
    setShowForm(true);
  };

  const handleBlockUpdated = async (blockData) => {
    try {
      await updateStudyBlock(editingBlock._id, blockData);
      setShowForm(false);
      setEditingBlock(null);
    } catch (error) {
      console.error('Error updating block:', error);
      throw error;
    }
  };

  const handleBlockDeleted = async (deletedId) => {
    try {
      await deleteStudyBlock(deletedId);
    } catch (error) {
      console.error('Error deleting block:', error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quiet Hours Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.email}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add New Block</span>
          </button>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="w-full">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Your Study Blocks
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {studyBlocks.length === 0 
              ? 'No study blocks scheduled yet. Create your first one!' 
              : `You have ${studyBlocks.length} study block${studyBlocks.length !== 1 ? 's' : ''} scheduled.`
            }
          </p>
        </div>
        
        <StudyBlockList 
          studyBlocks={studyBlocks} 
          onBlockDeleted={handleBlockDeleted}
          onBlockEdit={handleEditBlock}
        />
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton 
        onClick={() => setShowForm(!showForm)}
        isFormOpen={showForm}
      />

      {/* Modal Form */}
      <Modal 
        isOpen={showForm} 
        onClose={handleCloseForm}
        title={editingBlock ? "Edit Study Block" : "Schedule New Study Block"}
      >
        <StudyBlockForm 
          onBlockCreated={editingBlock ? handleBlockUpdated : handleBlockCreated}
          existingBlocks={studyBlocks.filter(block => block._id !== editingBlock?._id)}
          onCancel={handleCloseForm}
          editingBlock={editingBlock}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
