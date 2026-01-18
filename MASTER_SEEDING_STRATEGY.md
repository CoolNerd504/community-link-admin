# Master Seeding Strategy

This document outlines the strategy to overhaul the database seeding process (`prisma/seed.ts`) to create a robust, large-scale, and interconnected dataset for development and testing.

## Goal
-   **Scale**: Increase user count to ~40 (20 Providers, 20 Clients) and interactions to ~200+.
-   **Variety**: Ensure each user has 3-5 interaction scenarios (Pending, Completed, Cancelled, Disputed).
-   **Realism**: Maintain referential integrity and realistic logical flows (dates, status transitions).

---

## 1. Technical Approach

### A. Dynamic Data Generation
Instead of manually defining every user object, we will use helper "Factory" functions and arrays of realistic data (names, bios).
*Recommendation*: Install `@faker-js/faker` to generate realistic names, emails, and content.

### B. Dependency Flow
The seed script will execute in strict phases to satisfy foreign key constraints:
1.  **Static Data**: Categories, PricingTiers, MinutePackages.
2.  **Users (Base)**: Create Accounts, Profiles, and Wallets (Empty).
3.  **Services**: Create Services for Providers (Approved/Pending).
4.  **Interactions (The "Scenarios")**:
    -   Iterate through Clients.
    -   For each Client, generate 3-5 "Stories" (Bookings/Sessions).
    -   Create cascading data: `Booking` -> `AppSession` -> `Review` -> `Transaction` -> `Notification`.

---

## 2. User Scenarios

We will define varied personas to test different edge cases:

### A. Provider Personas
1.  **The Veteran**: Approved, 4.8+ Rating, 20+ Completed Sessions, High Earnings.
2.  **The Newcomer**: Approved, 0 Sessions, "New" badge.
3.  **The Applicant**: Pending Verification/Approval.
4.  **The Specialist**: High price, niche category, few but long sessions.

### B. Client Personas
1.  **The Power User**: 10+ Bookings, Active Subscription/Wallet balance.
2.  **The Window Shopper**: No bookings, but has Favorites and Following.
3.  **The Disputer**: Histories of cancelled/disputed sessions (for testing Admin flows).
4.  **The Newbie**: Fresh account, no history.

---

## 3. Data Structure Plan

### Step 1: Base Data (x2 Volume)
-   **Categories**: 10 (Expanded list).
-   **Pricing**: Standard Tiers + bundles.

### Step 2: Users Generation
-   **Admins**: 3 (Super, Moderator, Viewer).
-   **Providers**: 15-20.
    -   Mixed Categories.
    -   Mixed VettingStatus (`APPROVED`, `PENDING`).
    -   Services: 2-4 per provider (Total ~60 services).
        -   *Update*: Ensure `isApproved: true` for visible ones.
-   **Clients**: 20.
    -   Mixed Wallet Balances (0 - 5000 ZMW).

### Step 3: Interaction Generation (The Core Loop)
We will run a simulation loop:
```typescript
for (const client of clients) {
    const numScenarios = random(3, 6);
    
    for (let i=0; i<numScenarios; i++) {
        const provider = pickRandom(providers);
        const service = pickRandom(provider.services);
        const status = pickScenarioStatus(); // [COMPLETED, PENDING, CANCELLED, ACTIVE]
        
        createBookingFlow(client, provider, service, status);
    }
}
```

#### `createBookingFlow` Logic:
1.  **Pending**: Create `BookingRequest` (Future date).
2.  **Accepted**: Create `BookingRequest` (Accepted) -> `AppSession` (Scheduled/Future).
3.  **Completed**:
    -   `BookingRequest` (Accepted, Past)
    -   `AppSession` (Completed, Past)
    -   `MinuteUsage` (Logged time)
    -   `Transaction` (Deduction from Client, Earning for Provider)
    -   `Review` (Optional: 70% chance)
4.  **Cancelled/Declined**: Create `BookingRequest` with `DECLINED` status.
5.  **Active**: Create `AppSession` with `ACTIVE` status (Now +/- duration).

### Step 4: Social & Engagement
-   **Favorites**: Randomly assign 1-3 favorites per client.
-   **Notifications**: Generate `Notification` records for recent interactions (last 3 days).

---

## 4. Implementation Steps
1.  Install `@faker-js/faker`.
2.  Refactor `prisma/seed.ts`:
    -   Keep Category/Tier static data.
    -   Replace manual User creation with Loops.
    -   Implement the `createBookingFlow` function.
3.  Run `npx prisma db seed`.

This strategy ensures that every time we seed, we get a fresh, rich dataset that covers all "happy paths" and "edge cases" automatically.
