import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import StudyBlock from '@/models/StudyBlock';
import { supabase } from '@/lib/supabaseClient';
import mongoose from 'mongoose';

// Helper function to get user from Supabase auth
async function getAuthenticatedUser(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return null;
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return null;
  }
  
  return user;
}

// DELETE - Delete a study block
export async function DELETE(request, { params }) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid study block ID' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find and delete the study block (only if it belongs to the user)
    const deletedBlock = await StudyBlock.findOneAndDelete({
      _id: id,
      user_id: user.id
    });

    if (!deletedBlock) {
      return NextResponse.json(
        { error: 'Study block not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Study block deleted successfully' });
  } catch (error) {
    console.error('Error deleting study block:', error);
    return NextResponse.json(
      { error: 'Failed to delete study block' },
      { status: 500 }
    );
  }
}

// PUT - Update a study block
export async function PUT(request, { params }) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { title, description, start_time, end_time } = body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid study block ID' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!title || !start_time || !end_time) {
      return NextResponse.json(
        { error: 'Title, start_time, and end_time are required' },
        { status: 400 }
      );
    }

    // Validate times
    const startTime = new Date(start_time);
    const endTime = new Date(end_time);

    if (startTime >= endTime) {
      return NextResponse.json(
        { error: 'End time must be after start time' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the existing study block
    const existingBlock = await StudyBlock.findOne({
      _id: id,
      user_id: user.id
    });

    if (!existingBlock) {
      return NextResponse.json(
        { error: 'Study block not found or unauthorized' },
        { status: 404 }
      );
    }

    // Update the block with new data
    existingBlock.title = title;
    existingBlock.description = description;
    existingBlock.start_time = startTime;
    existingBlock.end_time = endTime;

    // Check for overlaps (excluding current block)
    const hasOverlap = await existingBlock.checkForOverlap();
    if (hasOverlap) {
      return NextResponse.json(
        { error: 'This time slot overlaps with an existing study block' },
        { status: 409 }
      );
    }

    await existingBlock.save();

    return NextResponse.json(existingBlock);
  } catch (error) {
    console.error('Error updating study block:', error);
    return NextResponse.json(
      { error: 'Failed to update study block' },
      { status: 500 }
    );
  }
}
