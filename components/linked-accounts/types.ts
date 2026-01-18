export interface LinkedAccount {
    id: string
    provider: string
    type: string
    createdAt: string
}

export interface ProviderConfig {
    id: string
    name: string
    icon: React.ReactNode
    description: string
    color: string
    bgColor: string
}
