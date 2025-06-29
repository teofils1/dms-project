
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  const proposals = await prisma.proposal.findMany();
  return NextResponse.json(proposals);
}

export async function POST(request: Request) {
  const data = await request.json();
  const newProposal = await prisma.proposal.create({
    data,
  });
  return NextResponse.json(newProposal, { status: 201 });
}
