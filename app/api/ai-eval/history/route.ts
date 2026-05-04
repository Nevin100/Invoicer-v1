export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database/db_connection';
import { getUserId } from '@/lib/helpers/getUserId';
import EvalReport from '@/lib/models/EvalReport.model';

const VALID_TYPES = ['expense', 'invoice', 'client', 'complete'];
const MAX_LIMIT = 50;

export async function GET(req: NextRequest) {
  // 1. Auth
  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // 2. Parse query params
  const { searchParams } = new URL(req.url);
  const type  = searchParams.get('type');
  const limit = Math.min(
    parseInt(searchParams.get('limit') || '10', 10),
    MAX_LIMIT  
  );

  // 3. Validate optional type filter
  if (type && !VALID_TYPES.includes(type))
    return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });

  await connectDB();

  // 4. Build query
  const query: Record<string, unknown> = { user: userId };
  if (type) query.reportType = type;

  // 5. Fetch — sorted newest first, lean() for speed
  const reports = await EvalReport
    .find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('-tavilyResult -groqPromptTokens') 
    .lean();

  return NextResponse.json({ reports, count: reports.length });
}