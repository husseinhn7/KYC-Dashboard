import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Search, Filter, Download, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { RootState } from '../app/store';
import { apiService } from '../services/api';
import { hasPermission } from '../utils/roleUtils';
import { AuditLog, UserRole } from '../types';
import { useGetAuditLogsQuery } from '@/services/apiSlice';

const AuditLogs: React.FC = () => {
  const { role } = useSelector((state: RootState) => state.auth);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: auditLogs, isLoading, error } = useGetAuditLogsQuery({
    status: statusFilter,
    filter: search,});
  console.log(auditLogs);
  if (!role) return null;

  // Check if user can view audit logs
  const canViewAuditLogs = hasPermission(role as UserRole, 'canViewAllAuditLogs') || 
    (role === 'Regional Admin');

  if (!canViewAuditLogs) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Access Restricted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You don't have permission to view audit logs. Please contact your administrator for access.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-success text-success-foreground';
      case 'failed': return 'bg-destructive text-destructive-foreground';
      case 'warning': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

 

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Audit Logs</h1>
          <p className="text-muted-foreground">
            {hasPermission(role as UserRole, "canViewAllAuditLogs")
              ? "Complete system audit trail"
              : "Regional audit activity monitoring"}
          </p>
        </div>
         
      </div>

      {/* Real-time Status */}
      <Card className="bg-accent/50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">
                Live Monitoring Active
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Last update: {new Date().toLocaleTimeString()}
            </div>
            <div className="text-sm text-muted-foreground">
              Polling every 30 seconds
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Audit Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">
                Search User
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by user email or name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="min-w-[150px]">
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>
            {!isLoading && auditLogs.length} log entries found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="text-muted-foreground">Loading audit logs...</div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              {error as string}
            </div>
          ) : !isLoading && auditLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No audit logs found matching your criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log._id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{log?.action}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{log?.user.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(log.status)}>
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[300px]">
                          <p className="text-sm">{log.details}</p>
                        </div>
                      </TableCell>
                
                      <TableCell>
                        <div className="text-sm">
                          <div>
                            {new Date(log.timestamp).toLocaleDateString()}
                          </div>
                          <div className="text-muted-foreground">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogs;