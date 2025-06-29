
"use client";

import React, { useEffect } from 'react';
import { Form, Input, Button, Card, message, InputNumber, DatePicker } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import dayjs from 'dayjs';

interface Acquisition {
  id?: number;
  source: string;
  carId: number;
  acquisitionCost: number;
  date: string;
  notes?: string;
}

const fetchAcquisition = async (id: number): Promise<Acquisition> => {
  const { data } = await axios.get(`/api/acquisitions/${id}`);
  return data;
};

const saveAcquisition = async (acquisition: Acquisition) => {
  if (acquisition.id) {
    const { data } = await axios.put(`/api/acquisitions/${acquisition.id}`, acquisition);
    return data;
  } else {
    const { data } = await axios.post('/api/acquisitions', acquisition);
    return data;
  }
};

const AcquisitionFormPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id ? parseInt(params.id as string, 10) : null;
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: acquisition, isLoading } = useQuery<Acquisition>({ queryKey: ['acquisition', id], queryFn: () => fetchAcquisition(id as number), enabled: !!id });

  const mutation = useMutation<Acquisition, Error, Acquisition>(saveAcquisition, {
    onSuccess: () => {
      message.success('Acquisition saved successfully!');
      queryClient.invalidateQueries({ queryKey: ['acquisitions'] });
      router.push('/acquisitions');
    },
    onError: (error) => {
      message.error(`Error saving acquisition: ${error.message}`);
    },
  });

  useEffect(() => {
    if (acquisition) {
      form.setFieldsValue({
        ...acquisition,
        date: dayjs(acquisition.date),
      });
    }
  }, [acquisition, form]);

  const onFinish = (values: any) => {
    const formattedValues = {
      ...values,
      date: values.date.toISOString(),
    };
    mutation.mutate({ ...formattedValues, id: id || undefined });
  };

  if (isLoading && id) return <div>Loading acquisition...</div>;

  return (
    <Card title={id ? "Edit Acquisition" : "Create Acquisition"} style={{ maxWidth: 600, margin: 'auto' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="Source"
          name="source"
          rules={[{ required: true, message: 'Please input the source!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Car ID"
          name="carId"
          rules={[{ required: true, message: 'Please input the car ID!' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="Acquisition Cost"
          name="acquisitionCost"
          rules={[{ required: true, message: 'Please input the acquisition cost!' }]}
        >
          <InputNumber style={{ width: '100%' }} formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as unknown as number} />
        </Form.Item>
        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: 'Please input the date!' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="Notes"
          name="notes"
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={mutation.isPending}>
            {id ? "Update Acquisition" : "Create Acquisition"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AcquisitionFormPage;
