import React from 'react';
import { Nav } from 'react-bootstrap';
import {
  DashboardOutlined,
  ShoppingOutlined,
  UserOutlined,
  BarChartOutlined,
  SettingOutlined,
  LogoutOutlined,
  CommentOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAdminLayout } from './AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

interface AdminSidebarProps {
  onMenuSelect: (key: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onMenuSelect }) => {
  const { collapsed, activeKey } = useAdminLayout();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'products',
      icon: <ShoppingOutlined />,
      label: 'Products',
    },
    {
      key: 'reviews',
      icon: <CommentOutlined />,
      label: 'Reviews',
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Users',
    },
    {
      key: 'analytics',
      icon: <BarChartOutlined />,
      label: 'Analytics',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          height: 64,
          margin: 16,
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {!collapsed && (
          <Title level={4} style={{ color: 'white', margin: 0 }}>
            E-Commerce
          </Title>
        )}
      </motion.div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[activeKey]}
        items={menuItems}
        onClick={({ key }) => onMenuSelect(key)}
        style={{ 
          borderRight: 0,
          background: 'transparent',
          color: 'white'
        }}
      />

      <div style={{ position: 'absolute', bottom: 16, width: '100%', padding: '0 16px' }}>
        <Menu
          theme="dark"
          mode="inline"
          items={[
            {
              key: 'logout',
              icon: <LogoutOutlined />,
              label: 'Logout',
              onClick: handleLogout,
            },
          ]}
          style={{ 
            borderRight: 0,
            background: 'transparent'
          }}
        />
      </div>
    </>
  );
};

export default AdminSidebar;