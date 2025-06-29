
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const acquisition = await prisma.acquisition.findUnique({
    where: { id: parseInt(params.id, 10) },
  });
  if (acquisition) {
    return NextResponse.json(acquisition);
  } else {
    return NextResponse.json({ error: 'Acquisition not found' }, { status: 404 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const data = await request.json();
  const updatedAcquisition = await prisma.acquisition.update({
    where: { id: parseInt(params.id, 10) },
    data,
  });
  return NextResponse.json(updatedAcquisition);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await prisma.acquisition.delete({
    where: { id: parseInt(params.id, 10) },
  });
  return new Response(null, { status: 204 });
}
