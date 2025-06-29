
"use client";

import React, { useEffect } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

interface Lead {
  id?: number;
  name: string;
  contactInfo: string;
  status: string;
  assignedTo: string;
}

const fetchLead = async (id: number): Promise<Lead> => {
  const { data } = await axios.get(`/api/leads/${id}`);
  return data;
};

const saveLead = async (lead: Lead) => {
  if (lead.id) {
    const { data } = await axios.put(`/api/leads/${lead.id}`, lead);
    return data;
  } else {
    const { data } = await axios.post('/api/leads', lead);
    return data;
  }
};

const LeadFormPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id ? parseInt(params.id as string, 10) : null;
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: lead, isLoading } = useQuery<Lead>({ queryKey: ['lead', id], queryFn: () => fetchLead(id as number), enabled: !!id });

  const mutation = useMutation<Lead, Error, Lead>(saveLead, {
    onSuccess: () => {
      message.success('Lead saved successfully!');
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      router.push('/leads');
    },
    onError: (error) => {
      message.error(`Error saving lead: ${error.message}`);
    },
  });

  useEffect(() => {
    if (lead) {
      form.setFieldsValue(lead);
    }
  }, [lead, form]);

  const onFinish = (values: Lead) => {
    mutation.mutate({ ...values, id: id || undefined });
  };

  if (isLoading && id) return <div>Loading lead...</div>;

  return (
    <Card title={id ? "Edit Lead" : "Create Lead"} style={{ maxWidth: 600, margin: 'auto' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={lead || { status: 'New', assignedTo: 'Unassigned' }} // Default values for new lead
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
            {id ? "Update Lead" : "Create Lead"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default LeadFormPage;
