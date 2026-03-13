import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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

  const { university, graduationYear, targetRole, prepBackground } = await req.json();

  const profile = await prisma.userProfile.upsert({
    where: { userId: session.user.id },
    update: {
      university,
      graduationYear: graduationYear ? parseInt(graduationYear, 10) : null,
      targetRole,
      prepBackground,
      completedAt: new Date(),
    },
    create: {
      userId: session.user.id,
      university,
      graduationYear: graduationYear ? parseInt(graduationYear, 10) : null,
      targetRole,
      prepBackground,
      completedAt: new Date(),
    },
  });

  return NextResponse.json({ profile });
}
