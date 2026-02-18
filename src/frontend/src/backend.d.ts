import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Task {
    reward: number;
    title: string;
    description: string;
}
export interface WithdrawalRequest {
    amount: number;
}
export interface UserProfile {
    name: string;
    tasksCompleted: bigint;
}
export type TaskId = string;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    completeTask(taskId: TaskId): Promise<void>;
    createTask(taskId: TaskId, title: string, description: string, reward: number): Promise<void>;
    getAllTasks(): Promise<Array<Task>>;
    getAllTasksByReward(): Promise<Array<Task>>;
    getAllWithdrawalRequests(): Promise<Array<[Principal, WithdrawalRequest]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getTask(taskId: TaskId): Promise<Task>;
    getUserBalance(): Promise<number>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    requestWithdrawal(amount: number): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    seedChunkTasks(): Promise<void>;
}
