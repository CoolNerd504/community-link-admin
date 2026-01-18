export interface BookingResponse {
    id: string
    status: "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED" | "CONFIRMED" | "COMPLETED" | "CANCELLED"
    requestedTime: string | null // ISO Date
    duration: number
    price: number
    isInstant: boolean
    expiresAt: string | null
    notes: string | null
    createdAt: string
    updatedAt: string
    clientId: string
    serviceId: string
    service: {
        id: string
        title: string
        category: string
        price: number
        duration: number
        providerId: string
        provider: {
            id: string
            name: string
            image: string | null
            role: "PROVIDER" | "USER" | "ADMIN"
            kycStatus: "PENDING" | "SUBMITTED" | "VERIFIED" | "REJECTED"
            profile?: {
                headline?: string
                isVerified?: boolean
                bio?: string
            }
        }
    }
    client: {
        id: string
        name: string
        image: string | null
    }
}

export interface BookingStats {
    totalHours: number
    activeBookings: number
    walletCredits: number
    currency: string
}
