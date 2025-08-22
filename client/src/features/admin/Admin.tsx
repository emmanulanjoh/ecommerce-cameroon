import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AdminLayout from './AdminLayout';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminDashboard from './AdminDashboard';
import { ProductList } from '../products';
import ReviewManagement from './ReviewManagement';
import OrderManagement from './OrderManagement';
import 'antd/dist/reset.css';

const queryClient = new QueryClient();

const Admin: React.FC = () => {
  const [activeKey, setActiveKey] = useState('dashboard');

  const renderContent = () => {
    switch (activeKey) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'orders':
        return <OrderManagement />;
      case 'products':
        return <ProductList />;
      case 'reviews':
        return <ReviewManagement />;
      case 'users':
        return <div>User management coming soon...</div>;
      case 'analytics':
        return <div>Analytics coming soon...</div>;
      case 'settings':
        return <div>Settings coming soon...</div>;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AdminLayout>
        <AdminLayout.Sidebar>
          <AdminSidebar onMenuSelect={setActiveKey} />
        </AdminLayout.Sidebar>
        
        <AdminLayout.Header>
          <AdminHeader />
        </AdminLayout.Header>
        
        <AdminLayout.Content>
          {renderContent()}
        </AdminLayout.Content>
      </AdminLayout>
    </QueryClientProvider>
  );
};

export default Admin;