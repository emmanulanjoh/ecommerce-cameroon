import React, { createContext, useContext, useState, useEffect } from 'react';
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

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      if (mobile) {
        setCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setCollapsed]);

  return (
    <AdminLayoutContext.Provider value={{ collapsed, setCollapsed, activeKey, setActiveKey }}>
      <Layout style={{ minHeight: '100vh', overflow: 'hidden' }}>
        {children}
      </Layout>
    </AdminLayoutContext.Provider>
  );
};

const Sidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { collapsed, setCollapsed } = useAdminLayout();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return (
    <>
      {/* Mobile overlay */}
      {isMobile && !collapsed && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999,
          }}
          onClick={() => setCollapsed(true)}
        />
      )}
      
      <Layout.Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="light"
        breakpoint="md"
        collapsedWidth={isMobile ? 0 : 80}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: isMobile ? 1000 : 100,
          width: collapsed ? (isMobile ? 0 : 80) : 280,
          background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
          transform: isMobile && collapsed ? 'translateX(-100%)' : 'translateX(0)',
          transition: 'all 0.3s ease',
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
    </>
  );
};

const Header: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { collapsed } = useAdminLayout();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return (
    <Layout.Header
      style={{
        position: 'fixed',
        zIndex: 100,
        width: '100%',
        marginLeft: isMobile ? 0 : (collapsed ? 80 : 280),
        padding: isMobile ? '0 16px' : '0 24px',
        background: 'linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        borderBottom: '1px solid #dee2e6',
        transition: 'margin-left 0.3s ease',
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return (
    <Layout style={{ 
      marginLeft: isMobile ? 0 : (collapsed ? 80 : 280),
      transition: 'margin-left 0.3s ease'
    }}>
      <Layout.Content
        style={{
          margin: isMobile ? '88px 16px 24px' : '88px 24px 24px',
          overflow: 'initial',
          minHeight: 'calc(100vh - 112px)',
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