import { User, Shield, CreditCard, Settings } from "lucide-react"

interface TabNavigationProps {
    activeTab: string
    onChange: (tab: string) => void
}

export function TabNavigation({ activeTab, onChange }: TabNavigationProps) {
    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "security", label: "Security", icon: Shield },
        { id: "wallet", label: "Wallet", icon: CreditCard },
        { id: "settings", label: "Settings", icon: Settings },
    ]

    return (
        <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-2 mb-8 shadow-[0px_8px_24px_0px_rgba(0,0,0,0.04)]">
            <div className="flex gap-2 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-[16px] text-[14px] font-semibold transition-all duration-200 whitespace-nowrap ${activeTab === tab.id
                                ? "bg-[#2563eb] text-white shadow-md"
                                : "text-[#767676] hover:bg-[#f5f5f5] hover:text-[#181818]"
                            }`}
                    >
                        <tab.icon className="size-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}
