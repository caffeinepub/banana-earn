import Array "mo:core/Array";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  public type TaskId = Text;
  public type UserProfile = { name : Text; tasksCompleted : Nat };
  public type Task = { title : Text; description : Text; reward : Float };
  public type WithdrawalRequest = { amount : Float };

  module Task {
    public func compare(task1 : Task, task2 : Task) : Order.Order {
      Text.compare(task1.title, task2.title);
    };

    public func compareByReward(task1 : Task, task2 : Task) : Order.Order {
      Float.compare(task1.reward, task2.reward);
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let tasks = Map.empty<TaskId, Task>();
  let balances = Map.empty<Principal, Float>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let withdrawalRequests = Map.empty<Principal, WithdrawalRequest>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Task Management
  public shared ({ caller }) func createTask(taskId : TaskId, title : Text, description : Text, reward : Float) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create tasks");
    };
    if (reward <= 0) {
      Runtime.trap("Reward must be positive");
    };
    let task : Task = { title; description; reward };
    tasks.add(taskId, task);
  };

  // Task Completion
  public shared ({ caller }) func completeTask(taskId : TaskId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete tasks");
    };

    switch (tasks.get(taskId)) {
      case (?task) {
        let currentBalance = switch (balances.get(caller)) {
          case (null) { 0.0 };
          case (?existing) { existing };
        };

        let currentProfile = switch (userProfiles.get(caller)) {
          case (null) { { name = "Anonymous"; tasksCompleted = 0 } };
          case (?existing) { existing };
        };

        balances.add(caller, currentBalance + task.reward);
        userProfiles.add(
          caller,
          {
            currentProfile with
            tasksCompleted = currentProfile.tasksCompleted + 1;
          },
        );
      };
      case (null) { Runtime.trap("Task not found") };
    };
  };

  // Withdrawal Management
  public shared ({ caller }) func requestWithdrawal(amount : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can request withdrawals");
    };

    if (amount <= 0) {
      Runtime.trap("Withdrawal amount must be positive");
    };

    let currentBalance = switch (balances.get(caller)) {
      case (null) { 0.0 };
      case (?balance) { balance };
    };

    if (amount > currentBalance) {
      Runtime.trap("Insufficient balance");
    };

    withdrawalRequests.add(caller, { amount });
    balances.add(caller, currentBalance - amount);
  };

  // Query Balances and Tasks
  public query ({ caller }) func getUserBalance() : async Float {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view balances");
    };

    switch (balances.get(caller)) {
      case (null) { 0.0 };
      case (?balance) { balance };
    };
  };

  public query ({ caller }) func getAllTasks() : async [Task] {
    tasks.values().toArray().sort();
  };

  public query ({ caller }) func getAllTasksByReward() : async [Task] {
    tasks.values().toArray().sort(Task.compareByReward);
  };

  public query ({ caller }) func getTask(taskId : TaskId) : async Task {
    switch (tasks.get(taskId)) {
      case (null) { Runtime.trap("Task not found.") };
      case (?task) { task };
    };
  };

  // Admin Functionality
  public query ({ caller }) func getAllWithdrawalRequests() : async [(Principal, WithdrawalRequest)] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view withdrawal requests");
    };

    withdrawalRequests.entries().toArray();
  };

  // Seed Initial Tasks
  public shared ({ caller }) func seedChunkTasks() : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can seed tasks");
    };
    ignore await createTask("task1", "Complete a survey", "Participate in a market research survey. Requires 5 mins.", 5.0);
    ignore await createTask("task2", "Watch video", "Watch a 2-min tutorial video", 1.0);
  };
};
