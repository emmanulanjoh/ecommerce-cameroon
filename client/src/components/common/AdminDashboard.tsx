import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import {
  ShoppingCartOutlined,
  AppstoreOutlined,
  StarOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const { Title, Text } = Typography;

const AdminDashboard: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [products] = await Promise.all([
        axios.get('/api/products'),
      ]);
      
      return {
        totalProducts: products.data.pagination?.total || products.data.products?.length || 0,
        totalCategories: 10,
        featuredProducts: products.data.products?.filter((p: any) => p.featured)?.length || 0,
        inStockProducts: products.data.products?.filter((p: any) => p.inStock)?.length || 0,
      };
    },
  });

  const lowStockProducts = [
    {
      id: '1',
      name: 'Samsung Galaxy A54',
      category: 'Electronics',
      stock: 3,
      image: '/images/placeholder.svg',
    },
    {
      id: '2',
      name: 'Laptop Pro',
      category: 'Computers',
      stock: 2,
      image: '/images/placeholder.svg',
    },
    {
      id: '3',
      name: 'Wireless Headphones',
      category: 'Accessories',
      stock: 1,
      image: '/images/placeholder.svg',
    },
  ];

  const categoryStats = [
    { name: 'Electronics', count: 45, color: '#1890ff' },
    { name: 'Clothing', count: 32, color: '#52c41a' },
    { name: 'Home & Kitchen', count: 28, color: '#faad14' },
    { name: 'Beauty & Personal Care', count: 21, color: '#f5222d' },
    { name: 'Sports & Outdoors', count: 18, color: '#722ed1' },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        {[
          {
            title: 'Total Products',
            value: stats?.totalProducts || 0,
            icon: <ShoppingCartOutlined />,
            color: '#1890ff',
          },
          {
            title: 'Categories',
            value: stats?.totalCategories || 0,
            icon: <AppstoreOutlined />,
            color: '#52c41a',
          },
          {
            title: 'Featured Products',
            value: stats?.featuredProducts || 0,
            icon: <StarOutlined />,
            color: '#faad14',
          },
          {
            title: 'In Stock',
            value: stats?.inStockProducts || 0,
            icon: <CheckCircleOutlined />,
            color: '#f5222d',
          },
        ].map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={stat.title}>
            <motion.div
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <Card>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  valueStyle={{ color: stat.color }}
                  suffix={stat.icon}
                  loading={isLoading}
                />
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card 
              title={<><ExclamationCircleOutlined style={{ color: '#faad14', marginRight: 8 }} />Low Stock Alert</>} 
              style={{ height: '100%' }}
            >
              <List
                itemLayout="horizontal"
                dataSource={lowStockProducts}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={item.image} icon={<ShoppingCartOutlined />} />}
                      title={item.name}
                      description={`${item.category} • Only ${item.stock} left in stock`}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Card title="Category Distribution" style={{ height: '100%' }}>
              <div style={{ padding: '10px 0' }}>
                {categoryStats.map((category, index) => (
                  <div key={category.name} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text>{category.name}</Text>
                      <Text strong>{category.count} products</Text>
                    </div>
                    <Progress 
                      percent={(category.count / 45) * 100} 
                      strokeColor={category.color}
                      showInfo={false}
                      size="small"
                    />
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;