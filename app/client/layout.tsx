import { FeatureNavigation } from "@/components/feature-navigation"

export default function ClientLayout({
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
