import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { RootState } from '../app/store';
import { apiService } from '../services/api';
import { hasPermission, filterDataByRole } from '../utils/roleUtils';
import { Transaction } from '../types';
import { useGetDashboardDataQuery, useGetRatesQuery } from '../services/apiSlice';
import type { UserRole, Region } from '../types';
import { getRegionLabel } from '../utils/roleUtils';

const Dashboard: React.FC = () => {
  const { role } = useSelector((state: RootState) => state.auth);
  const [ratesData, setRatesData] = useState<any>(null);
  const [transactionsData, setTransactionsData] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: dashboardData, isLoading: isDashboardLoading } = useGetDashboardDataQuery();
  const { data: rates, isLoading: isRatesLoading } = useGetRatesQuery({ from: 'USD', to: 'USDC' });
  console.log(dashboardData);
  console.log(rates);
  useEffect(() => {
    const loadData = async () => {
      try {
        const [rates, transactions] = await Promise.all([
          apiService.getRates('USD', 'USDC'),
          apiService.getTransactions()
        ]);
        setRatesData(rates);
        setTransactionsData(transactions.transactions);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
 
    loadData();
  }, []);

  if (!role) return null;

  // Filter data based on user role
  const transactions = filterDataByRole(transactionsData, role as UserRole);

  // Calculate metrics
  const totalTransactions = transactions.length;
  const totalVolume = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const pendingTransactions = transactions.filter(tx => tx.status === 'pending').length;
  const failedTransactions = transactions.filter(tx => tx.status === 'failed').length;
  const completedTransactions = transactions.filter(tx => tx.status === 'completed').length;

  const completionRate = totalTransactions > 0 ? (completedTransactions / totalTransactions * 100) : 0;

  const metrics = [
    {
      title: 'Total Volume',
      value: `$${isDashboardLoading ? 'Loading...' : dashboardData?.totalAmount.toLocaleString()}`,
      description: 'Last 24 hours',
      icon: DollarSign,

    },
    {
      title: 'Transactions',
      value: isDashboardLoading ? 'Loading...' : dashboardData?.totalTransactions.toString(),
      description: hasPermission(role as UserRole, 'canViewAllRegions') ? 'All regions' : 'Your region',
      icon: TrendingUp,

    },
    {
      title: 'Verification cases',
      value: `${isDashboardLoading ? 'Loading...' : dashboardData?.kycCount.toString()}`,
      description: 'Total verification cases',
      icon: Users,

    },
    {
      title: 'Pending Reviews',
      value: `${isDashboardLoading ? 'Loading...' : dashboardData?.kycPending.toString()}`,
      description: 'Requiring attention',
      icon: AlertTriangle,

    },
  ];

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'failed': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {role}
          </h1>
          <p className="text-muted-foreground">
            {hasPermission(role as UserRole, "canViewAllRegions")
              ? "Global overview of KYC operations"
              : `${role} KYC dashboard`}
          </p>
        </div>
       
      </div>

      {/* Exchange Rate Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Current Exchange Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isRatesLoading ? (
            <div className="text-2xl font-bold">Loading...</div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold">
                USD to USDC: {ratesData?.rate || "1.0"}
              </div>
              <Badge variant="outline" className="text-xs">
                Live Rate
              </Badge>
            </div>
          )}
          <p className="text-sm text-muted-foreground mt-2">
            Last updated:{" "}
            {ratesData?.timestamp
              ? new Date(ratesData.timestamp).toLocaleTimeString()
              : "N/A"}
          </p>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">
                    {metric.description}
                  </span>
                 
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Latest transactions{" "}
            {hasPermission(role as UserRole, "canViewAllRegions")
              ? "across all regions"
              : "in your region"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isDashboardLoading ? (
            <div>Loading transactions...</div>
          ) : recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No transactions found
            </div>
          ) : (
            <div className="space-y-4">
              {dashboardData?.latestTransactions.map((transaction, index) => (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{index +1 }</span>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {transaction.sender.name} → {transaction.receiver.name}
                    </p>
                    {hasPermission(role as UserRole, "canViewAllRegions") &&
                      transaction.region && (
                        <p className="text-xs text-muted-foreground">
                          {getRegionLabel(transaction.region as Region)}
                        </p>
                      )}
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      ${transaction.amount.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;