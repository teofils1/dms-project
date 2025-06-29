
"use client";

import React from 'react';
import { Table, Button, Space } from 'antd';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';

interface Acquisition {
  id: number;
  source: string;
  carId: number;
  acquisitionCost: number;
  date: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const fetchAcquisitions = async (): Promise<Acquisition[]> => {
  const { data } = await axios.get('/api/acquisitions');
  return data;
};

const AcquisitionsList = () => {
  const { data: acquisitions, isLoading, error } = useQuery<Acquisition[]>({ queryKey: ['acquisitions'], queryFn: fetchAcquisitions });

  const columns = [
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
    },
    {
      title: 'Car ID',
      dataIndex: 'carId',
      key: 'carId',
    },
    {
      title: 'Acquisition Cost',
      dataIndex: 'acquisitionCost',
      key: 'acquisitionCost',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Acquisition) => (
        <Space size="middle">
          <Link href={`/acquisitions/${record.id}`}>Edit</Link>
          {/* Add delete functionality later */}
        </Space>
      ),
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Acquisitions</h1>
      <Button type="primary" style={{ marginBottom: 16 }}>
        <Link href="/acquisitions/new">Add New Acquisition</Link>
      </Button>
      <Table columns={columns} dataSource={acquisitions} rowKey="id" />
    </div>
  );
};

export default AcquisitionsList;
