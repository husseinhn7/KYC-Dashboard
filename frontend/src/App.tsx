import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { store } from './app/store';

// Components
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import PrivateRoute from './routes/PrivateRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import KYCList from './pages/KYCList';
import KYCDetails from './pages/KYCDetails';
import Transactions from './pages/Transactions';
import AuditLogs from './pages/AuditLogs';
import Settings from './pages/Settings';
import Unauthorized from './pages/Unauthorized';
import NotFound from "./pages/NotFound";

// Main Layout Component
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <Provider store={store}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/kyc" 
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <KYCList />
                </DashboardLayout>
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/kyc/:id" 
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <KYCDetails />
                </DashboardLayout>
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/transactions" 
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Transactions />
                </DashboardLayout>
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/audit-logs" 
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <AuditLogs />
                </DashboardLayout>
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/settings" 
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Settings />
                </DashboardLayout>
              </PrivateRoute>
            } 
          />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </Provider>
);

export default App;
