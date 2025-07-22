import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LogOut, User } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { RootState } from '../app/store';
import { logout } from '../features/auth/authSlice';
import { getRoleColor } from '../utils/roleUtils';

const Topbar: React.FC = () => {
  const dispatch = useDispatch();
  const { role } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!role) return null;

  const initials = role
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - could add breadcrumbs or page title here */}
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-semibold text-foreground">
            Multi-Region KYC Dashboard
          </h2>
        </div>

        {/* Right side - User menu */}
        <div className="flex items-center space-x-4">
          {/* User role badge */}
          <Badge className={getRoleColor(role)}>
            {role}
          </Badge>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="px-2 py-2">
                <p className="text-sm font-medium">{role}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Topbar;