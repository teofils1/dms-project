
"use client";

import React from 'react';
import { Form, Input, Button, Card, message, InputNumber } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Proposal {
  id?: number;
  clientId: number;
  carId: number;
  proposedPrice: number;
  status: string;
}

const saveProposal = async (proposal: Proposal) => {
  const { data } = await axios.post('/api/proposals', proposal);
  return data;
};

const NewProposalPage = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const mutation = useMutation<Proposal, Error, Proposal>(saveProposal, {
    onSuccess: () => {
      message.success('Proposal created successfully!');
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      router.push('/proposals');
    },
    onError: (error) => {
      message.error(`Error creating proposal: ${error.message}`);
    },
  });

  const onFinish = (values: Proposal) => {
    mutation.mutate(values);
  };

  return (
    <Card title="Create New Proposal" style={{ maxWidth: 600, margin: 'auto' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="Client ID"
          name="clientId"
          rules={[{ required: true, message: 'Please input the client ID!' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="Car ID"
          name="carId"
          rules={[{ required: true, message: 'Please input the car ID!' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="Proposed Price"
          name="proposedPrice"
          rules={[{ required: true, message: 'Please input the proposed price!' }]}
        >
          <InputNumber style={{ width: '100%' }} formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as unknown as number} />
        </Form.Item>
        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: 'Please input the status!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={mutation.isPending}>
            Create Proposal
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default NewProposalPage;
