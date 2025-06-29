
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const client = await prisma.client.findUnique({
    where: { id: parseInt(params.id, 10) },
  });
  if (client) {
    return NextResponse.json(client);
  } else {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const data = await request.json();
  const updatedClient = await prisma.client.update({
    where: { id: parseInt(params.id, 10) },
    data,
  });
  return NextResponse.json(updatedClient);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await prisma.client.delete({
    where: { id: parseInt(params.id, 10) },
  });
  return new Response(null, { status: 204 });
}
