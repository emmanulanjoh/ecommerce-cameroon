import React, { useState, useEffect } from 'react';
import { Space, Avatar, Dropdown, Typography, Button, Badge } from 'antd';
import {
  UserOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAdminLayout } from './AdminLayout';
import { useAuth } from '../../context/AuthContext';

const { Text } = Typography;

const AdminHeader: React.FC = () => {
  const { collapsed, setCollapsed } = useAdminLayout();
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Profile',
    },
    {
      key: 'settings',
      label: 'Settings',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: 'Logout',
      danger: true,
    },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
      <Space>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: '16px',
            width: 64,
            height: 64,
          }}
        />
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Text strong style={{ fontSize: '18px' }}>
              Admin Dashboard
            </Text>
          </motion.div>
        )}
      </Space>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Space size={isMobile ? 'small' : 'middle'}>
          {!isMobile && (
            <Badge count={5} size="small">
              <Button
                type="text"
                icon={<BellOutlined style={{ fontSize: '18px' }} />}
                style={{ height: 40, width: 40 }}
              />
            </Badge>
          )}

          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            arrow
          >
            <Space style={{ cursor: 'pointer', padding: '8px 12px', borderRadius: '6px' }}>
              <Avatar icon={<UserOutlined />} />
              {!isMobile && (
                <div style={{ textAlign: 'left' }}>
                  <Text strong>{user?.username || 'Admin'}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Administrator
                  </Text>
                </div>
              )}
            </Space>
          </Dropdown>
        </Space>
      </motion.div>
    </div>
  );
};

export default AdminHeader;