
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  const acquisitions = await prisma.acquisition.findMany();
  return NextResponse.json(acquisitions);
}

export async function POST(request: Request) {
  const data = await request.json();
  const newAcquisition = await prisma.acquisition.create({
    data,
  });
  return NextResponse.json(newAcquisition, { status: 201 });
}
