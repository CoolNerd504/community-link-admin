import { Search, Plus } from "lucide-react"

interface BookingsHeaderProps {
    onSearch: (term: string) => void
    onNewBooking: () => void
}

export function BookingsHeader({ onSearch, onNewBooking }: BookingsHeaderProps) {
    return (
        <div className="bg-white border-b border-[#eee] sticky top-0 z-10 px-4 py-6 md:px-8">
            <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[28px] font-bold text-[#181818] mb-1">
                        Bookings & Sessions
                    </h1>
                    <p className="text-[15px] text-[#767676]">
                        Manage your appointments and session history
                    </p>
                </div>

                {/* Search + New Booking Button */}
                <div className="flex items-center gap-3">
                    {/* Search Input */}
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#767676]" />
                        <input
                            type="text"
                            placeholder="Search bookings..."
                            onChange={(e) => onSearch(e.target.value)}
                            className="w-[280px] h-[44px] pl-10 pr-4 rounded-[12px] border border-[#eee] bg-[#f5f5f5] text-[14px] focus:outline-none focus:border-[#2563eb]"
                        />
                    </div>

                    {/* New Booking Button */}
                    <button
                        onClick={onNewBooking}
                        className="flex items-center gap-2 px-4 h-[44px] bg-[#2563eb] text-white rounded-[12px] font-semibold text-[14px] hover:bg-[#1d4ed8]"
                    >
                        <Plus className="size-4" />
                        <span className="hidden sm:inline">New Booking</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
