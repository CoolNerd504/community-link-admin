// import { Timestamp } from "firebase/firestore" // Removed
// import type { Group } from "@/types/firebase-types" // Removed

export const sampleGroups: any[] = [
  {
    id: "group-1",
    name: "Wellness Warriors",
    description: "A group for wellness enthusiasts.",
    createdBy: "provider-1",
    category: "Wellness",
    privacy: "public",
    maxMembers: 50,
    currentMembers: 10,
    location: { town: "Lusaka", country: "Zambia" },
    tags: ["wellness", "fitness"],
    rules: ["Be respectful", "No spam"],
    guidelines: ["Share helpful tips", "Support each other"],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastActivityAt: new Date(),
    coverImage: "/placeholder.jpg",
    groupImage: "/placeholder-user.jpg",
    settings: {
      allowMemberChat: true,
      requireApprovalToJoin: false,
      allowRaiseHand: true,
      panelistMode: true,
      autoModeration: false,
      maxPanelists: 5,
    },
    moderation: {
      moderators: ["provider-1"],
      bannedUsers: [],
      suspendedUsers: [],
      reportCount: 0,
      lastModeratedAt: new Date(),
    },
    reportCount: 0,
    adminAnalytics: {
      totalSessions: 5,
      averageSessionDuration: 60,
      memberEngagementRate: 80,
      moderationActions: 2,
      speakingQueueUsage: 10,
      chatActivity: 50,
    },
  },
  // ...add more groups as needed
]
