import { Check } from "lucide-react"

export interface MinutePackage {
    id: string
    name: string
    minutes: number
    price: number
    description?: string
}

interface MinutePackageGridProps {
    packages: MinutePackage[]
    selectedPackage: string | null
    onSelect: (id: string) => void
    currency: string
}

export function MinutePackageGrid({ packages, selectedPackage, onSelect, currency }: MinutePackageGridProps) {
    const getBadgeColor = (packageName: string) => {
        const colors: Record<string, { bg: string; text: string }> = {
            "Starter": { bg: "#dbeafe", text: "#2563eb" },      // Blue
            "Basic": { bg: "#f3e8ff", text: "#9333ea" },        // Purple
            "Professional": { bg: "#dcfce7", text: "#16a34a" }, // Green
            "Premium": { bg: "#fef3c7", text: "#f59e0b" },      // Orange
            "Enterprise": { bg: "#fee2e2", text: "#ef4444" }    // Red
        }
        return colors[packageName] || { bg: "#f5f5f5", text: "#767676" }
    }

    const getRecommendedBadge = (packageId: string) => {
        // Can be more complex, but for now specific ID or based on logic
        return packageId === "pkg_120"
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-[20px] font-bold text-[#181818] mb-1">
                        Choose Your Package
                    </h2>
                    <p className="text-[14px] text-[#767676]">
                        Select a minute package that fits your needs
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {packages.map((pkg) => {
                    const isSelected = selectedPackage === pkg.id
                    const isRecommended = getRecommendedBadge(pkg.id)
                    const badgeColor = getBadgeColor(pkg.name)

                    return (
                        <div
                            key={pkg.id}
                            onClick={() => onSelect(pkg.id)}
                            className={`relative backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border-2 p-6 cursor-pointer transition-all ${isSelected
                                    ? "border-[#2563eb] shadow-[0px_20px_40px_0px_rgba(37,99,235,0.15)]"
                                    : "border-[#eee] hover:border-[#2563eb] hover:shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)]"
                                }`}
                        >
                            {/* 1. Recommended Badge */}
                            {isRecommended && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="px-4 py-1 bg-[#f59e0b] text-white rounded-full text-[11px] font-bold tracking-wide shadow-lg whitespace-nowrap">
                                        MOST POPULAR
                                    </span>
                                </div>
                            )}

                            {/* 2. Selection Indicator */}
                            {isSelected && (
                                <div className="absolute top-4 right-4">
                                    <div className="size-6 bg-[#2563eb] rounded-full flex items-center justify-center">
                                        <Check className="size-4 text-white" />
                                    </div>
                                </div>
                            )}

                            {/* 3. Package Badge */}
                            <div className="mb-4">
                                <span
                                    className="px-3 py-1 rounded-full text-[12px] font-bold"
                                    style={{
                                        backgroundColor: badgeColor.bg,
                                        color: badgeColor.text
                                    }}
                                >
                                    {pkg.name}
                                </span>
                            </div>

                            {/* 4. Minutes Display */}
                            <div className="mb-3">
                                <p className="text-[40px] font-bold text-[#181818] leading-none">
                                    {pkg.minutes}
                                </p>
                                <p className="text-[14px] text-[#767676] mt-1">MINUTES</p>
                            </div>

                            {/* 5. Description */}
                            {pkg.description && (
                                <p className="text-[13px] text-[#767676] mb-4 min-h-[40px]">{pkg.description}</p>
                            )}

                            {/* 6. Price */}
                            <div className="flex items-baseline gap-2 mb-4">
                                <p className="text-[28px] font-bold text-[#181818]">
                                    {currency} {pkg.price.toLocaleString()}
                                </p>
                                <p className="text-[14px] text-[#767676]">
                                    ({(pkg.price / pkg.minutes).toFixed(1)} per min)
                                </p>
                            </div>

                            {/* 7. Features List */}
                            <div className="space-y-2 pt-4 border-t border-[#eee]">
                                <div className="flex items-center gap-2 text-[13px] text-[#767676]">
                                    <Check className="size-4 text-[#16a34a]" />
                                    <span>Valid for 12 months</span>
                                </div>
                                <div className="flex items-center gap-2 text-[13px] text-[#767676]">
                                    <Check className="size-4 text-[#16a34a]" />
                                    <span>Use anytime, any provider</span>
                                </div>
                                <div className="flex items-center gap-2 text-[13px] text-[#767676]">
                                    <Check className="size-4 text-[#16a34a]" />
                                    <span>Instant activation</span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
