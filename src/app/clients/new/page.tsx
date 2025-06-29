
"use client";

import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Client {
  id?: number;
  name: string;
  contactInfo: string;
  company: string;
}

const saveClient = async (client: Client) => {
  const { data } = await axios.post('/api/clients', client);
  return data;
};

const NewClientPage = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const mutation = useMutation<Client, Error, Client>(saveClient, {
    onSuccess: () => {
      message.success('Client created successfully!');
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      router.push('/clients');
    },
    onError: (error) => {
      message.error(`Error creating client: ${error.message}`);
    },
  });

  const onFinish = (values: Client) => {
    mutation.mutate(values);
  };

  return (
    <Card title="Create New Client" style={{ maxWidth: 600, margin: 'auto' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input the client's name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Contact Info"
          name="contactInfo"
          rules={[{ required: true, message: 'Please input the contact info!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Company"
          name="company"
          rules={[{ required: true, message: 'Please input the company!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={mutation.isPending}>
            Create Client
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default NewClientPage;
