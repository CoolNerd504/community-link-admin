import { TabItem } from "./types"

interface TabNavigationProps {
    tabs: TabItem[]
    activeTab: string
    onTabChange: (id: string) => void
}

export function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps) {
    return (
        <div className="bg-white rounded-[24px] border border-[#eee] p-2 flex gap-2 mb-6 overflow-x-auto">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex-1 px-6 py-3 rounded-[16px] text-[15px] font-semibold transition-colors whitespace-nowrap ${activeTab === tab.id
                            ? "bg-[#181818] text-white"
                            : "text-[#767676] hover:text-[#181818]"
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    )
}
