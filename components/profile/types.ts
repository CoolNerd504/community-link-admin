import { LucideIcon } from "lucide-react"

export interface Service {
    id: string
    title: string
    description: string
    price: number
    duration: number
    category: string
    deliveryType?: "video" | "written" | "both"
    isActive: boolean
}

export interface Review {
    id: string
    rating: number
    comment: string
    createdAt: Date
    client: {
        name: string
        image?: string
    }
}

export interface Profile {
    bio?: string
    headline?: string
    location?: string
    languages: string[]
    interests: string[]
    timezone?: string
    hourlyRate?: number
    isOnline: boolean
    isVerified: boolean
}

export interface Provider {
    id: string
    name: string
    email: string
    image?: string | null
    profile: Profile
    rating: number
    reviewCount: number
    sessions: number
    experience: number
    services: Service[]
    reviews: Review[]
    kycStatus?: string
    isFavorite: boolean
    isFollowing: boolean
}

export interface TabItem {
    id: string
    label: string
}
