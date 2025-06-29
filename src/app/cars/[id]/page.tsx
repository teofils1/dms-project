
"use client";

import React, { useEffect } from 'react';
import { Form, Input, Button, Card, message, InputNumber, DatePicker } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import dayjs from 'dayjs';

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

const fetchCar = async (id: number): Promise<Car> => {
  const { data } = await axios.get(`/api/cars/${id}`);
  return data;
};

const saveCar = async (car: Car) => {
  if (car.id) {
    const { data } = await axios.put(`/api/cars/${car.id}`, car);
    return data;
  } else {
    const { data } = await axios.post('/api/cars', car);
    return data;
  }
};

const CarFormPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id ? parseInt(params.id as string, 10) : null;
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: car, isLoading } = useQuery<Car>({ queryKey: ['car', id], queryFn: () => fetchCar(id as number), enabled: !!id });

  const mutation = useMutation<Car, Error, Car>(saveCar, {
    onSuccess: () => {
      message.success('Car saved successfully!');
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      router.push('/cars');
    },
    onError: (error) => {
      message.error(`Error saving car: ${error.message}`);
    },
  });

  useEffect(() => {
    if (car) {
      form.setFieldsValue({
        ...car,
        acquisitionDate: dayjs(car.acquisitionDate),
      });
    }
  }, [car, form]);

  const onFinish = (values: any) => {
    const formattedValues = {
      ...values,
      acquisitionDate: values.acquisitionDate.toISOString(),
    };
    mutation.mutate({ ...formattedValues, id: id || undefined });
  };

  if (isLoading && id) return <div>Loading car...</div>;

  return (
    <Card title={id ? "Edit Car" : "Create Car"} style={{ maxWidth: 600, margin: 'auto' }}>
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
            {id ? "Update Car" : "Create Car"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CarFormPage;
