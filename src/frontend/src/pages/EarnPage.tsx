import { useGetAllTasks, useCompleteTask } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, CheckCircle2, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import ErrorBanner from '../components/feedback/ErrorBanner';

export default function EarnPage() {
  const { data: tasks, isLoading } = useGetAllTasks();
  const completeTask = useCompleteTask();
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCompleteTask = async (taskId: string, taskTitle: string) => {
    setError(null);
    setCompletingTaskId(taskId);
    try {
      await completeTask.mutateAsync(taskId);
      toast.success(`Completed: ${taskTitle}`, {
        description: 'Your balance has been updated!',
      });
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to complete task';
      setError(errorMessage);
      toast.error('Task completion failed', {
        description: errorMessage,
      });
    } finally {
      setCompletingTaskId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-primary" />
          Earn Rewards
        </h1>
        <p className="text-muted-foreground text-lg">
          Complete tasks below to earn rewards and grow your balance.
        </p>
      </div>

      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : tasks && tasks.length > 0 ? (
        <div className="space-y-4">
          {tasks.map((task, index) => {
            const taskId = `task${index + 1}`;
            const isCompleting = completingTaskId === taskId;
            
            return (
              <Card key={index} className="border-border/50 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{task.title}</CardTitle>
                      <CardDescription className="mt-2">{task.description}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-lg font-bold px-3 py-1">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {task.reward.toFixed(2)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handleCompleteTask(taskId, task.title)}
                    disabled={isCompleting}
                    className="gap-2"
                  >
                    {isCompleting ? (
                      'Completing...'
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Complete Task
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No tasks available at the moment.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
