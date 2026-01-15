# 🚀 CommLink MVP – Feature Execution Plan for Cursor AI (Enhanced)

You are a senior software engineer tasked with implementing the MVP for the CommLink Community App. This platform enables users to discover, book, and interact with vetted service providers via real-time voice calls. Your job is to **follow the task list one feature at a time**, completing and validating each task before moving to the next.

This enhanced version includes critical improvements and considerations from a lead developer's perspective to ensure the MVP is robust, user-friendly, and scalable.

---

## 🔧 Working Instructions

1. Load the task list below.
2. Start with the first uncompleted task from the list.
3. For each task:
   - Implement frontend and backend (where applicable)
   - Add loading, empty, and error states
   - Ensure accessibility (WCAG), responsiveness, and clean UX
   - Use modular, testable code components and hooks
   - If VOIP, vetting, or confirmation logic applies, implement placeholders or mocked flows
   - Mark completed tasks with ✅

---

## 🧩 Development Stack

- **Frontend**: React + TypeScript + Tailwind CSS + shadcn/ui
- **State**: React Hooks or Zustand
- **Backend**: Express.js/Next.js API routes or Firebase
- **Voice Calls**: Use Twilio, Agora, or WebRTC (MVP: mocked call interface)
- **Payments**: Integrate Lenco (mock test mode if needed)
- **Testing**: Jest + React Testing Library

---

## 🧠 Feature Enhancements & Clarifications

### ✅ Voice Call Integration (Core Feature)
- Add: Placeholder UI simulating a Twilio/Agora call
- Consider: Future call duration tracking, browser permissions, fallback messaging if device incompatible

### ✅ Session Confirmation Workflow
- Define: Confirmation timeout (e.g., 6 hrs post-session)
- Add: Auto-confirmation fallback
- Log: Store confirmation timestamps for auditing

### ✅ Provider Vetting Flow
- Implement: Provider application queue + vetting status
- Schedule: Manual vetting interview with video scheduling
- Result: Assign verification badge post-approval

### ✅ Booking Logic Improvements
- Add: Rescheduling window config (e.g., 48 hrs max ahead)
- Fallback: Admin override to cancel/refund disputed sessions
- Track: Booking history and status

### ✅ User Privacy & Safety
- Restrict: Display of personal info until booking confirmed
- Delay: Phone/email reveal until payment
- Add: Basic platform T&C and Privacy Policy pages

### ✅ Sponsored Listings
- Define: Simple payment + expiration window
- Highlight: Sponsored listings in provider directory

### ✅ Design & UI Considerations
- Include: Empty state messaging, error screens
- Mobile First: Ensure responsiveness across devices
- Align: Branding, icons, spacing via shadcn/ui components

### ✅ Testing & Feedback Collection
- Add: Manual QA checklist
- Create: User feedback modal (optional)
- Track: Most common support issues or failed tasks

---

## 🧑‍💻 Lead Developer Recommendations

As your lead developer, here's what I'd consider:

1. **Code Quality**
   - ESLint + Prettier
   - Modular folder structure (e.g., components/, pages/, services/, hooks/)

2. **CI/CD Pipeline**
   - GitHub Actions or Vercel CI for deploy previews
   - Linting + testing before merge

3. **Monitoring**
   - Add simple event logging (e.g., booking started, confirmation clicked)
   - Track API success/failure for session joins and payments

4. **Security**
   - Ensure route protection (JWT/session tokens)
   - Rate-limit public endpoints (e.g., search)

5. **Scalability**
   - Code base should be designed for mobile app extension
   - Consider eventual Firebase/Supabase for faster onboarding

6. **Documentation**
   - Add README with setup instructions
   - Comment tricky areas (e.g., booking logic, vetting flow)

---

## 📋 Feature Task Checklist

### 🔍 Individual (User) Features

#### Search Providers
- [x] Design and implement global search bar with filters
- [x] Develop backend API to fetch filtered provider data
- [x] Enable real-time search suggestions and results display
- [x] Add advanced filtering by category, town, and country
- [x] Implement location-based search with geolocation
- [x] Add filter persistence and URL state management

#### View Provider Cards
- [x] Display avatar, name, pricing, location, specialties
- [x] Implement real-time availability indicators
- [x] Link to detailed provider profiles
- [x] Make provider names clickable with navigation
- [x] Add hover effects and visual feedback for clickable elements
- [x] Implement loading states for provider card interactions

#### Provider Details Page
- [x] Create dedicated provider details page with route structure
- [x] Display comprehensive provider profile with analytics
- [x] Show provider ratings, reviews, and performance metrics
- [x] Add provider availability calendar and booking interface
- [x] Implement provider portfolio and media gallery
- [x] Add contact and booking action buttons
- [x] Include provider verification badges and credentials
- [x] Display provider session history and success rates

#### Group Features
- [x] Display groups created by service providers
- [x] Show group information (name, description, member count)
- [x] Add group filtering and search functionality
- [x] Implement group joining/leaving functionality
- [x] Display group events and upcoming sessions
- [x] Add group member list and participant management
- [x] Make group cards clickable with detailed group view (opens in new page)
- [x] Add panelists section for group chat management
- [x] Implement live chat functionality within groups
- [x] Add raise hand functionality with speaking queue
- [x] Implement member reporting system
- [x] Add ability to leave group or report members

#### Sponsored Listings
- [x] Create logic for prioritizing sponsored providers
- [x] Design sponsored badge/UI component
- [x] Integrate payment trigger for sponsorship

#### On-Demand Booking
- [x] Show providers currently available
- [x] Enable instant call or chat with online providers
- [x] Fallback to schedule booking if not available

#### Session Confirmation
- [x] Prompt user to confirm session completion
- [x] Link confirmation to payment release flow
- [x] Notify both parties on confirmation status

### 👨‍💼 Service Provider Features

#### Create/Edit Profile
- [x] Input fields for name, bio, avatar, and certifications
- [x] Add multi-service selection dropdown
- [x] Allow media uploads for portfolio/testimonials
- [x] Implement multi-service management system
- [x] Add service status toggle functionality
- [x] Create service-specific pricing and availability
- [x] Add service portfolio and media management

#### Set Availability
- [x] Design weekly calendar UI for availability slots
- [x] Store availability data in backend
- [x] Allow real-time status toggling (online/offline)

#### On-Demand Bookability
- [x] Toggle availability for instant sessions
- [x] Link toggle to user directory visibility
- [x] Restrict double booking in availability logic

#### Group Management
- [x] Create and manage groups with member limits
- [x] Set group privacy settings (public/private/invite-only)
- [x] Add group description, rules, and guidelines
- [x] Implement group member approval workflow
- [x] Add group analytics and engagement metrics
- [x] Create group events and session scheduling
- [x] Manage group content and media sharing
- [x] Make group cards clickable with detailed group view
- [x] Add panelist selection from group members
- [x] Implement live chat moderation tools
- [x] Add raise hand approval system with queue management
- [x] View and manage reported group members
- [x] Implement member suspension and banning system
- [x] Add group moderation dashboard

#### Group Video Calls & Chats
- [x] Start group video calls with multiple participants
- [x] Implement group chat functionality with real-time messaging
- [x] Add screen sharing and presentation features
- [x] Create breakout rooms for smaller group discussions
- [x] Add recording and transcription capabilities
- [x] Implement group call scheduling and reminders
- [x] Add participant management (mute, remove, promote)
- [x] Create group call analytics and attendance tracking
- [x] Implement raise hand functionality with speaking queue
- [x] Add panelist management system
- [x] Create live chat moderation interface
- [x] Add member reporting and moderation tools
- [x] Implement real-time chat with message threading
- [x] Add chat history and search functionality
- [x] Create group call waiting room with approval system

#### Group Details & Interaction
- [x] Create detailed group view page with member list
- [x] Add panelists section showing current and available panelists
- [x] Implement live chat interface with real-time messaging
- [x] Add raise hand button with visual queue indicator
- [x] Create speaking queue management system
- [x] Add member profile cards with action buttons
- [x] Implement report member functionality with reason selection
- [x] Add leave group confirmation dialog
- [x] Create group rules and guidelines display
- [x] Add group activity feed and recent discussions
- [x] Make group cards clickable with detailed group view (opens in new page)

#### Group Moderation & Management
- [x] Create group moderation dashboard for providers
- [x] Add panelist selection interface from member list
- [x] Implement raise hand approval system with queue management
- [x] Create reported members list with case details
- [x] Add member suspension system with duration options
- [x] Implement member banning with permanent removal
- [x] Add moderation action history and audit trail
- [x] Create group analytics with moderation metrics
- [x] Add automated content filtering and flagging
- [x] Implement moderator role assignment system

#### Vetting Workflow
- [x] Design vetting form and scheduling flow
- [x] Admin interface to review applications
- [x] Track vetting status (Pending, Approved, Rejected)

#### Pricing & Cancellation
- [x] Enable bundle-based pricing system
- [x] Design cancellation policy selector (e.g., 24h notice)
- [x] Link policies to booking confirmation logic

### 👨‍💻 Admin Features

#### Validate Service Providers
- [x] Create vetting queue interface
- [x] Schedule or record video interviews
- [x] Change vetting status and assign verification badge
- [x] Add service provider management interface
- [x] View and edit provider profiles
- [x] Manage provider groups and activities
- [x] Implement multi-service management for providers
- [x] Add service-specific sponsorship activation
- [x] Create service status management interface
- [x] Add service portfolio and media management

#### Manage Categories & Topics
- [x] Interface to add/edit/remove categories
- [x] Assign providers to categories
- [x] Link topics to analytics and session data

#### Dispute Management
- [x] Create dispute ticketing workflow
- [x] Assign admin to each case
- [x] Track resolution and response time

#### Manage Sponsored Listings
- [x] Approve paid promotional listings
- [x] Monitor placement frequency and balance fairness
- [x] Report on sponsor listing revenue

#### Manage Groups
- [x] View all groups and their details
- [x] Access group details page with admin privileges
- [x] Monitor group activity and moderation
- [x] View group analytics and participation metrics
- [x] Manage group disputes and reports

#### Basic Analytics Dashboard
- [x] Display user and session metrics
- [x] Filter by date, category, provider
- [x] Export CSV or PDF reports
- [x] Add group statistics and analytics
- [x] Show group creation and participation metrics
- [x] Display speaking queue and moderation statistics

---

## 🔍 Project Validation Status

### Infrastructure & Setup
- [x] Next.js project initialized
- [x] TypeScript configured
- [x] Tailwind CSS setup
- [x] shadcn/ui components installed
- [x] Firebase configuration ready
- [x] Basic project structure in place

### Authentication & User Management
- [x] Firebase Auth integration
- [x] User registration/login flow
- [x] User role management (User/Provider/Admin)
- [x] Protected routes implementation

### Database Schema
- [x] Users collection structure
- [x] Providers collection structure
- [x] Bookings collection structure
- [x] Categories collection structure
- [x] Analytics data structure

### Core Components
- [x] Layout component
- [x] Navigation component
- [x] Search component
- [x] Provider card component
- [x] Booking form component
- [x] Admin dashboard component
