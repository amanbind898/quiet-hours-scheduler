import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import StudyBlock from '@/models/StudyBlock';
import { supabase } from '@/lib/supabaseClient';
import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  const startTime = new Date();
  console.log(`🚀 Reminder API called at ${startTime.toISOString()}`);
  
  try {
    // Optional: Check for cron secret to prevent unauthorized access
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
      const authHeader = request.headers.get('authorization');
      if (authHeader !== `Bearer ${cronSecret}`) {
        console.log('❌ Unauthorized access attempt');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Get current time and 10 minutes from now
    const now = new Date();
    const tenMinutesFromNow = new Date(now.getTime() + 10 * 60 * 1000);

    // Find study blocks that start in the next 10 minutes and haven't had reminders sent
    const blocksToRemind = await StudyBlock.find({
      start_time: {
        $gte: now,
        $lte: tenMinutesFromNow
      },
      reminder_sent: false
    });

    console.log(`🔍 Found ${blocksToRemind.length} blocks needing reminders`);
    
    if (!blocksToRemind || blocksToRemind.length === 0) {
      console.log('📭 No reminders to send at this time');
      return NextResponse.json({ 
        message: 'No reminders to send',
        timestamp: new Date().toISOString(),
        blocks: 0,
        summary: { sent: 0, failed: 0, total: 0 }
      });
    }

    // Get user emails from Supabase for each block
    const blocksWithUserData = [];
    
    for (const block of blocksToRemind) {
      try {
        // Get user data from Supabase Auth
        const { data: { user }, error } = await supabase.auth.admin.getUserById(block.user_id);
        
        if (!error && user) {
          blocksWithUserData.push({
            ...block.toObject(),
            userEmail: user.email
          });
        }
      } catch (userError) {
        console.error(`Error fetching user ${block.user_id}:`, userError);
      }
    }

    // Mark reminders as sent
    const blockIds = blocksToRemind.map(block => block._id);
    await StudyBlock.updateMany(
      { _id: { $in: blockIds } },
      { $set: { reminder_sent: true } }
    );

    // Send actual email reminders
    const emailResults = [];
    
    for (const block of blocksWithUserData) {
      try {
        const emailResult = await resend.emails.send({
          from: process.env.FROM_EMAIL || 'Quiet Hours <noreply@yourdomain.com>',
          to: [block.userEmail],
          subject: `🤫 Reminder: ${block.title} starts in 10 minutes`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Study Block Reminder</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
                <h1 style="margin: 0; font-size: 28px;">🤫 Quiet Hours Reminder</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your focused study time is about to begin</p>
              </div>
              
              <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 4px solid #667eea;">
                <h2 style="color: #667eea; margin-top: 0;">${block.title}</h2>
                <p style="font-size: 16px; margin: 15px 0;"><strong>⏰ Starting in 10 minutes</strong></p>
                <p style="margin: 10px 0;"><strong>Start Time:</strong> ${new Date(block.start_time).toLocaleString()}</p>
                <p style="margin: 10px 0;"><strong>End Time:</strong> ${new Date(block.end_time).toLocaleString()}</p>
                ${block.description ? `<p style="margin: 10px 0;"><strong>Description:</strong> ${block.description}</p>` : ''}
              </div>
              
              <div style="margin-top: 30px; padding: 20px; background: #e8f4fd; border-radius: 8px;">
                <h3 style="color: #1a73e8; margin-top: 0;">📚 Study Tips for Maximum Focus:</h3>
                <ul style="margin: 15px 0; padding-left: 20px;">
                  <li>Put your phone in silent mode or another room</li>
                  <li>Close unnecessary browser tabs and applications</li>
                  <li>Have water and any needed materials ready</li>
                  <li>Take a deep breath and set your intention</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin-top: 30px; padding: 20px; border-top: 2px solid #eee;">
                <p style="font-size: 18px; color: #667eea; margin: 0;"><strong>Good luck with your focused study session!</strong></p>
                <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">
                  From your friends at Quiet Hours Scheduler
                </p>
              </div>
            </body>
            </html>
          `
        });
        
        emailResults.push({
          email: block.userEmail,
          title: block.title,
          status: 'sent',
          messageId: emailResult.data?.id
        });
        
        console.log(`✅ Email sent to ${block.userEmail} for "${block.title}"`);
        
      } catch (emailError) {
        console.error(`❌ Failed to send email to ${block.userEmail}:`, emailError);
        emailResults.push({
          email: block.userEmail,
          title: block.title,
          status: 'failed',
          error: emailError.message
        });
      }
    }

    const sentCount = emailResults.filter(r => r.status === 'sent').length;
    const failedCount = emailResults.filter(r => r.status === 'failed').length;
    
    return NextResponse.json({ 
      message: `Processed ${blocksToRemind.length} reminders`,
      timestamp: new Date().toISOString(),
      blocks: blocksToRemind.length,
      emailResults: emailResults,
      summary: {
        sent: sentCount,
        failed: failedCount,
        total: emailResults.length
      },
      details: emailResults.map(r => ({
        email: r.email,
        title: r.title,
        status: r.status,
        ...(r.error && { error: r.error })
      }))
    });

  } catch (error) {
    console.error('Error sending reminders:', error);
    return NextResponse.json(
      { error: 'Failed to send reminders' },
      { status: 500 }
    );
  }
}

// This endpoint can be called by a cron job or scheduled task
// Example: Set up a cron job to call this every minute:
// * * * * * curl -X POST https://your-domain.com/api/send-reminders

// Or use Vercel Cron Jobs (vercel.json):
/*
{
  "crons": [{
    "path": "/api/send-reminders",
    "schedule": "* * * * *"
  }]
}
*/
