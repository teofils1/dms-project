
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const lead = await prisma.lead.findUnique({
    where: { id: parseInt(params.id, 10) },
  });
  if (lead) {
    return NextResponse.json(lead);
  } else {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const data = await request.json();
  const updatedLead = await prisma.lead.update({
    where: { id: parseInt(params.id, 10) },
    data,
  });
  return NextResponse.json(updatedLead);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await prisma.lead.delete({
    where: { id: parseInt(params.id, 10) },
  });
  return new Response(null, { status: 204 });
}
