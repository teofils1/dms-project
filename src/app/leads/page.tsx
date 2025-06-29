
"use client";

import React from 'react';
import { Table, Button, Space } from 'antd';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';

interface Lead {
  id: number;
  name: string;
  contactInfo: string;
  status: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
}

const fetchLeads = async (): Promise<Lead[]> => {
  const { data } = await axios.get('/api/leads');
  return data;
};

const LeadsList = () => {
  const { data: leads, isLoading, error } = useQuery<Lead[]>({ queryKey: ['leads'], queryFn: fetchLeads });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Contact Info',
      dataIndex: 'contactInfo',
      key: 'contactInfo',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Lead) => (
        <Space size="middle">
          <Link href={`/leads/${record.id}`}>Edit</Link>
          {/* Add delete functionality later */}
        </Space>
      ),
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Leads</h1>
      <Button type="primary" style={{ marginBottom: 16 }}>
        <Link href="/leads/new">Add New Lead</Link>
      </Button>
      <Table columns={columns} dataSource={leads} rowKey="id" />
    </div>
  );
};

export default LeadsList;
