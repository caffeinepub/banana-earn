# Specification

## Summary
**Goal:** Build a basic “Banana Earn” rewards app with Internet Identity login, task-based earning, balance tracking, and withdrawal requests.

**Planned changes:**
- Add Internet Identity sign-in/sign-out UI, showing a signed-out landing CTA and a signed-in header with principal + logout.
- Implement a single Motoko backend actor with stable storage data models for user profile, balance, task completion history, and withdrawal requests.
- Expose backend APIs to fetch dashboard data (balance + recent activity), list tasks, submit task completion (prevent duplicates unless repeatable), and create/list withdrawal requests.
- Build app UI sections for Dashboard (balance + recent activity), Earn (task list with claim buttons and completion state), and Withdraw (submit request with validation + status list).
- Add validation/anti-abuse rules: positive rewards, balance never negative, withdrawals must be positive and <= available balance; show user-friendly English error messages.
- Seed backend with at least 5 example tasks (title, description, reward, repeatable flag) available immediately after deployment.
- Apply a cohesive Banana Earn visual theme (non-blue/purple palette) consistently across screens.
- Add and reference generated static assets (logo + hero illustration) from frontend static assets.

**User-visible outcome:** Users can sign in with Internet Identity, see their balance and recent activity, complete tasks to earn rewards (with duplicate prevention), and submit/view withdrawal requests with basic validation and statuses.
