import { useGetUserBalance, useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Wallet, TrendingUp, Award, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const { data: balance, isLoading: balanceLoading } = useGetUserBalance();
  const { data: profile, isLoading: profileLoading } = useGetCallerUserProfile();

  const stats = [
    {
      title: 'Current Balance',
      value: balance !== undefined ? `$${balance.toFixed(2)}` : '$0.00',
      icon: Wallet,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      loading: balanceLoading,
    },
    {
      title: 'Tasks Completed',
      value: profile?.tasksCompleted !== undefined ? profile.tasksCompleted.toString() : '0',
      icon: Award,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      loading: profileLoading,
    },
    {
      title: 'Total Earned',
      value: balance !== undefined ? `$${balance.toFixed(2)}` : '$0.00',
      icon: TrendingUp,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      loading: balanceLoading,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-primary" />
          Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">
          Welcome back{profile?.name ? `, ${profile.name}` : ''}! Here's your earning overview.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                {stat.loading ? (
                  <Skeleton className="h-10 w-32" />
                ) : (
                  <div className="text-3xl font-bold">{stat.value}</div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest earning and withdrawal events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No recent activity yet. Complete tasks to start earning!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
