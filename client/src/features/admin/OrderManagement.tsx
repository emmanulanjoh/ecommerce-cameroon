import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Modal, Form, Select, Input, Space, Typography, Avatar, message } from 'antd';
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
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      console.log('[OrderManagement] Fetching orders...');
      const response = await axios.get('/api/orders/admin/all?limit=50');
      const orders = response.data.orders || [];
      setOrders(orders);
      console.log(`[OrderManagement] Successfully loaded ${Number(orders.length) || 0} orders`);
    } catch (error: any) {
      // Sanitize error message to prevent log injection
      const sanitizedError = error.response?.data || error.message || 'Unknown error';
      const cleanError = typeof sanitizedError === 'string' ? sanitizedError.replace(/[\r\n\t]/g, ' ').substring(0, 200) : 'Error object';
      console.error('❌ Error fetching orders:', cleanError);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (values: any) => {
    if (!selectedOrder) return;
    try {
      console.log(`[OrderManagement] Updating order ${selectedOrder._id.slice(-8)} from ${selectedOrder.status?.replace(/[\r\n\t]/g, ' ').substring(0, 50) || 'Unknown'} to ${values.status?.replace(/[\r\n\t]/g, ' ').substring(0, 50) || 'Unknown'}`);
      const response = await axios.put(`/api/orders/admin/${selectedOrder._id}/status`, values);
      const sanitizedStatus = values.status?.replace(/[\r\n\t]/g, ' ').replace(/[&<>"']/g, (char: string) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' }[char] || char)).substring(0, 50) || 'Unknown';
      const sanitizedTracking = values.trackingNumber?.replace(/[\r\n\t]/g, ' ').replace(/[&<>"']/g, (char: string) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' }[char] || char)).substring(0, 100) || 'N/A';
      console.log(`[OrderManagement] Order ${selectedOrder._id.slice(-8)} updated successfully - Status: ${sanitizedStatus}, Tracking: ${sanitizedTracking}, HTTP: ${Number(response.status) || 0}`);
      message.success('Order updated successfully!');
      fetchOrders();
      setModalVisible(false);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
      const sanitizedError = typeof errorMsg === 'string' ? errorMsg.replace(/[\r\n\t]/g, ' ').substring(0, 200) : 'Error object';
      console.error(`[OrderManagement] Failed to update order ${selectedOrder._id.slice(-8)}:`, sanitizedError);
      message.error('Failed to update order: ' + sanitizedError);
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
          <Button onClick={fetchOrders} loading={loading} style={{ marginTop: 10 }}>Refresh Orders</Button>
          {orders.length === 0 && !loading && (
            <div style={{ padding: 20, textAlign: 'center' }}>
              <Text type="secondary">No orders found.</Text>
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