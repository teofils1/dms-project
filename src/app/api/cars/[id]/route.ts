
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const car = await prisma.car.findUnique({
    where: { id: parseInt(params.id, 10) },
  });
  if (car) {
    return NextResponse.json(car);
  } else {
    return NextResponse.json({ error: 'Car not found' }, { status: 404 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const data = await request.json();
  const updatedCar = await prisma.car.update({
    where: { id: parseInt(params.id, 10) },
    data,
  });
  return NextResponse.json(updatedCar);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await prisma.car.delete({
    where: { id: parseInt(params.id, 10) },
  });
  return new Response(null, { status: 204 });
}
