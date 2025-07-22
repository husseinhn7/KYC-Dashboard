import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Search, Filter, Download, Eye } from 'lucide-react';
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
  TableRow
} from '../components/ui/table';
import { RootState } from '../app/store';
import { hasPermission } from '../utils/roleUtils';
import { UserRole } from '../types';
import { useGetTransactionsQuery } from '../services/apiSlice';
import { getRegionLabel } from '../utils/roleUtils';
import { Region } from '../types';





const Transactions: React.FC = () => {
  const { role } = useSelector((state: RootState) => state.auth);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { data, isLoading, error } = useGetTransactionsQuery({
    status: statusFilter,
    filter: search,
  });
 
  if (!role) return null;


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'failed': return 'bg-destructive text-destructive-foreground';
      case 'cancelled': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
          <p className="text-muted-foreground">
            {hasPermission(role as UserRole, 'canViewAllRegions') 
              ? 'Global transaction monitoring' 
              : `${role === 'global' ? 'Global' : 'Regional'} transaction overview`}
          </p>
        </div>
       
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search sender, or receiver..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            {isLoading ? 'Loading...' : `${data.length} transactions found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="text-muted-foreground">Loading transactions...</div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              {error as string || 'Failed to load transactions'}
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No transactions found matching your criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Sender</TableHead>
                    <TableHead>Receiver</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    {hasPermission(role as UserRole, 'canViewAllRegions') && <TableHead>Region</TableHead>}
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((transaction) => (
                    <TableRow key={transaction._id}>
                      <TableCell className="font-medium">
                        {transaction._id}
                      </TableCell>
                      <TableCell>{transaction.sender.name}</TableCell>
                      <TableCell>{transaction.receiver.name}</TableCell>
                      <TableCell className="font-medium">
                        ${transaction.amount.toLocaleString()} {transaction.currency}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      {hasPermission(role as UserRole, 'canViewAllRegions') && (
                        <TableCell>{getRegionLabel(transaction?.region as Region)}</TableCell>
                      )}
                      <TableCell>
                        {new Date(transaction.timestamp).toLocaleDateString()}
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

export default Transactions;