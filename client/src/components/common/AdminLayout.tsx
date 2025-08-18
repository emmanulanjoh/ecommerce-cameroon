import React, { createContext, useContext, useState } from 'react';
import { Layout } from 'antd';
import { motion } from 'framer-motion';

interface AdminLayoutContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  activeKey: string;
  setActiveKey: (key: string) => void;
}

const AdminLayoutContext = createContext<AdminLayoutContextType | undefined>(undefined);

export const useAdminLayout = () => {
  const context = useContext(AdminLayoutContext);
  if (!context) {
    throw new Error('useAdminLayout must be used within AdminLayout');
  }
  return context;
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> & {
  Sidebar: React.FC<{ children: React.ReactNode }>;
  Header: React.FC<{ children: React.ReactNode }>;
  Content: React.FC<{ children: React.ReactNode }>;
} = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState('dashboard');

  return (
    <AdminLayoutContext.Provider value={{ collapsed, setCollapsed, activeKey, setActiveKey }}>
      <Layout style={{ minHeight: '100vh' }}>
        {children}
      </Layout>
    </AdminLayoutContext.Provider>
  );
};

const Sidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { collapsed } = useAdminLayout();
  
  return (
    <Layout.Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(collapsed) => {}}
      theme="light"
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: collapsed ? 80 : 280,
        background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </Layout.Sider>
  );
};

const Header: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { collapsed } = useAdminLayout();
  
  return (
    <Layout.Header
      style={{
        position: 'fixed',
        zIndex: 1,
        width: '100%',
        marginLeft: collapsed ? 80 : 280,
        padding: '0 24px',
        background: 'linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        borderBottom: '1px solid #dee2e6',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ height: '100%', display: 'flex', alignItems: 'center' }}
      >
        {children}
      </motion.div>
    </Layout.Header>
  );
};

const Content: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { collapsed } = useAdminLayout();
  
  return (
    <Layout style={{ marginLeft: collapsed ? 80 : 280 }}>
      <Layout.Content
        style={{
          margin: '88px 24px 24px',
          overflow: 'initial',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </Layout.Content>
    </Layout>
  );
};

AdminLayout.Sidebar = Sidebar;
AdminLayout.Header = Header;
AdminLayout.Content = Content;

export default AdminLayout;