
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  const clients = await prisma.client.findMany();
  return NextResponse.json(clients);
}

export async function POST(request: Request) {
  const data = await request.json();
  const newClient = await prisma.client.create({
    data,
  });
  return NextResponse.json(newClient, { status: 201 });
}
