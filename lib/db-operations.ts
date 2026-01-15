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
            providerServices: true // Correct relation name from previous edit
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
            notes: bookingData.notes
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

    if (status === "accepted") {
        // Create actual session
        await prisma.appSession.create({
            data: {
                clientId: booking.clientId,
                providerId: booking.service.providerId,
                status: AppSessionStatus.SCHEDULED,
                startTime: new Date(), // Should come from booking data technically
                price: booking.service.price,
            }
        })
    }
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
    // Assuming users with role PROVIDER and profile.vettingStatus = PENDING
    return await prisma.user.findMany({
        where: {
            role: UserRole.PROVIDER,
            profile: {
                vettingStatus: "PENDING"
            }
        },
        include: { profile: true }
    })
}

export const updateProviderVettingStatus = async (userId: string, status: string) => {
    return await prisma.profile.update({
        where: { userId },
        data: {
            vettingStatus: status as VettingStatus,
            isVerified: status === "APPROVED" // Auto-verify if approved, or logic depends on rules
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
