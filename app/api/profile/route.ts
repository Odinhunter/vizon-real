import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { applyRateLimit, profileLimiter } from '@/lib/rateLimit';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const blocked = applyRateLimit(profileLimiter, session.user.id);
  if (blocked) return blocked;

  const profile = await prisma.userProfile.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json({ profile });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const blockedPost = applyRateLimit(profileLimiter, session.user.id);
  if (blockedPost) return blockedPost;

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { university, graduationYear, targetRole, prepBackground } = body;

  // Validate and sanitize inputs
  const sanitizedUniversity = typeof university === 'string' ? university.trim().slice(0, 200) : null;
  const sanitizedTargetRole = typeof targetRole === 'string' ? targetRole.trim().slice(0, 200) : null;
  const sanitizedPrepBackground = typeof prepBackground === 'string' ? prepBackground.trim().slice(0, 1000) : null;

  let parsedYear: number | null = null;
  if (graduationYear != null && graduationYear !== '') {
    parsedYear = parseInt(String(graduationYear), 10);
    if (isNaN(parsedYear) || parsedYear < 1950 || parsedYear > 2050) {
      return NextResponse.json({ error: 'Invalid graduation year' }, { status: 400 });
    }
  }

  const profile = await prisma.userProfile.upsert({
    where: { userId: session.user.id },
    update: {
      university: sanitizedUniversity,
      graduationYear: parsedYear,
      targetRole: sanitizedTargetRole,
      prepBackground: sanitizedPrepBackground,
      completedAt: new Date(),
    },
    create: {
      userId: session.user.id,
      university: sanitizedUniversity,
      graduationYear: parsedYear,
      targetRole: sanitizedTargetRole,
      prepBackground: sanitizedPrepBackground,
      completedAt: new Date(),
    },
  });

  return NextResponse.json({ profile });
}
