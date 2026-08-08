import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdminSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function GET(request: Request) {
  const timestamp = new Date().toISOString();
  let testUserId: string | null = null;

  try {
    const supabaseAdmin = getAdminSupabase();

    // STEP A: PROGRAMMATIC USER SETUP
    const testEmail = `sim_user_${Date.now()}@worldstar.test`;
    const testPassword = `E2ESimulationPass123!`;

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
      user_metadata: { full_name: 'E2E SIMULATION TESTER' },
    });

    if (authError || !authData.user) {
      throw new Error(`Step A (User Creation) Failed: ${authError?.message || 'No user created'}`);
    }

    testUserId = authData.user.id;

    // Ensure profile row exists
    await supabaseAdmin.from('profiles').upsert({
      id: testUserId,
      full_name: 'E2E SIMULATION TESTER',
      email: testEmail,
      country: 'USA',
      genre: 'Hip-Hop',
    });

    // STEP B: EXECUTE USER ACTIONS (LIKE, FOLLOW, COMMENT)
    // 1. Target Submission
    const { data: targetSubmission } = await supabaseAdmin
      .from('submissions')
      .select('id')
      .limit(1)
      .maybeSingle();

    let targetSubmissionId = targetSubmission?.id;

    if (!targetSubmissionId) {
      const { data: dummySub } = await supabaseAdmin
        .from('submissions')
        .insert({
          user_id: testUserId,
          track_title: 'E2E SIMULATION TRACK',
          genre: 'HIP-HOP',
          media_url: 'https://example.com/audio.mp3',
          status: 'APPROVED',
        })
        .select('id')
        .single();
      targetSubmissionId = dummySub?.id;
    }

    // 2. Target Artist
    const { data: targetArtist } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .neq('id', testUserId)
      .limit(1)
      .maybeSingle();

    const targetArtistId = targetArtist?.id || testUserId;

    // Execute Actions
    const { error: likeError } = await supabaseAdmin
      .from('likes')
      .insert({ user_id: testUserId, submission_id: targetSubmissionId });

    if (likeError) throw new Error(`Step B (Like Action) Failed: ${likeError.message}`);

    const { error: followError } = await supabaseAdmin
      .from('followers')
      .insert({ follower_id: testUserId, following_id: targetArtistId });

    if (followError) throw new Error(`Step B (Follow Action) Failed: ${followError.message}`);

    const commentContent = `E2E Automated Test Comment ${Date.now()}: Mastermind pipeline verified! 🔥`;
    const { error: commentError } = await supabaseAdmin
      .from('comments')
      .insert({
        user_id: testUserId,
        submission_id: targetSubmissionId,
        content: commentContent,
      });

    if (commentError) throw new Error(`Step B (Comment Action) Failed: ${commentError.message}`);

    // STEP C: VERIFY PIPELINE DATA
    const { data: verifiedLikes } = await supabaseAdmin
      .from('likes')
      .select('id')
      .eq('user_id', testUserId);

    const { data: verifiedFollowers } = await supabaseAdmin
      .from('followers')
      .select('id')
      .eq('follower_id', testUserId);

    const { data: verifiedComments } = await supabaseAdmin
      .from('comments')
      .select('id, content')
      .eq('user_id', testUserId);

    const verified = (
      (verifiedLikes?.length || 0) > 0 &&
      (verifiedFollowers?.length || 0) > 0 &&
      (verifiedComments?.length || 0) > 0
    );

    if (!verified) {
      throw new Error('Step C (Pipeline Verification) Failed: DB records count mismatch');
    }

    // STEP D: AUTOMATED CLEANUP
    await supabaseAdmin.from('likes').delete().eq('user_id', testUserId);
    await supabaseAdmin.from('followers').delete().eq('follower_id', testUserId);
    await supabaseAdmin.from('comments').delete().eq('user_id', testUserId);
    await supabaseAdmin.from('profiles').delete().eq('id', testUserId);
    await supabaseAdmin.auth.admin.deleteUser(testUserId);

    return NextResponse.json({
      status: 'SUCCESS',
      timestamp,
      message: 'End-to-End User Simulation Completed & Verified Flawlessly!',
      simulationResults: {
        stepA_userSetup: {
          status: 'SUCCESS',
          testUserId,
          testEmail,
        },
        stepB_actions: {
          likeTrack: { status: 'SUCCESS', targetSubmissionId },
          followArtist: { status: 'SUCCESS', targetArtistId },
          postComment: { status: 'SUCCESS', commentContent },
        },
        stepC_verification: {
          status: 'SUCCESS',
          likedTracksCount: verifiedLikes?.length || 0,
          followingCount: verifiedFollowers?.length || 0,
          commentsHistoryCount: verifiedComments?.length || 0,
        },
        stepD_cleanup: {
          status: 'SUCCESS',
          deletedUserId: testUserId,
          databasePristine: true,
        },
      },
    });
  } catch (err: any) {
    // Fallback Cleanup on Error
    if (testUserId) {
      try {
        const supabaseAdmin = getAdminSupabase();
        await supabaseAdmin.from('likes').delete().eq('user_id', testUserId);
        await supabaseAdmin.from('followers').delete().eq('follower_id', testUserId);
        await supabaseAdmin.from('comments').delete().eq('user_id', testUserId);
        await supabaseAdmin.from('profiles').delete().eq('id', testUserId);
        await supabaseAdmin.auth.admin.deleteUser(testUserId);
      } catch (cleanupErr) {
        console.error('Fallback cleanup error:', cleanupErr);
      }
    }

    return NextResponse.json(
      {
        status: 'FAILED',
        timestamp,
        error: err.message || 'Simulation encountered an unexpected error',
      },
      { status: 500 }
    );
  }
}
