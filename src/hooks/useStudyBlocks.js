'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';

export const useStudyBlocks = () => {
  const [studyBlocks, setStudyBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Helper function to get auth headers
  const getAuthHeaders = async () => {
    if (!user) return {};
    
    const { data: { session } } = await supabase.auth.getSession();
    return {
      'Authorization': `Bearer ${session?.access_token}`,
      'Content-Type': 'application/json',
    };
  };

  // Fetch all study blocks
  const fetchStudyBlocks = async () => {
    if (!user) {
      setStudyBlocks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const headers = await getAuthHeaders();
      
      const response = await fetch('/api/study-blocks', {
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to fetch study blocks');
      }

      const data = await response.json();
      setStudyBlocks(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching study blocks:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create a new study block
  const createStudyBlock = async (blockData) => {
    try {
      // Debug logging
      console.log('Frontend sending data:', blockData);
      
      const headers = await getAuthHeaders();
      
      const response = await fetch('/api/study-blocks', {
        method: 'POST',
        headers,
        body: JSON.stringify(blockData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create study block');
      }

      const newBlock = await response.json();
      setStudyBlocks(prev => [...prev, newBlock].sort((a, b) => 
        new Date(a.start_time) - new Date(b.start_time)
      ));
      
      return newBlock;
    } catch (err) {
      console.error('Error creating study block:', err);
      throw err;
    }
  };

  // Delete a study block
  const deleteStudyBlock = async (blockId) => {
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`/api/study-blocks/${blockId}`, {
        method: 'DELETE',
        headers
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete study block');
      }

      setStudyBlocks(prev => prev.filter(block => block._id !== blockId));
    } catch (err) {
      console.error('Error deleting study block:', err);
      throw err;
    }
  };

  // Update a study block
  const updateStudyBlock = async (blockId, blockData) => {
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`/api/study-blocks/${blockId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(blockData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update study block');
      }

      const updatedBlock = await response.json();
      setStudyBlocks(prev => 
        prev.map(block => 
          block._id === blockId ? updatedBlock : block
        ).sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
      );
      
      return updatedBlock;
    } catch (err) {
      console.error('Error updating study block:', err);
      throw err;
    }
  };

  // Fetch study blocks when user changes
  useEffect(() => {
    fetchStudyBlocks();
  }, [user]);

  return {
    studyBlocks,
    loading,
    error,
    fetchStudyBlocks,
    createStudyBlock,
    deleteStudyBlock,
    updateStudyBlock,
  };
};
