import { useState } from 'react';
import { useGetUserBalance, useRequestWithdrawal, useGetAllWithdrawalRequests } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, Send, Clock } from 'lucide-react';
import { toast } from 'sonner';
import ErrorBanner from '../components/feedback/ErrorBanner';

export default function WithdrawPage() {
  const { data: balance } = useGetUserBalance();
  const { data: allRequests } = useGetAllWithdrawalRequests();
  const { identity } = useInternetIdentity();
  const requestWithdrawal = useRequestWithdrawal();

  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  const currentBalance = balance || 0;
  const userPrincipal = identity?.getPrincipal().toString();

  // Filter withdrawal requests for current user
  const userRequests = allRequests?.filter(([principal]) => principal.toString() === userPrincipal) || [];

  const validateAmount = (value: string): string | null => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) {
      return 'Amount must be a positive number';
    }
    if (numValue > currentBalance) {
      return `Insufficient balance. Available: $${currentBalance.toFixed(2)}`;
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateAmount(amount);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await requestWithdrawal.mutateAsync(parseFloat(amount));
      toast.success('Withdrawal requested!', {
        description: `$${parseFloat(amount).toFixed(2)} has been requested for withdrawal.`,
      });
      setAmount('');
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to request withdrawal';
      setError(errorMessage);
      toast.error('Withdrawal failed', {
        description: errorMessage,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <DollarSign className="w-8 h-8 text-primary" />
          Withdraw Funds
        </h1>
        <p className="text-muted-foreground text-lg">
          Request a withdrawal from your available balance.
        </p>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Request Withdrawal</CardTitle>
          <CardDescription>
            Available Balance: <span className="font-bold text-foreground">${currentBalance.toFixed(2)}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <ErrorBanner message={error} onDismiss={() => setError(null)} className="mb-4" />}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Withdrawal Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError(null);
                }}
              />
            </div>
            <Button type="submit" disabled={requestWithdrawal.isPending || !amount} className="gap-2">
              {requestWithdrawal.isPending ? (
                'Processing...'
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Request Withdrawal
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Withdrawal History</CardTitle>
          <CardDescription>Your withdrawal requests and their status</CardDescription>
        </CardHeader>
        <CardContent>
          {userRequests.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userRequests.map(([principal, request], index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">${request.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="gap-1">
                        <Clock className="w-3 h-3" />
                        Pending
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No withdrawal requests yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
