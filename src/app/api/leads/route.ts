
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  const leads = await prisma.lead.findMany();
  return NextResponse.json(leads);
}

export async function POST(request: Request) {
  const data = await request.json();
  const newLead = await prisma.lead.create({
    data,
  });
  return NextResponse.json(newLead, { status: 201 });
}
