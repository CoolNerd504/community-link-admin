import { FeatureNavigation } from "@/components/feature-navigation"

export default function ProviderLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen">
            <FeatureNavigation />
            {children}
        </div>
    )
}
