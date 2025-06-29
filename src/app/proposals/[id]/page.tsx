
"use client";

import React, { useEffect } from 'react';
import { Form, Input, Button, Card, message, InputNumber } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

interface Proposal {
  id?: number;
  clientId: number;
  carId: number;
  proposedPrice: number;
  status: string;
}

const fetchProposal = async (id: number): Promise<Proposal> => {
  const { data } = await axios.get(`/api/proposals/${id}`);
  return data;
};

const saveProposal = async (proposal: Proposal) => {
  if (proposal.id) {
    const { data } = await axios.put(`/api/proposals/${proposal.id}`, proposal);
    return data;
  } else {
    const { data } = await axios.post('/api/proposals', proposal);
    return data;
  }
};

const ProposalFormPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id ? parseInt(params.id as string, 10) : null;
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: proposal, isLoading } = useQuery<Proposal>({ queryKey: ['proposal', id], queryFn: () => fetchProposal(id as number), enabled: !!id });

  const mutation = useMutation<Proposal, Error, Proposal>(saveProposal, {
    onSuccess: () => {
      message.success('Proposal saved successfully!');
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      router.push('/proposals');
    },
    onError: (error) => {
      message.error(`Error saving proposal: ${error.message}`);
    },
  });

  useEffect(() => {
    if (proposal) {
      form.setFieldsValue(proposal);
    }
  }, [proposal, form]);

  const onFinish = (values: Proposal) => {
    mutation.mutate({ ...values, id: id || undefined });
  };

  if (isLoading && id) return <div>Loading proposal...</div>;

  return (
    <Card title={id ? "Edit Proposal" : "Create Proposal"} style={{ maxWidth: 600, margin: 'auto' }}>
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
            {id ? "Update Proposal" : "Create Proposal"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ProposalFormPage;
