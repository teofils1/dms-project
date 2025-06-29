
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const proposal = await prisma.proposal.findUnique({
    where: { id: parseInt(params.id, 10) },
  });
  if (proposal) {
    return NextResponse.json(proposal);
  } else {
    return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const data = await request.json();
  const updatedProposal = await prisma.proposal.update({
    where: { id: parseInt(params.id, 10) },
    data,
  });
  return NextResponse.json(updatedProposal);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await prisma.proposal.delete({
    where: { id: parseInt(params.id, 10) },
  });
  return new Response(null, { status: 204 });
}
