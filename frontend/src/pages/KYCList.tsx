import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Filter, Search, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { apiService } from '@/services/api';
import { KYCCase } from '@/types';
import { useGetKYCCasesQuery } from '@/services/apiSlice';
import { getRegionLabel } from '@/utils/roleUtils';
import { Region } from '@/types';
import { get } from 'http';

const KYCList: React.FC = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const { data, isLoading } = useGetKYCCasesQuery({
    status: statusFilter,
    region: regionFilter,
    filter: searchTerm,
  });
  console.log(data);

  const getStatusColor = (status: KYCCase['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
      case 'rejected':
        return 'bg-red-500/10 text-red-600 border-red-200';
      case 'pending':
        return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'under_review':
        return 'bg-blue-500/10 text-blue-600 border-blue-200';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  const formatStatus = (status: KYCCase['status']) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };




  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">KYC Verification Cases</h1>
            <p className="text-muted-foreground">Manage and review KYC verification requests</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            KYC Verification Cases
          </h1>
          <p className="text-muted-foreground">
            Manage and review KYC verification requests
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <span className="text-sm text-muted-foreground">
            {data.length} cases
          </span>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <CardDescription>Filter and search KYC cases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Name, or Email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value={Region.MENA}>{getRegionLabel(Region.MENA)}</SelectItem>
                <SelectItem value={Region.EU}>{getRegionLabel(Region.EU)}</SelectItem>
                <SelectItem value={Region.NA}>{getRegionLabel(Region.NA)}</SelectItem>
                <SelectItem value={Region.SA}>{getRegionLabel(Region.SA)}</SelectItem>
                <SelectItem value={Region.APAC}>{getRegionLabel(Region.APAC)}</SelectItem>
                <SelectItem value={Region.SSA}>{getRegionLabel(Region.SSA)}</SelectItem>
                <SelectItem value={Region.GLOBAL}>{getRegionLabel(Region.GLOBAL)}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* KYC Cases Table */}
      <Card>
        <CardHeader>
          <CardTitle>KYC Cases</CardTitle>
          <CardDescription>
            Review and manage KYC verification requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((caseItem) => (
                  <TableRow key={caseItem._id}>
                    <TableCell className="font-medium">
                      {caseItem._id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{caseItem.user.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {caseItem.user.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRegionLabel(caseItem.region as Region)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(caseItem.status)}
                      >
                        {formatStatus(caseItem.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(caseItem.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/kyc/${caseItem._id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {data.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No KYC cases found
              </h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" || regionFilter !== "all"
                  ? "Try adjusting your filters or search terms."
                  : "KYC cases will appear here when users submit verification requests."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KYCList;