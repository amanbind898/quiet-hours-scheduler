import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import StudyBlock from '@/models/StudyBlock';
import { supabase } from '@/lib/supabaseClient';

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

// GET - Fetch all study blocks for authenticated user
export async function GET(request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const studyBlocks = await StudyBlock.find({ user_id: user.id })
      .sort({ start_time: 1 });

    return NextResponse.json(studyBlocks);
  } catch (error) {
    console.error('Error fetching study blocks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch study blocks' },
      { status: 500 }
    );
  }
}

// POST - Create new study block
export async function POST(request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, start_time, end_time } = body;

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

    if (startTime < new Date()) {
      return NextResponse.json(
        { error: 'Start time cannot be in the past' },
        { status: 400 }
      );
    }

    await connectDB();

    // Create new study block
    const studyBlock = new StudyBlock({
      user_id: user.id,
      title,
      description,
      start_time: startTime,
      end_time: endTime,
      reminder_sent: false
    });

    // Check for overlaps
    const hasOverlap = await studyBlock.checkForOverlap();
    if (hasOverlap) {
      return NextResponse.json(
        { error: 'This time slot overlaps with an existing study block' },
        { status: 409 }
      );
    }

    await studyBlock.save();

    return NextResponse.json(studyBlock, { status: 201 });
  } catch (error) {
    console.error('Error creating study block:', error);
    return NextResponse.json(
      { error: 'Failed to create study block' },
      { status: 500 }
    );
  }
}
