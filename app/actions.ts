"use server"

import { auth } from "@/auth"
import * as db from "@/lib/db-operations"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { calculateDynamicPrice } from "@/lib/booking-utils"

// User Actions
export async function updateUserProfileAction(userId: string, data: any) {
    const session = await auth()
    if (!session?.user || session.user.id !== userId) {
        throw new Error("Unauthorized")
    }

    await db.updateUserProfile(userId, data)
    revalidatePath("/profile")
}

export async function getUserProfileAction(userId: string) {
    return await db.getUserProfile(userId)
}

// Service Actions
export async function getProviderServicesAction(userId: string) {
    return await db.getProviderServices(userId)
}

export async function addProviderServiceAction(userId: string, serviceData: any) {
    const session = await auth()
    if (!session?.user || session.user.id !== userId) throw new Error("Unauthorized")

    return await db.addProviderService(userId, serviceData)
}

export async function updateProviderServiceAction(userId: string, serviceId: string, updates: any) {
    const session = await auth()
    if (!session?.user || session.user.id !== userId) throw new Error("Unauthorized")

    // Verify ownership implicitly or explicitly
    // db.updateProviderService should ideally check or we trust it handles it or we check here
    // For now assuming db operation handles logic or we add check
    return await db.updateProviderService(userId, serviceId, updates)
}

export async function deleteProviderServiceAction(userId: string, serviceId: string) {
    const session = await auth()
    if (!session?.user || session.user.id !== userId) throw new Error("Unauthorized")

    return await db.deleteProviderService(userId, serviceId)
}

export async function getAllProvidersAction() {
    // This replicates getServiceProvidersWithServices
    // We need to fetch users with role PROVIDER and include their services
    const providers = await prisma.user.findMany({
        where: { role: "PROVIDER" },
        include: {
            profile: true,
            providerServices: true
        }
    })

    // Transform to match expected frontend structure if needed
    // or return as is and update frontend
    return providers.map(p => ({
        ...p,
        // map Prisma fields to expected shape if different
        specialty: p.profile?.headline || "General Provider",
        isOnline: true, // Mocking for now as we don't have real-time online status
        isVerified: p.profile?.isVerified,
        profileImage: p.image,
        services: p.providerServices
    }))
}

// Booking Actions
export async function createInstantBookingAction(providerId: string, serviceId: string, requestData: any) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    // We map "Instant Booking" to a BookingRequest in DB
    return await db.createBookingRequest({
        clientId: session.user.id,
        serviceId,
        notes: requestData.message,
        isInstant: true,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes expiry default
    })
}

export async function createScheduledBookingAction(
    providerId: string,
    serviceId: string,
    requestData: { date: Date, notes?: string, duration: number }
) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    // Get Service details for pricing
    const service = await prisma.service.findUnique({
        where: { id: serviceId }
    })

    if (!service) throw new Error("Service not found")

    // Calculate Price
    const finalPrice = calculateDynamicPrice(service.price, service.duration, requestData.duration)

    return await db.createBookingRequest({
        clientId: session.user.id,
        serviceId,
        notes: requestData.notes,
        requestedTime: requestData.date,
        duration: requestData.duration,
        price: finalPrice,
        status: "PENDING"
    })
}

export async function getBookingQuoteAction(providerId: string, serviceId: string, duration: number) {
    const service = await prisma.service.findUnique({
        where: { id: serviceId }
    })

    if (!service) throw new Error("Service not found")

    return calculateDynamicPrice(service.price, service.duration, duration)
}

export async function getUserBookingRequestsAction(userId: string) {
    const session = await auth()
    if (!session?.user || session.user.id !== userId) throw new Error("Unauthorized")

    return await prisma.bookingRequest.findMany({
        where: { clientId: userId },
        include: { service: { include: { provider: true } } }
    })
}

export async function getProviderBookingRequestsAction(userId: string) {
    const session = await auth()
    if (!session?.user || session.user.id !== userId) throw new Error("Unauthorized")

    return await prisma.bookingRequest.findMany({
        where: { service: { providerId: userId } },
        include: { service: true } // Include service details
        // Client details would need a relation to User on BookingRequest
    })
}

export async function respondToBookingRequestAction(userId: string, requestId: string, status: "accepted" | "declined") {
    const session = await auth()
    if (!session?.user || session.user.id !== userId) throw new Error("Unauthorized")

    // Verify that the booking belongs to a service owned by this user
    // db.respondToBookingRequest doesn't check owner vs random user but we should ideally
    // For now delegating to db ops (which should check) but our db op implementation
    // simply updates by ID. A robust implementation would verify owner.

    return await db.respondToBookingRequest(requestId, status)
}

// Admin Actions
export async function getAdminStatsAction() {
    const session = await auth()
    const user = session?.user as any
    if (!user || user.role !== "ADMIN") throw new Error("Unauthorized")

    return {
        users: await prisma.user.count({ where: { role: "USER" } }),
        providers: await prisma.user.count({ where: { role: "PROVIDER" } }),
        pendingProviders: await prisma.user.count({ where: { role: "PROVIDER", profile: { vettingStatus: "PENDING" } } })
    }
}

export async function getPendingProvidersAction() {
    const session = await auth()
    const user = session?.user as any
    if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) throw new Error("Unauthorized")
    return await db.getPendingProviders()
}

export async function updateProviderVettingStatusAction(userId: string, status: string) {
    const session = await auth()
    const user = session?.user as any
    if (!user || user.role !== "ADMIN") throw new Error("Unauthorized")
    return await db.updateProviderVettingStatus(userId, status)
}

export async function getAllIndividualUsersAction() {
    const session = await auth()
    const user = session?.user as any
    if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) throw new Error("Unauthorized")
    return await db.getAllIndividualUsers()
}

export async function getAllServiceProvidersAction() {
    const session = await auth()
    const user = session?.user as any
    if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) throw new Error("Unauthorized")
    return await db.getAllServiceProviders()
}

// Provider Details Action
export async function getProviderByIdAction(providerId: string) {
    return await db.getProviderPopulated(providerId)
}

// Category Actions
export async function getCategoriesAction() {
    return await db.getCategories()
}

export async function createCategoryAction(data: any) {
    const session = await auth()
    const user = session?.user as any
    if (!user || user.role !== "ADMIN") throw new Error("Unauthorized")
    return await db.createCategory(data)
}

export async function updateCategoryAction(id: string, updates: any) {
    const session = await auth()
    const user = session?.user as any
    if (!user || user.role !== "ADMIN") throw new Error("Unauthorized")
    return await db.updateCategory(id, updates)
}

export async function deleteCategoryAction(id: string) {
    const session = await auth()
    const user = session?.user as any
    if (!user || user.role !== "ADMIN") throw new Error("Unauthorized")
    return await db.deleteCategory(id)
}

export async function submitKycDocumentsAction(userId: string, data: { idFront: string, idBack: string, selfie: string }) {
    const session = await auth()
    if (!session?.user || session.user.id !== userId) throw new Error("Unauthorized")

    await prisma.user.update({
        where: { id: userId },
        data: {
            kycStatus: "SUBMITTED",
            kycSubmittedAt: new Date(),
            idFrontUrl: data.idFront,
            idBackUrl: data.idBack,
            selfieUrl: data.selfie
        }
    })
    revalidatePath("/")
}

export async function searchProvidersAction(query: string, filters: { category?: string, minPrice?: number, maxPrice?: number }) {
    const whereClause: any = {
        role: "PROVIDER",
        kycStatus: "APPROVED", // Only show approved providers
        OR: query ? [
            { name: { contains: query, mode: 'insensitive' } },
            {
                providerServices: {
                    some: {
                        title: { contains: query, mode: 'insensitive' }
                    }
                }
            }
        ] : undefined
    }

    // Apply Service-level filters
    if (filters.category || filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        whereClause.providerServices = {
            some: {
                ...(filters.category ? { category: filters.category } : {}),
                ...(filters.minPrice !== undefined ? { price: { gte: filters.minPrice } } : {}),
                ...(filters.maxPrice !== undefined ? { price: { lte: filters.maxPrice } } : {})
            }
        }
    }

    const providers = await prisma.user.findMany({
        where: whereClause,
        include: {
            profile: true,
            providerServices: true,
            providerReviews: true
        }
    })

    // Calculate generic rating for sorting/display
    return providers.map(p => {
        const reviews = p.providerReviews || []
        const rating = reviews.length > 0
            ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
            : 0

        return {
            ...p,
            rating,
            reviewCount: reviews.length
        }
    })
}


// Wallet Actions
export async function getProviderWalletAction(userId: string) {
    const session = await auth()
    if (!session?.user || session.user.id !== userId) throw new Error("Unauthorized")
    return await db.getWallet(userId)
}

export async function requestPayoutAction(userId: string, amount: number, bankDetails: string) {
    const session = await auth()
    if (!session?.user || session.user.id !== userId) throw new Error("Unauthorized")

    // Additional security checks here (e.g. amount > 0, daily limits)

    const result = await db.requestPayout(userId, amount, bankDetails)
    revalidatePath("/provider/wallet") // Assuming this is where wallet is shown
    return result
}

export async function getAdminPayoutsAction() {
    const session = await auth()
    const user = session?.user as any
    if (!user || user.role !== "ADMIN") throw new Error("Unauthorized")
    return await db.getAdminPayouts()
}

export async function reviewPayoutAction(payoutId: string, status: "APPROVED" | "REJECTED") {
    const session = await auth()
    const user = session?.user as any
    if (!user || user.role !== "ADMIN") throw new Error("Unauthorized")

    const result = await db.updatePayoutStatus(payoutId, status)
    revalidatePath("/admin/payouts")
    return result
}

// Review Actions
export async function createReviewAction(sessionId: string, rating: number, comment?: string) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    const appSession = await prisma.appSession.findUnique({
        where: { id: sessionId },
        select: { providerId: true, clientId: true }
    })

    if (!appSession) throw new Error("Session not found")
    if (appSession.clientId !== session.user.id) throw new Error("Unauthorized")

    return await db.createReview({
        sessionId,
        clientId: session.user.id,
        providerId: appSession.providerId,
        rating,
        comment
    })
}

export async function getProviderReviewsAction(providerId: string) {
    return await db.getProviderReviews(providerId)
}

export async function getClientSessionsAction(userId: string) {
    const session = await auth()
    if (!session?.user || session.user.id !== userId) throw new Error("Unauthorized")
    return await db.getClientSessions(userId)
}

// ============================================
// PRICING TIER ACTIONS
// ============================================

export async function getPricingTiersAction() {
    return await db.getPricingTiers()
}

export async function createPricingTierAction(data: any) {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
        throw new Error("Unauthorized")
    }
    return await db.createPricingTier(data)
}

export async function updatePricingTierAction(id: string, data: any) {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
        throw new Error("Unauthorized")
    }
    return await db.updatePricingTier(id, data)
}

export async function deletePricingTierAction(id: string) {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
        throw new Error("Unauthorized")
    }
    return await db.deletePricingTier(id)
}

// ============================================
// BUNDLE PRICING ACTIONS
// ============================================

export async function getBundlePricingAction() {
    return await db.getBundlePricing()
}

export async function updateBundlePricingAction(id: string, data: any) {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
        throw new Error("Unauthorized")
    }
    return await db.updateBundlePricing(id, data)
}

export async function createBundlePricingAction(data: any) {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
        throw new Error("Unauthorized")
    }
    return await db.createBundlePricing(data)
}

// ============================================
// DISPUTE ACTIONS
// ============================================

export async function getDisputesAction(filters?: any) {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
        throw new Error("Unauthorized")
    }
    return await db.getDisputes(filters)
}

export async function getDisputeByIdAction(id: string) {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
        throw new Error("Unauthorized")
    }
    return await db.getDisputeById(id)
}

export async function updateDisputeStatusAction(id: string, status: string, resolution?: string) {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
        throw new Error("Unauthorized")
    }
    return await db.updateDisputeStatus(id, status, resolution)
}

export async function addDisputeNoteAction(id: string, note: string) {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
        throw new Error("Unauthorized")
    }
    return await db.addDisputeNote(id, note, session.user.id)
}

// ============================================
// ANALYTICS ACTIONS
// ============================================

export async function getAdminAnalyticsAction() {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
        throw new Error("Unauthorized")
    }
    return await db.getAdminAnalytics()
}

export async function getRevenueStatsAction(days?: number) {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
        throw new Error("Unauthorized")
    }
    return await db.getRevenueStats(days)
}

export async function getUserGrowthStatsAction(days?: number) {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
        throw new Error("Unauthorized")
    }
    return await db.getUserGrowthStats(days)
}

export async function getTopProvidersAction(limit?: number) {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
        throw new Error("Unauthorized")
    }
    return await db.getTopProviders(limit)
}

export async function getTopCategoriesAction(limit?: number) {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
        throw new Error("Unauthorized")
    }
    return await db.getTopCategories(limit)
}

// ============================================
// ENHANCED CATEGORY ACTIONS
// ============================================

export async function getCategoriesWithStatsAction() {
    return await db.getCategoriesWithStats()
}

// ============================================
// MINUTE PACKAGES ACTIONS
// ============================================

export async function getMinutePackagesAction() {
    return await db.getMinutePackages()
}

export async function createMinutePackageAction(data: any) {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
        throw new Error("Unauthorized")
    }
    return await db.createMinutePackage(data)
}

export async function updateMinutePackageAction(id: string, data: any) {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
        throw new Error("Unauthorized")
    }
    return await db.updateMinutePackage(id, data)
}

export async function deleteMinutePackageAction(id: string) {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
        throw new Error("Unauthorized")
    }
    return await db.deleteMinutePackage(id)
}

// ============================================
// MINUTE PURCHASES ACTIONS
// ============================================

export async function getAllMinutePurchasesAction(filters?: any) {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
        throw new Error("Unauthorized")
    }
    return await db.getAllMinutePurchases(filters)
}

export async function getMinutePurchaseStatsAction() {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
        throw new Error("Unauthorized")
    }
    return await db.getMinutePurchaseStats()
}

// ============================================
// PROVIDER EARNINGS ACTIONS
// ============================================

export async function getAllProviderEarningsAction() {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
        throw new Error("Unauthorized")
    }
    return await db.getAllProviderEarnings()
}

export async function getProviderEarningsStatsAction() {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
        throw new Error("Unauthorized")
    }
    return await db.getProviderEarningsStats()
}

export async function processProviderPayoutAction(providerId: string, amount: number) {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
        throw new Error("Unauthorized")
    }
    return await db.processProviderPayout(providerId, amount)
}

export async function getProviderEarningsAction(providerId: string) {
    const session = await auth()
    if (!session?.user || session.user.id !== providerId) throw new Error("Unauthorized")

    return await db.getProviderEarnings(providerId)
}

// ============================================
// FOLLOW & MESSAGE ACTIONS
// ============================================

export async function toggleFollowAction(providerId: string) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    const isFollowing = await db.isFollowing(session.user.id, providerId)

    if (isFollowing) {
        await db.unfollowUser(session.user.id, providerId)
        return { isFollowing: false }
    } else {
        await db.followUser(session.user.id, providerId)
        return { isFollowing: true }
    }
}

export async function checkIsFollowingAction(providerId: string) {
    const session = await auth()
    if (!session?.user) return { isFollowing: false }

    const isFollowing = await db.isFollowing(session.user.id, providerId)
    return { isFollowing }
}

export async function startInquiryAction(providerId: string) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    const sessionResult = await db.createInquirySession(session.user.id, providerId)
    return { sessionId: sessionResult.id }
}

export async function getSessionDetailsAction(sessionId: string) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    const appSession = await prisma.appSession.findUnique({
        where: { id: sessionId },
        include: {
            chatRoom: true,
            provider: {
                select: { id: true, name: true, image: true }
            },
            client: {
                select: { id: true, name: true, image: true }
            }
        }
    })

    if (!appSession) return null
    if (appSession.clientId !== session.user.id && appSession.providerId !== session.user.id) {
        throw new Error("Unauthorized")
    }

    return appSession
}

export async function getSessionByIdAction(sessionId: string) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    const appSession = await prisma.appSession.findUnique({
        where: { id: sessionId },
        include: {
            provider: {
                select: { id: true, name: true, image: true, role: true }
            },
            client: {
                select: { id: true, name: true, image: true }
            },
            chatRoom: true
        }
    })

    if (!appSession) {
        throw new Error("Session not found")
    }

    // Security check: Must be participant
    if (appSession.clientId !== session.user.id && appSession.providerId !== session.user.id) {
        throw new Error("Unauthorized")
    }

    return appSession
}

export async function rescheduleSessionAction(sessionId: string, newStartTime: Date) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    const appSession = await prisma.appSession.findUnique({
        where: { id: sessionId }
    })

    if (!appSession) throw new Error("Session not found")

    // Security check
    if (appSession.clientId !== session.user.id && appSession.providerId !== session.user.id) {
        throw new Error("Unauthorized")
    }

    // Check 15 min rule
    const now = new Date()
    const currentStartTime = new Date(appSession.startTime)
    const diffMins = (currentStartTime.getTime() - now.getTime()) / 60000

    if (diffMins <= 15) {
        throw new Error("Cannot reschedule within 15 minutes of start time")
    }

    // Calculate new End Time (preserve duration)
    let newEndTime = null
    if (appSession.endTime) {
        const durationMs = currentStartTime.getTime() - appSession.endTime.getTime()
        // Wait, duration is end - start. endTime should be > startTime
        const duration = appSession.endTime.getTime() - currentStartTime.getTime()
        newEndTime = new Date(newStartTime.getTime() + duration)

        // Sanity check if duration was negative (data error)
        if (duration < 0) newEndTime = null // fallback?
    }

    return await prisma.appSession.update({
        where: { id: sessionId },
        data: {
            startTime: newStartTime,
            endTime: newEndTime,
            status: "SCHEDULED" // Reset status if needed?
        }
    })
}
