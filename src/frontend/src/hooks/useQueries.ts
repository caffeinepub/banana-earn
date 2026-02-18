import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Task } from '../backend';
import type { Principal } from '@icp-sdk/core/principal';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Balance Queries
export function useGetUserBalance() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<number>({
    queryKey: ['userBalance'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getUserBalance();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Task Queries
export function useGetAllTasks() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Task[]>({
    queryKey: ['allTasks'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllTasks();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCompleteTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.completeTask(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userBalance'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Withdrawal Queries
export function useGetAllWithdrawalRequests() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Array<[Principal, { amount: number }]>>({
    queryKey: ['allWithdrawalRequests'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getAllWithdrawalRequests();
      } catch (error) {
        // If user is not admin, return empty array
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useRequestWithdrawal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount: number) => {
      if (!actor) throw new Error('Actor not available');
      return actor.requestWithdrawal(amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userBalance'] });
      queryClient.invalidateQueries({ queryKey: ['allWithdrawalRequests'] });
    },
  });
}
