// Sample session data
export const sampleSessions: { [key: string]: SessionData[] } = {
  "1": [
    {
      id: "session-1",
      clientName: "John Doe",
      providerName: "Sarah Johnson",
      service: "Life Coaching",
      date: "2024-01-05",
      time: "10:00 AM",
      duration: 60,
      status: "completed",
      rating: 5,
      notes: "Great session! Sarah provided valuable insights.",
    },
    {
      id: "session-2",
      clientName: "John Doe",
      providerName: "Sarah Johnson",
      service: "Goal Setting",
      date: "2024-01-12",
      time: "2:00 PM",
      duration: 60,
      status: "completed",
      rating: 4,
      notes: "Good session, but could have been more structured.",
    },
    {
      id: "session-3",
      clientName: "John Doe",
      providerName: "Sarah Johnson",
      service: "Career Advice",
      date: "2024-01-19",
      time: "11:00 AM",
      duration: 60,
      status: "upcoming",
    },
  ],
  "2": [
    {
      id: "session-4",
      clientName: "Jane Smith",
      providerName: "Dr. Michael Chen",
      service: "Therapy Session",
      date: "2024-01-06",
      time: "3:00 PM",
      duration: 60,
      status: "completed",
      rating: 5,
      notes: "Dr. Chen is very helpful and understanding.",
    },
    {
      id: "session-5",
      clientName: "Jane Smith",
      providerName: "Dr. Michael Chen",
      service: "Anxiety Treatment",
      date: "2024-01-13",
      time: "9:00 AM",
      duration: 60,
      status: "completed",
      rating: 5,
      notes: "Feeling much better after the session.",
    },
    {
      id: "session-6",
      clientName: "Jane Smith",
      providerName: "Dr. Michael Chen",
      service: "Depression Management",
      date: "2024-01-20",
      time: "4:00 PM",
      duration: 60,
      status: "upcoming",
    },
  ],
  "3": [
    {
      id: "session-7",
      clientName: "Mike Johnson",
      providerName: "Emma Rodriguez",
      service: "Fitness Training",
      date: "2024-01-07",
      time: "8:00 AM",
      duration: 60,
      status: "completed",
      rating: 4,
      notes: "Emma is a great motivator!",
    },
    {
      id: "session-8",
      clientName: "Mike Johnson",
      providerName: "Emma Rodriguez",
      service: "Nutrition Advice",
      date: "2024-01-14",
      time: "5:00 PM",
      duration: 60,
      status: "completed",
      rating: 5,
      notes: "Very helpful nutrition tips.",
    },
    {
      id: "session-9",
      clientName: "Mike Johnson",
      providerName: "Emma Rodriguez",
      service: "Weight Training",
      date: "2024-01-21",
      time: "7:00 AM",
      duration: 60,
      status: "upcoming",
    },
  ],
}

// Sample service providers
export const sampleServiceProviders = [
  {
    id: "1",
    name: "Sarah Johnson",
    specialty: "Life Coach",
    rating: 4.9,
    reviewCount: 127,
    location: "Lusaka, Zambia",
    avatar: "/placeholder.svg",
    isOnline: true,
    responseTime: "Usually responds in 2 hours",
    description: "Certified life coach with 8+ years of experience helping people achieve their goals and overcome challenges.",
    skills: ["Career Development", "Goal Setting", "Stress Management", "Personal Growth"],
    isSponsored: true,
    isVerified: true,
    vettingStatus: "approved" as const,
    availableForInstant: true,
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialty: "Therapist",
    rating: 4.8,
    reviewCount: 203,
    location: "Kitwe, Zambia",
    avatar: "/placeholder.svg",
    isOnline: false,
    responseTime: "Usually responds in 24 hours",
    description: "Licensed clinical psychologist specializing in anxiety, depression, and relationship counseling.",
    skills: ["Anxiety Treatment", "Depression Therapy", "Couples Counseling", "Cognitive Behavioral Therapy"],
    isSponsored: false,
    isVerified: true,
    vettingStatus: "approved" as const,
    availableForInstant: false,
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    specialty: "Fitness Trainer",
    rating: 4.7,
    reviewCount: 89,
    location: "Ndola, Zambia",
    avatar: "/placeholder.svg",
    isOnline: true,
    responseTime: "Usually responds in 1 hour",
    description: "Certified personal trainer and nutritionist helping clients achieve their fitness goals.",
    skills: ["Weight Training", "Cardio Fitness", "Nutrition Planning", "Body Transformation"],
    isSponsored: true,
    isVerified: true,
    vettingStatus: "approved" as const,
    availableForInstant: true,
  },
]

// Sample groups
export const sampleGroups = [
  {
    id: "1",
    name: "Anxiety Support Group",
    description: "A safe space for people dealing with anxiety to share experiences and coping strategies.",
    category: "Mental Health",
    currentMembers: 45,
    maxMembers: 100,
    isActive: true,
    createdBy: "1",
    lastActivityAt: { toDate: () => new Date("2024-01-15") } as any, // Mock Timestamp
    tags: ["anxiety", "support", "mental-health"],
    privacy: "public" as const,
    location: {
      town: "Lusaka",
      country: "Zambia"
    },
    groupImage: "/placeholder.svg"
  },
  {
    id: "2",
    name: "Career Development Network",
    description: "Professional networking group for career advancement and skill development.",
    category: "Professional",
    currentMembers: 78,
    maxMembers: 150,
    isActive: true,
    createdBy: "2",
    lastActivityAt: { toDate: () => new Date("2024-01-20") } as any, // Mock Timestamp
    tags: ["career", "networking", "professional"],
    privacy: "public" as const,
    location: {
      town: "Kitwe",
      country: "Zambia"
    },
    groupImage: "/placeholder.svg"
  },
  {
    id: "3",
    name: "Fitness Motivation Club",
    description: "Group for fitness enthusiasts to share workouts, tips, and stay motivated.",
    category: "Fitness",
    currentMembers: 32,
    maxMembers: 80,
    isActive: true,
    createdBy: "3",
    lastActivityAt: { toDate: () => new Date("2024-01-18") } as any, // Mock Timestamp
    tags: ["fitness", "motivation", "workout"],
    privacy: "public" as const,
    location: {
      town: "Ndola",
      country: "Zambia"
    },
    groupImage: "/placeholder.svg"
  },
]

// Sample booking requests
export const sampleBookingRequests = [
  {
    id: "1",
    clientName: "John Doe",
    providerName: "Sarah Johnson",
    service: "Life Coaching",
    date: "2024-01-25",
    time: "10:00 AM",
    status: "confirmed" as const,
    amount: 50,
  },
  {
    id: "2",
    clientName: "Jane Smith",
    providerName: "Dr. Michael Chen",
    service: "Therapy Session",
    date: "2024-01-26",
    time: "2:00 PM",
    status: "pending" as const,
    amount: 75,
  },
  {
    id: "3",
    clientName: "Mike Johnson",
    providerName: "Emma Rodriguez",
    service: "Fitness Training",
    date: "2024-01-27",
    time: "8:00 AM",
    status: "confirmed" as const,
    amount: 40,
  },
]

// Sample disputes
export const sampleDisputes = [
  {
    id: "1",
    clientName: "Alice Brown",
    providerName: "Sarah Johnson",
    issue: "Session quality not as expected",
    status: "open" as const,
    assignedAdmin: "admin1",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    clientName: "Bob Wilson",
    providerName: "Dr. Michael Chen",
    issue: "Payment dispute",
    status: "in-progress" as const,
    assignedAdmin: "admin2",
    createdAt: new Date("2024-01-12"),
  },
]

// Types
export interface SessionData {
  id: string
  clientName?: string
  providerName?: string
  service: string
  date: string
  time: string
  duration: number // in minutes
  status: "completed" | "upcoming" | "cancelled"
  rating?: number
  notes?: string
}

export interface ServiceProvider {
  id: string
  name: string
  specialty: string
  rating: number
  reviewCount: number
  location: string
  avatar: string
  isOnline: boolean
  responseTime: string
  description: string
  skills: string[]
  isSponsored?: boolean
  isVerified?: boolean
  vettingStatus?: "pending" | "approved" | "rejected"
  availableForInstant?: boolean
}

export interface BookingRequest {
  id: string
  clientName: string
  providerName: string
  service: string
  date: string
  time: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  amount: number
}

export interface Dispute {
  id: string
  clientName: string
  providerName: string
  issue: string
  status: "open" | "in-progress" | "resolved"
  assignedAdmin?: string
  createdAt: Date
} 