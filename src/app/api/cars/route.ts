
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  const cars = await prisma.car.findMany();
  return NextResponse.json(cars);
}

export async function POST(request: Request) {
  const data = await request.json();
  const newCar = await prisma.car.create({
    data,
  });
  return NextResponse.json(newCar, { status: 201 });
}
