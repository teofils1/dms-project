
"use client";

import React from 'react';
import { Table, Button, Space } from 'antd';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';

interface Car {
  id: number;
  vin: string;
  make: string;
  model: string;
  year: number;
  status: string;
  price: number;
  acquisitionDate: string;
  createdAt: string;
  updatedAt: string;
}

const fetchCars = async (): Promise<Car[]> => {
  const { data } = await axios.get('/api/cars');
  return data;
};

const CarsList = () => {
  const { data: cars, isLoading, error } = useQuery<Car[]>({ queryKey: ['cars'], queryFn: fetchCars });

  const columns = [
    {
      title: 'VIN',
      dataIndex: 'vin',
      key: 'vin',
    },
    {
      title: 'Make',
      dataIndex: 'make',
      key: 'make',
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Car) => (
        <Space size="middle">
          <Link href={`/cars/${record.id}`}>Edit</Link>
          {/* Add delete functionality later */}
        </Space>
      ),
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Cars</h1>
      <Button type="primary" style={{ marginBottom: 16 }}>
        <Link href="/cars/new">Add New Car</Link>
      </Button>
      <Table columns={columns} dataSource={cars} rowKey="id" />
    </div>
  );
};

export default CarsList;
