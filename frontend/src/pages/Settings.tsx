import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Save, Shield, User, Globe, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { RootState } from '../app/store';
import { hasPermission, getRoleColor } from '../utils/roleUtils';
import { toast } from '../hooks/use-toast';
import { useGetMeQuery } from '@/services/apiSlice';
import { UserRole } from '@/types';

const Settings: React.FC = () => {
  const { role, token } = useSelector((state: RootState) => state.auth);
  const { data: user, isLoading } = useGetMeQuery();
  
  const [formData, setFormData] = useState({
    name: '', // user?.name || '', // This line was removed as per the edit hint
    email: '', // user?.email || '', // This line was removed as per the edit hint
    region: '', // user?.region || '', // This line was removed as per the edit hint
  });
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        region: user.region || '',
      });
    }
    console.log(user);
  }, [user, isLoading]);
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    weeklyReports: true,
  });


  if (!token) return null; // Changed from user to token

  const canModifySettings = hasPermission(role as UserRole, 'canModifySettings');

  const handleSaveProfile = async () => {
   
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
    
  };

  const handleSaveNotifications = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    toast({
      title: "Notification Settings Updated",
      description: "Your notification preferences have been saved.",
    });
    
  };

  const regions = [
    'North America',
    'Latin America',
    'Europe',
    'Asia Pacific',
    'Middle East',
    'Africa',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and role details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <Shield className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <h3 className="font-medium">Current Role</h3>
                  <Badge className={getRoleColor(role as UserRole)} variant="outline">
                    {role}
                  </Badge>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  Role managed by system administrator
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!canModifySettings}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!canModifySettings}
                  />
                </div>
              </div>

              {(role === 'Regional Admin' || hasPermission(role as UserRole, 'canViewAllRegions')) && (
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Select 
                    value={formData.region} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, region: value }))}
                    disabled={!canModifySettings}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {canModifySettings && (
                <Button 
                  onClick={handleSaveProfile} 
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isLoading ? 'Saving...' : 'Save Profile'}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-alerts">Email Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about important transactions
                    </p>
                  </div>
                  <Switch
                    id="email-alerts"
                    checked={notifications.emailAlerts}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, emailAlerts: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-alerts">SMS Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Critical security notifications via SMS
                    </p>
                  </div>
                  <Switch
                    id="sms-alerts"
                    checked={notifications.smsAlerts}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, smsAlerts: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Browser notifications for real-time updates
                    </p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, pushNotifications: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weekly-reports">Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Automated weekly summary reports
                    </p>
                  </div>
                  <Switch
                    id="weekly-reports"
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, weeklyReports: checked }))
                    }
                  />
                </div>
              </div>

              <Button 
                onClick={handleSaveNotifications} 
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isLoading ? 'Saving...' : 'Save Notifications'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Information */}
        <div className="space-y-6">
          {/* User Info Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">User ID</Label>
                <p className="text-sm text-muted-foreground">{user?._id}</p> {/* Changed from user.id to token */}
              </div>
              
              <div>
                <Label className="text-sm font-medium">Role</Label>
                <p className="text-sm text-muted-foreground">{role}</p> {/* Changed from user.role to role */}
              </div>
              
              {/* user.region was removed as per the edit hint */}
              
              <div>
                <Label className="text-sm font-medium">Last Login</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span>View All Regions</span>
                  <Badge variant={hasPermission(role as UserRole, 'canViewAllRegions') ? 'default' : 'secondary'}>
                    {hasPermission(role as UserRole, 'canViewAllRegions') ? 'Yes' : 'No'}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Manage Users</span>
                  <Badge variant={hasPermission(role as UserRole, 'canManageUsers') ? 'default' : 'secondary'}>
                    {hasPermission(role as UserRole, 'canManageUsers') ? 'Yes' : 'No'}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Approve Transactions</span>
                  <Badge variant={hasPermission(role as UserRole, 'canApproveTransactions') ? 'default' : 'secondary'}>
                    {hasPermission(role as UserRole, 'canApproveTransactions') ? 'Yes' : 'No'}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Modify Settings</span>
                  <Badge variant={hasPermission(role as UserRole, 'canModifySettings') ? 'default' : 'secondary'}>
                    {hasPermission(role as UserRole, 'canModifySettings') ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card className="border-warning">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-warning">
                <AlertTriangle className="h-4 w-4" />
                Security Notice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This dashboard handles sensitive financial data. Always logout when finished 
                and report any suspicious activity immediately.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;