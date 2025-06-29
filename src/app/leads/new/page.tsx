
"use client";

import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Lead {
  id?: number;
  name: string;
  contactInfo: string;
  status: string;
  assignedTo: string;
}

const saveLead = async (lead: Lead) => {
  const { data } = await axios.post('/api/leads', lead);
  return data;
};

const NewLeadPage = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const mutation = useMutation<Lead, Error, Lead>(saveLead, {
    onSuccess: () => {
      message.success('Lead created successfully!');
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      router.push('/leads');
    },
    onError: (error) => {
      message.error(`Error creating lead: ${error.message}`);
    },
  });

  const onFinish = (values: Lead) => {
    mutation.mutate(values);
  };

  return (
    <Card title="Create New Lead" style={{ maxWidth: 600, margin: 'auto' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ status: 'New', assignedTo: 'Unassigned' }} // Default values for new lead
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input the lead's name!' }]}
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
          label="Status"
          name="status"
          rules={[{ required: true, message: 'Please input the status!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Assigned To"
          name="assignedTo"
          rules={[{ required: true, message: 'Please input who the lead is assigned to!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={mutation.isPending}>
            Create Lead
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default NewLeadPage;
