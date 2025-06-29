
"use client";

import React from 'react';
import { Table, Button, Space } from 'antd';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';

interface Client {
  id: number;
  name: string;
  contactInfo: string;
  company: string;
  createdAt: string;
  updatedAt: string;
}

const fetchClients = async (): Promise<Client[]> => {
  const { data } = await axios.get('/api/clients');
  return data;
};

const ClientsList = () => {
  const { data: clients, isLoading, error } = useQuery<Client[]>({ queryKey: ['clients'], queryFn: fetchClients });

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
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Client) => (
        <Space size="middle">
          <Link href={`/clients/${record.id}`}>Edit</Link>
          {/* Add delete functionality later */}
        </Space>
      ),
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Clients</h1>
      <Button type="primary" style={{ marginBottom: 16 }}>
        <Link href="/clients/new">Add New Client</Link>
      </Button>
      <Table columns={columns} dataSource={clients} rowKey="id" />
    </div>
  );
};

export default ClientsList;
