import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  FileText, 
  Settings, 
  Shield,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { RootState } from '../app/store';
import type { UserRole } from '../types';
import { canAccessRoute } from '../utils/roleUtils';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const role = useSelector((state: RootState) => state.auth.role) as UserRole | undefined;
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Verification Cases',
      href: '/kyc',
      icon: Shield,
    },
    {
      name: 'Transactions',
      href: '/transactions',
      icon: ArrowLeftRight,
    },
    {
      name: 'Audit Logs',
      href: '/audit-logs',
      icon: FileText,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ].filter(item => role && canAccessRoute(role, item.href));

  return (
    <div className={cn(
      "bg-card border-r border-border flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold text-foreground">KYC Admin</h1>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    collapsed && "justify-center"
                  )}
                >
                  <Icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                  {!collapsed && <span>{item.name}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {/* Remove user info from footer since user is not in state */}
    </div>
  );
};

export default Sidebar;