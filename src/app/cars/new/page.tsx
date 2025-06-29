
"use client";

import React from 'react';
import { Form, Input, Button, Card, message, InputNumber, DatePicker } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Car {
  id?: number;
  vin: string;
  make: string;
  model: string;
  year: number;
  status: string;
  price: number;
  acquisitionDate: string;
}

const saveCar = async (car: Car) => {
  const { data } = await axios.post('/api/cars', car);
  return data;
};

const NewCarPage = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const mutation = useMutation<Car, Error, Car>(saveCar, {
    onSuccess: () => {
      message.success('Car created successfully!');
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      router.push('/cars');
    },
    onError: (error) => {
      message.error(`Error creating car: ${error.message}`);
    },
  });

  const onFinish = (values: any) => {
    const formattedValues = {
      ...values,
      acquisitionDate: values.acquisitionDate.toISOString(),
    };
    mutation.mutate(formattedValues);
  };

  return (
    <Card title="Create New Car" style={{ maxWidth: 600, margin: 'auto' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="VIN"
          name="vin"
          rules={[{ required: true, message: 'Please input the VIN!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Make"
          name="make"
          rules={[{ required: true, message: 'Please input the make!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Model"
          name="model"
          rules={[{ required: true, message: 'Please input the model!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Year"
          name="year"
          rules={[{ required: true, message: 'Please input the year!' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: 'Please input the status!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: 'Please input the price!' }]}
        >
          <InputNumber style={{ width: '100%' }} formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as unknown as number} />
        </Form.Item>
        <Form.Item
          label="Acquisition Date"
          name="acquisitionDate"
          rules={[{ required: true, message: 'Please input the acquisition date!' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={mutation.isPending}>
            Create Car
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default NewCarPage;
