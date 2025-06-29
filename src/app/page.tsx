"use client";

import React from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import { useSession } from 'next-auth/react';

const Dashboard = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>
      <h1>Welcome, {session?.user?.name || 'Guest'}!</h1>
      <p>This is your DMS Dashboard.</p>

      <Row gutter={16}>
        <Col span={12}>
          <Card>
            <Statistic title="Total Leads" value={112893} />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic title="Total Clients" value={112893} precision={2} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;