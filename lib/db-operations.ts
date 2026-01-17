import { prisma } from "@/lib/prisma"
import type {
  IndividualUser,
  ServiceProvider,
  // ... other types might need adjustment or we use Prisma types
} from "../types/firebase-types"
import { UserRole, AppSessionStatus, BookingStatus, DisputeStatus, VettingStatus } from "@prisma/client"

// User Operations
export const createIndividualUser = async (
  userData: { email: string; name: string; image?: string, role?: string }
) => {
  return await prisma.user.create({
    data: {
      email: userData.email,
      name: userData.name,
      image: userData.image,
      role: UserRole.USER,
      profile: {
        create: {
          // Initialize empty profile
        }
      }
    }
  })
}

export const createServiceProvider = async (
  userData: { email: string; name: string; image?: string, role?: string }
) => {
  return await prisma.user.create({
    data: {
      email: userData.email,
      name: userData.name,
      image: userData.image,
      role: UserRole.PROVIDER,
      profile: {
        create: {
          isVerified: false,
          vettingStatus: "PENDING"
        }
      }
    }
  })
}

export const getUserProfile = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      // services: true, // if provider
    }
  })
}

export const updateUserProfile = async (userId: string, updates: any) => {
  // Split updates between User and Profile models
  const userUpdates: any = {}
  const profileUpdates: any = {}

  if (updates.name) userUpdates.name = updates.name
  if (updates.image) userUpdates.image = updates.image

  if (updates.bio) profileUpdates.bio = updates.bio
  if (updates.headline) profileUpdates.headline = updates.headline
  if (updates.location) profileUpdates.location = updates.location
  if (updates.hourlyRate) profileUpdates.hourlyRate = updates.hourlyRate

  // Content Personalization
  if (updates.interests) profileUpdates.interests = updates.interests

  // Provider Status Toggles
  if (typeof updates.isOnline === 'boolean') profileUpdates.isOnline = updates.isOnline
  if (typeof updates.isAvailableForInstant === 'boolean') profileUpdates.isAvailableForInstant = updates.isAvailableForInstant

  return await prisma.user.update({
    where: { id: userId },
    data: {
      ...userUpdates,
      profile: {
        update: profileUpdates
      }
    }
  })
}

export const followUser = async (followerId: string, followingId: string) => {
  return await prisma.follow.create({
    data: {
      followerId,
      followingId
    }
  })
}

export const unfollowUser = async (followerId: string, followingId: string) => {
  return await prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId,
        followingId
      }
    }
  })
}

export const isFollowing = async (followerId: string, followingId: string) => {
  const follow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId
      }
    }
  })
  return !!follow
}

// Service Operations
export const addProviderService = async (userId: string, serviceData: any) => {
  return await prisma.service.create({
    data: {
      providerId: userId,
      title: serviceData.title,
      description: serviceData.description,
      price: parseFloat(serviceData.price),
      duration: parseInt(serviceData.duration),
      category: serviceData.category || "General",
      isActive: true,
    }
  })
}

export const getProviderServices = async (userId: string) => {
  return await prisma.service.findMany({
    where: { providerId: userId }
  })
}

export const updateProviderService = async (userId: string, serviceId: string, updates: any) => {
  // Verify ownership
  const service = await prisma.service.findUnique({
    where: { id: serviceId }
  })

  if (!service || service.providerId !== userId) {
    throw new Error("Service not found or unauthorized")
  }

  return await prisma.service.update({
    where: { id: serviceId },
    data: {
      title: updates.title,
      description: updates.description,
      price: updates.price ? parseFloat(updates.price) : undefined,
      duration: updates.duration ? parseInt(updates.duration) : undefined,
      category: updates.category,
      isActive: updates.isActive,
      // isAvailableForInstant: updates.isAvailableForInstant // if added to schema
    }
  })
}

export const deleteProviderService = async (userId: string, serviceId: string) => {
  // Verify ownership
  const service = await prisma.service.findUnique({
    where: { id: serviceId }
  })

  if (!service || service.providerId !== userId) {
    throw new Error("Service not found or unauthorized")
  }

  return await prisma.service.delete({
    where: { id: serviceId }
  })
}


export const getProviderPopulated = async (providerId: string) => {
  return await prisma.user.findUnique({
    where: { id: providerId },
    include: {
      profile: true,
      providerServices: true, // Correct relation name from previous edit
      providerReviews: true
    }
  })
}

// Session Operations
export const createBookingRequest = async (bookingData: any) => {
  return await prisma.bookingRequest.create({
    data: {
      serviceId: bookingData.serviceId,
      clientId: bookingData.clientId,
      status: BookingStatus.PENDING,
      notes: bookingData.notes,
      requestedTime: bookingData.requestedTime,
      duration: bookingData.duration,
      price: bookingData.price,
      isInstant: bookingData.isInstant || false,
      expiresAt: bookingData.expiresAt,
    }
  })
}

export const respondToBookingRequest = async (bookingId: string, status: "accepted" | "declined") => {
  const booking = await prisma.bookingRequest.update({
    where: { id: bookingId },
    data: {
      status: status === "accepted" ? BookingStatus.ACCEPTED : BookingStatus.DECLINED
    },
    include: { service: true }
  })

  // Calculate endTime
  const startTime = booking.requestedTime || new Date()
  const durationMins = booking.duration || booking.service.duration
  const endTime = new Date(startTime.getTime() + durationMins * 60000)

  // Create actual session
  await prisma.appSession.create({
    data: {
      clientId: booking.clientId,
      providerId: booking.service.providerId,
      status: AppSessionStatus.SCHEDULED,
      startTime: startTime,
      endTime: endTime,
      price: booking.price || booking.service.price,
    }
  })
  return booking
}

export const getClientSessions = async (userId: string) => {
  return await prisma.appSession.findMany({
    where: { clientId: userId },
    include: { provider: true, chatRoom: true }
  })
}

export const getProviderSessions = async (userId: string) => {
  return await prisma.appSession.findMany({
    where: { providerId: userId },
    include: { client: true, chatRoom: true }
  })
}

export const createInquirySession = async (clientId: string, providerId: string) => {
  // Check if active inquiry already exists? For now, we allow multiple or reuse active one.
  // Ideally, find open INQUIRY session
  const existing = await prisma.appSession.findFirst({
    where: {
      clientId,
      providerId,
      status: AppSessionStatus.INQUIRY
    },
    include: { chatRoom: true }
  })

  if (existing) return existing

  const session = await prisma.appSession.create({
    data: {
      clientId,
      providerId,
      status: AppSessionStatus.INQUIRY,
      startTime: new Date(),
      price: 0, // Inquiries are free
    }
  })

  // Auto-create chat room for inquiry
  await createChatRoom([], session.id)

  return session
}

// Chat Operations
export const createChatRoom = async (participants: string[], sessionId: string) => {
  // Check if chat room exists for session
  const existing = await prisma.chatRoom.findUnique({
    where: { sessionId }
  })

  if (existing) return existing

  return await prisma.chatRoom.create({
    data: {
      sessionId,
      // participants are implicit via Session -> Client/Provider relation
      // BUT if we want direct participant list for fast lookup, we might rely on Session relations
    }
  })
}

export const sendChatMessage = async (messageData: { chatRoomId: string; senderId: string; content: string }) => {
  return await prisma.message.create({
    data: {
      chatRoomId: messageData.chatRoomId,
      senderId: messageData.senderId,
      content: messageData.content,
      isRead: false
    }
  })
}

export const getChatMessages = async (chatRoomId: string) => {
  return await prisma.message.findMany({
    where: { chatRoomId },
    orderBy: { createdAt: 'asc' },
    include: { sender: true }
  })
}

// Review Operations
export const createReview = async (reviewData: { sessionId: string; clientId: string; providerId: string; rating: number; comment?: string }) => {
  return await prisma.review.create({
    data: {
      sessionId: reviewData.sessionId,
      clientId: reviewData.clientId,
      providerId: reviewData.providerId,
      rating: reviewData.rating,
      comment: reviewData.comment
    }
  })
}

export const getProviderReviews = async (providerId: string) => {
  return await prisma.review.findMany({
    where: { providerId },
    include: { client: { select: { name: true, image: true } } },
    orderBy: { createdAt: 'desc' }
  })
}

// Dispute Operations
export const createDispute = async (disputeData: { sessionId: string; creatorId: string; providerId: string; reason: string }) => {
  return await prisma.dispute.create({
    data: {
      sessionId: disputeData.sessionId,
      creatorId: disputeData.creatorId,
      providerId: disputeData.providerId,
      reason: disputeData.reason,
      status: DisputeStatus.OPEN
    }
  })
}

// Category Operations
export const getCategories = async () => {
  return await prisma.category.findMany({
    include: { children: true }
  })
}

export const createCategory = async (categoryData: { name: string; description?: string; icon?: string; parentId?: string }) => {
  return await prisma.category.create({
    data: {
      name: categoryData.name,
      description: categoryData.description,
      icon: categoryData.icon,
      parentId: categoryData.parentId === "none" ? undefined : categoryData.parentId
    }
  })
}

export const updateCategory = async (categoryId: string, updates: any) => {
  return await prisma.category.update({
    where: { id: categoryId },
    data: updates
  })
}

export const deleteCategory = async (categoryId: string) => {
  return await prisma.category.delete({
    where: { id: categoryId }
  })
}

// Admin / User Management Operations
export const getPendingProviders = async () => {
  return await prisma.user.findMany({
    where: {
      role: UserRole.PROVIDER,
      kycStatus: "SUBMITTED"
    },
    include: { profile: true }
  })
}

export const updateProviderVettingStatus = async (userId: string, status: string) => {
  // status should be "APPROVED" or "REJECTED"
  return await prisma.user.update({
    where: { id: userId },
    data: {
      kycStatus: status,
      kycVerifiedAt: status === "APPROVED" ? new Date() : null,
      profile: {
        update: {
          vettingStatus: status as VettingStatus,
          isVerified: status === "APPROVED"
        }
      }
    }
  })
}

export const getAllIndividualUsers = async () => {
  return await prisma.user.findMany({
    where: { role: UserRole.USER },
    include: { profile: true }
  })
}

export const getAllServiceProviders = async () => {
  return await prisma.user.findMany({
    where: { role: UserRole.PROVIDER },
    include: { profile: true }
  })
}

// Wallet & Payout Operations
import { TransactionType, TransactionStatus, PayoutStatus } from "@prisma/client"

export const getWallet = async (userId: string) => {
  let wallet = await prisma.wallet.findUnique({
    where: { userId },
    include: {
      transactions: { orderBy: { createdAt: 'desc' }, take: 20 },
      payoutRequests: { orderBy: { createdAt: 'desc' }, take: 10 }
    }
  })

  if (!wallet) {
    // Auto-create wallet if not exists
    wallet = await prisma.wallet.create({
      data: { userId },
      include: {
        transactions: true,
        payoutRequests: true
      }
    })
  }
  return wallet
}

export const requestPayout = async (userId: string, amount: number, bankDetails: string) => {
  const wallet = await getWallet(userId)

  if (wallet.balance < amount) {
    throw new Error("Insufficient balance")
  }

  // Use transaction to ensure consistency
  return await prisma.$transaction(async (tx) => {
    // Deduct from balance
    await tx.wallet.update({
      where: { id: wallet.id },
      data: { balance: { decrement: amount } }
    })

    // Create Transaction Record
    await tx.transaction.create({
      data: {
        walletId: wallet.id,
        amount: amount,
        type: TransactionType.WITHDRAWAL,
        status: TransactionStatus.PENDING,
        description: "Payout Request"
      }
    })

    // Create Payout Request
    return await tx.payoutRequest.create({
      data: {
        walletId: wallet.id,
        amount,
        status: PayoutStatus.PENDING,
        bankDetails
      }
    })
  })
}

export const getAdminPayouts = async () => {
  return await prisma.payoutRequest.findMany({
    where: { status: PayoutStatus.PENDING },
    include: { wallet: { include: { user: true } } }
  })
}

export const updatePayoutStatus = async (payoutId: string, status: "APPROVED" | "REJECTED") => {
  return await prisma.$transaction(async (tx) => {
    const payout = await tx.payoutRequest.update({
      where: { id: payoutId },
      data: {
        status: status === "APPROVED" ? PayoutStatus.APPROVED : PayoutStatus.REJECTED,
        processedAt: new Date()
      },
      include: { wallet: true }
    })

    // On rejection, refund the amount to wallet
    if (status === "REJECTED") {
      await tx.wallet.update({
        where: { id: payout.walletId },
        data: { balance: { increment: payout.amount } }
      })

      await tx.transaction.create({
        data: {
          walletId: payout.walletId,
          amount: payout.amount,
          type: TransactionType.REFUND,
          status: TransactionStatus.COMPLETED,
          description: "Payout Rejected Refund"
        }
      })
    }

    return payout
  })
}

// ============================================
// PROVIDER EARNINGS OPERATIONS
// ============================================

export const getProviderEarnings = async (providerId: string) => {
  let earnings = await prisma.providerEarnings.findUnique({
    where: { providerId }
  })

  // Start migration: if no earnings record exists, create one
  if (!earnings) {
    try {
      earnings = await prisma.providerEarnings.create({
        data: { providerId }
      })
    } catch (e) {
      // If race condition where it was just created
      earnings = await prisma.providerEarnings.findUnique({ where: { providerId } });
    }
  }

  return earnings
}

// ============================================
// PRICING TIER OPERATIONS
// ============================================

export async function getPricingTiers() {
  return await prisma.pricingTier.findMany({
    orderBy: { pricePerMinute: 'asc' }
  })
}

export async function createPricingTier(data: {
  name: string
  description?: string
  pricePerMinute: number
  maxSessionsPerDay?: number
  features?: any
  bundleDiscounts?: any
  isActive?: boolean
}) {
  return await prisma.pricingTier.create({ data })
}

export async function updatePricingTier(id: string, data: any) {
  return await prisma.pricingTier.update({
    where: { id },
    data
  })
}

export async function deletePricingTier(id: string) {
  return await prisma.pricingTier.delete({
    where: { id }
  })
}

// ============================================
// BUNDLE PRICING OPERATIONS
// ============================================

export async function getBundlePricing() {
  return await prisma.bundlePricing.findMany({
    orderBy: { minutes: 'asc' }
  })
}

export async function updateBundlePricing(id: string, data: any) {
  return await prisma.bundlePricing.update({
    where: { id },
    data
  })
}

export async function createBundlePricing(data: {
  name: string
  minutes: number
  price: number
  isActive?: boolean
}) {
  return await prisma.bundlePricing.create({ data })
}

// ============================================
// DISPUTE OPERATIONS
// ============================================

export async function getDisputes(filters?: {
  status?: string
  limit?: number
}) {
  return await prisma.dispute.findMany({
    where: filters?.status ? { status: filters.status as any } : undefined,
    include: {
      creator: {
        select: { id: true, name: true, email: true, image: true }
      },
      provider: {
        select: { id: true, name: true, email: true, image: true }
      },
      session: {
        select: { id: true, status: true, startTime: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: filters?.limit || 100
  })
}

export async function getDisputeById(id: string) {
  return await prisma.dispute.findUnique({
    where: { id },
    include: {
      creator: true,
      provider: true,
      session: true,
      reportedBy: true,
      reportedAgainst: true
    }
  })
}

export async function updateDisputeStatus(id: string, status: string, resolution?: string) {
  return await prisma.dispute.update({
    where: { id },
    data: {
      status: status as any,
      resolution,
      resolvedAt: status === 'RESOLVED' ? new Date() : undefined
    }
  })
}

export async function addDisputeNote(id: string, note: string, adminId: string) {
  const dispute = await prisma.dispute.findUnique({
    where: { id },
    select: { notes: true }
  })

  const notes = (dispute?.notes as any[]) || []
  notes.push({
    text: note,
    adminId,
    timestamp: new Date().toISOString()
  })

  return await prisma.dispute.update({
    where: { id },
    data: { notes }
  })
}

// ============================================
// ANALYTICS OPERATIONS
// ============================================

export async function getAdminAnalytics() {
  const [
    totalUsers,
    totalProviders,
    totalSessions,
    totalRevenue,
    pendingDisputes,
    activeProviders
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.user.count({ where: { role: 'PROVIDER' } }),
    prisma.appSession.count(),
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { status: 'COMPLETED' }
    }),
    prisma.dispute.count({ where: { status: 'PENDING' } }),
    prisma.user.count({
      where: {
        role: 'PROVIDER',
        profile: { isVerified: true }
      }
    })
  ])

  return {
    totalUsers,
    totalProviders,
    totalSessions,
    totalRevenue: totalRevenue._sum.amount || 0,
    pendingDisputes,
    activeProviders
  }
}

export async function getRevenueStats(days: number = 30) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const transactions = await prisma.transaction.groupBy({
    by: ['createdAt'],
    where: {
      status: 'COMPLETED',
      createdAt: { gte: startDate }
    },
    _sum: { amount: true },
    _count: true
  })

  return transactions
}

export async function getUserGrowthStats(days: number = 30) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const users = await prisma.user.groupBy({
    by: ['createdAt', 'role'],
    where: {
      createdAt: { gte: startDate }
    },
    _count: true
  })

  return users
}

export async function getTopProviders(limit: number = 10) {
  const providers = await prisma.user.findMany({
    where: { role: 'PROVIDER' },
    include: {
      providerSessions: {
        where: { status: 'COMPLETED' }
      },
      providerReviews: true,
      _count: {
        select: {
          providerSessions: true,
          providerReviews: true
        }
      }
    },
    orderBy: {
      providerSessions: {
        _count: 'desc'
      }
    },
    take: limit
  })

  return providers.map(p => ({
    id: p.id,
    name: p.name,
    email: p.email,
    image: p.image,
    totalSessions: p._count.providerSessions,
    totalReviews: p._count.providerReviews,
    averageRating: p.rating || 0
  }))
}

export async function getTopCategories(limit: number = 10) {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    take: limit,
    orderBy: { createdAt: 'desc' }
  })

  return categories
}

// ============================================
// CATEGORY OPERATIONS (Enhanced)
// ============================================

export async function getCategoriesWithStats() {
  const categories = await prisma.category.findMany({
    include: {
      children: true,
      parent: true
    },
    orderBy: { name: 'asc' }
  })

  return categories.map(cat => ({
    ...cat,
    providerCount: 0,
    subcategories: cat.children.map(c => c.name)
  }))
}

// ============================================
// MINUTE PACKAGES OPERATIONS
// ============================================

export async function getMinutePackages() {
  return await prisma.minutePackage.findMany({
    orderBy: { minutes: 'asc' }
  })
}

export async function createMinutePackage(data: {
  name: string
  minutes: number
  priceZMW: number
  discountPercent?: number
  isActive?: boolean
  isPopular?: boolean
  description?: string
}) {
  return await prisma.minutePackage.create({ data })
}

export async function updateMinutePackage(id: string, data: any) {
  return await prisma.minutePackage.update({
    where: { id },
    data
  })
}

export async function deleteMinutePackage(id: string) {
  return await prisma.minutePackage.delete({
    where: { id }
  })
}

// ============================================
// MINUTE PURCHASES OPERATIONS
// ============================================

export async function getAllMinutePurchases(filters?: any) {
  return await prisma.minutePurchase.findMany({
    where: filters,
    include: {
      wallet: {
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 100
  })
}

export async function getMinutePurchaseStats() {
  const [totalPurchases, totalMinutes, totalRevenue, pendingPayments] = await Promise.all([
    prisma.minutePurchase.count({ where: { paymentStatus: 'COMPLETED' } }),
    prisma.minutePurchase.aggregate({
      where: { paymentStatus: 'COMPLETED' },
      _sum: { minutesPurchased: true }
    }),
    prisma.minutePurchase.aggregate({
      where: { paymentStatus: 'COMPLETED' },
      _sum: { priceZMW: true }
    }),
    prisma.minutePurchase.count({ where: { paymentStatus: 'PENDING' } })
  ])

  return {
    totalPurchases,
    totalMinutes: totalMinutes._sum.minutesPurchased || 0,
    totalRevenue: totalRevenue._sum.priceZMW || 0,
    pendingPayments
  }
}

// ============================================
// PROVIDER EARNINGS OPERATIONS
// ============================================

export async function getAllProviderEarnings() {
  return await prisma.providerEarnings.findMany({
    include: {
      provider: {
        select: { id: true, name: true, email: true, image: true }
      }
    },
    orderBy: { totalEarningsZMW: 'desc' }
  })
}



export async function getProviderEarningsStats() {
  const stats = await prisma.providerEarnings.aggregate({
    _sum: {
      totalMinutesServiced: true,
      totalEarningsZMW: true,
      pendingPayoutZMW: true
    },
    _count: true
  })

  return {
    totalMinutesServiced: stats._sum.totalMinutesServiced || 0,
    totalEarningsPaid: stats._sum.totalEarningsZMW || 0,
    pendingPayouts: stats._sum.pendingPayoutZMW || 0,
    activeProviders: stats._count
  }
}

export async function processProviderPayout(providerId: string, amount: number) {
  return await prisma.$transaction(async (tx) => {
    const earnings = await tx.providerEarnings.update({
      where: { providerId },
      data: {
        pendingPayoutZMW: { decrement: amount },
        lastPayoutDate: new Date(),
        lastPayoutAmount: amount
      }
    })

    const wallet = await tx.wallet.findFirst({
      where: { userId: providerId }
    })

    if (wallet) {
      await tx.payoutRequest.create({
        data: {
          walletId: wallet.id,
          amount,
          status: PayoutStatus.PROCESSED
        }
      })
    }

    return earnings
  })
}
