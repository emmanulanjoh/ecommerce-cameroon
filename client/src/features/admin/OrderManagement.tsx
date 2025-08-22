import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Modal, Form, Select, Input, Space, Typography, Avatar } from 'antd';
import { EyeOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

interface Order {
  _id: string;
  user: { name: string; email: string; };
  items: Array<{ product: { nameEn: string; }; quantity: number; price: number; }>;
  totalAmount: number;
  status: string;
  createdAt: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    region: string;
    country: string;
    phone?: string;
  };
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const checkAdminAuth = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) {
        console.error('❌ No token found - admin login required');
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get('/api/users/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.data.isAdmin) {
          console.log('✅ Admin authenticated:', response.data.email);
          fetchOrders();
        } else {
          console.error('❌ User is not admin');
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Admin auth check failed:', error);
        setLoading(false);
      }
    };
    
    checkAdminAuth();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        console.error('❌ No authentication token found');
        setLoading(false);
        return;
      }
      
      const response = await axios.get('/api/orders/admin/all?limit=50', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setOrders(response.data.orders || []);
    } catch (error: any) {
      console.error('❌ Error:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        console.error('Authentication failed - please login as admin');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (values: any) => {
    if (!selectedOrder) return;
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        console.error('No authentication token');
        return;
      }
      
      await axios.put(`/api/orders/admin/${selectedOrder._id}/status`, values, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchOrders();
      setModalVisible(false);
    } catch (error: any) {
      console.error('Error updating order:', error.response?.data || error.message);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF' }).format(price);
  };

  const getStatusColor = (status: string) => {
    const colors = { pending: 'orange', confirmed: 'blue', processing: 'cyan', shipped: 'purple', delivered: 'green', cancelled: 'red' };
    return colors[status as keyof typeof colors] || 'default';
  };

  const columns = [
    { title: 'Order ID', dataIndex: '_id', render: (id: string) => <Text code>#{id.slice(-8)}</Text> },
    { 
      title: 'Customer', 
      dataIndex: 'user', 
      render: (user: any, record: Order) => (
        <Space direction="vertical" size={0}>
          <Space><Avatar icon={<UserOutlined />} /><Text strong>{user.name}</Text></Space>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.shippingAddress?.city || 'N/A'}</Text>
        </Space>
      )
    },
    { title: 'Items', dataIndex: 'items', render: (items: any[]) => <Tag>{items.length} items</Tag> },
    { title: 'Total', dataIndex: 'totalAmount', render: (amount: number) => <Text strong>{formatPrice(amount)}</Text> },
    { title: 'Status', dataIndex: 'status', render: (status: string) => <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag> },
    { title: 'Date', dataIndex: 'createdAt', render: (date: string) => new Date(date).toLocaleDateString() },
    { title: 'Actions', render: (_: any, record: Order) => <Button type="primary" icon={<EyeOutlined />} onClick={() => { setSelectedOrder(record); form.setFieldsValue({ status: record.status }); setModalVisible(true); }}>View</Button> }
  ];

  return (
    <div>
      <Card>
        <Title level={3}>Order Management</Title>
        <div style={{ marginBottom: 16 }}>
          <Text>Orders found: {orders.length}</Text>
          <br />
          <Text type="secondary">Token: {localStorage.getItem('userToken') ? '✅ Present' : '❌ Missing'}</Text>
          {orders.length === 0 && !loading && (
            <div style={{ padding: 20, textAlign: 'center' }}>
              <Text type="secondary">No orders found. Check browser console (F12) for errors.</Text>
              <br />
              <Button onClick={fetchOrders} style={{ marginTop: 10 }}>Retry</Button>
            </div>
          )}
        </div>
        <Table columns={columns} dataSource={orders} rowKey="_id" loading={loading} />
      </Card>

      <Modal title={`Order #${selectedOrder?._id.slice(-8)}`} open={modalVisible} onCancel={() => setModalVisible(false)} footer={null}>
        {selectedOrder && (
          <div>
            <p><strong>Customer:</strong> {selectedOrder.user.name} ({selectedOrder.user.email})</p>
            {selectedOrder.shippingAddress && (
              <p><strong>Address:</strong> {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.region}</p>
            )}
            <p><strong>Total:</strong> {formatPrice(selectedOrder.totalAmount)}</p>
            <Form form={form} onFinish={handleStatusUpdate}>
              <Form.Item name="status" label="Status">
                <Select>
                  <Select.Option value="pending">Pending</Select.Option>
                  <Select.Option value="confirmed">Confirmed</Select.Option>
                  <Select.Option value="processing">Processing</Select.Option>
                  <Select.Option value="shipped">Shipped</Select.Option>
                  <Select.Option value="delivered">Delivered</Select.Option>
                  <Select.Option value="cancelled">Cancelled</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="trackingNumber" label="Tracking Number">
                <Input placeholder="Enter tracking number" />
              </Form.Item>
              <Button type="primary" htmlType="submit" icon={<EditOutlined />}>Update Order</Button>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderManagement;