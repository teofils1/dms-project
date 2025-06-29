
"use client";

import React from 'react';
import { Table, Button, Space } from 'antd';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';

interface Proposal {
  id: number;
  clientId: number;
  carId: number;
  proposedPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const fetchProposals = async (): Promise<Proposal[]> => {
  const { data } = await axios.get('/api/proposals');
  return data;
};

const ProposalsList = () => {
  const { data: proposals, isLoading, error } = useQuery<Proposal[]>({ queryKey: ['proposals'], queryFn: fetchProposals });

  const columns = [
    {
      title: 'Client ID',
      dataIndex: 'clientId',
      key: 'clientId',
    },
    {
      title: 'Car ID',
      dataIndex: 'carId',
      key: 'carId',
    },
    {
      title: 'Proposed Price',
      dataIndex: 'proposedPrice',
      key: 'proposedPrice',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Proposal) => (
        <Space size="middle">
          <Link href={`/proposals/${record.id}`}>Edit</Link>
          {/* Add delete functionality later */}
        </Space>
      ),
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Proposals</h1>
      <Button type="primary" style={{ marginBottom: 16 }}>
        <Link href="/proposals/new">Add New Proposal</Link>
      </Button>
      <Table columns={columns} dataSource={proposals} rowKey="id" />
    </div>
  );
};

export default ProposalsList;
