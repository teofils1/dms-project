
"use client";

import React, { useEffect } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

interface Client {
  id?: number;
  name: string;
  contactInfo: string;
  company: string;
}

const fetchClient = async (id: number): Promise<Client> => {
  const { data } = await axios.get(`/api/clients/${id}`);
  return data;
};

const saveClient = async (client: Client) => {
  if (client.id) {
    const { data } = await axios.put(`/api/clients/${client.id}`, client);
    return data;
  } else {
    const { data } = await axios.post('/api/clients', client);
    return data;
  }
};

const ClientFormPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id ? parseInt(params.id as string, 10) : null;
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: client, isLoading } = useQuery<Client>({ queryKey: ['client', id], queryFn: () => fetchClient(id as number), enabled: !!id });

  const mutation = useMutation<Client, Error, Client>(saveClient, {
    onSuccess: () => {
      message.success('Client saved successfully!');
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      router.push('/clients');
    },
    onError: (error) => {
      message.error(`Error saving client: ${error.message}`);
    },
  });

  useEffect(() => {
    if (client) {
      form.setFieldsValue(client);
    }
  }, [client, form]);

  const onFinish = (values: Client) => {
    mutation.mutate({ ...values, id: id || undefined });
  };

  if (isLoading && id) return <div>Loading client...</div>;

  return (
    <Card title={id ? "Edit Client" : "Create Client"} style={{ maxWidth: 600, margin: 'auto' }}>
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
            {id ? "Update Client" : "Create Client"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ClientFormPage;
