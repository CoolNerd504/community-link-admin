import { CreditCard, TrendingUp, Calendar, ArrowUpRight, Download } from "lucide-react"

interface Transaction {
    id: string
    type: "credit" | "debit"
    amount: number
    description: string
    date: string
    status: "completed" | "pending" | "failed"
}

interface WalletTabProps {
    wallet: any
    transactions?: Transaction[]
}

export function WalletTab({ wallet, transactions = [] }: WalletTabProps) {
    const defaultTransactions: Transaction[] = [
        { id: "1", type: "debit", amount: 25.00, description: "Session with Sarah J.", date: "Today, 2:30 PM", status: "completed" },
        { id: "2", type: "debit", amount: 150.00, description: "Wallet Top-up", date: "Yesterday, 10:00 AM", status: "completed" },
        { id: "3", type: "credit", amount: 50.00, description: "Refund: Session Cancellation", date: "Jan 12, 2024", status: "completed" },
    ]

    const displayTransactions = transactions.length > 0 ? transactions : defaultTransactions

    return (
        <div className="space-y-6">
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] rounded-[24px] p-8 text-white shadow-lg">
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <p className="text-[14px] text-white/80 mb-2">Available Balance</p>
                        <p className="text-[36px] font-bold">
                            {wallet?.currency || "ZMW"} {wallet?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}
                        </p>
                    </div>
                    <div className="size-12 bg-white/20 rounded-[12px] flex items-center justify-center backdrop-blur-sm">
                        <CreditCard className="size-6 text-white" />
                    </div>
                </div>

                <div className="flex gap-4">
                    <button className="flex-1 bg-white text-[#2563eb] rounded-[12px] py-3 font-semibold text-[15px] hover:bg-white/90 transition-colors shadow-sm">
                        Add Funds
                    </button>
                    <button className="flex-1 bg-white/20 text-white rounded-[12px] py-3 font-semibold text-[15px] hover:bg-white/30 transition-colors backdrop-blur-sm">
                        Withdraw
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#f5f5f5] rounded-[16px] p-4 border border-[#eee]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="size-10 bg-white rounded-[12px] flex items-center justify-center">
                            <TrendingUp className="size-5 text-[#16a34a]" />
                        </div>
                        <div>
                            <p className="text-[13px] text-[#767676]">Total Spent</p>
                            <p className="text-[20px] font-bold text-[#181818]">ZMW 3,250</p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#f5f5f5] rounded-[16px] p-4 border border-[#eee]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="size-10 bg-white rounded-[12px] flex items-center justify-center">
                            <Calendar className="size-5 text-[#2563eb]" />
                        </div>
                        <div>
                            <p className="text-[13px] text-[#767676]">This Month</p>
                            <p className="text-[20px] font-bold text-[#181818]">ZMW 975</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[20px] font-bold text-[#181818]">Recent Transactions</h2>
                    <button className="text-[14px] font-semibold text-[#2563eb] hover:text-[#1d4ed8] flex items-center gap-1 hover:underline">
                        View All
                        <ArrowUpRight className="size-4" />
                    </button>
                </div>

                <div className="space-y-3">
                    {displayTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 bg-[#f5f5f5] rounded-[16px] hover:bg-[#efefef] transition-colors border border-transparent hover:border-[#eee]">
                            <div className="flex items-center gap-4">
                                <div className={`size-10 rounded-[12px] flex items-center justify-center ${transaction.type === "credit" ? "bg-[#dcfce7]" : "bg-[#fee2e2]"
                                    }`}>
                                    {transaction.type === "credit" ? (
                                        <ArrowUpRight className="size-5 text-[#16a34a] rotate-180" />
                                    ) : (
                                        <ArrowUpRight className="size-5 text-[#ef4444]" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-[14px] font-semibold text-[#181818]">
                                        {transaction.description}
                                    </p>
                                    <p className="text-[12px] text-[#767676]">{transaction.date}</p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className={`text-[16px] font-bold ${transaction.type === "credit" ? "text-[#16a34a]" : "text-[#767676]"
                                    // Debit used to be red, but standard practice often just black/gray for reduction unless emphasizing loss
                                    // Guide said Red for debit.
                                    } ${transaction.type === "debit" ? "text-[#ef4444]" : ""}`}>
                                    {transaction.type === "credit" ? "+" : "-"}
                                    {wallet?.currency || "ZMW"} {transaction.amount.toFixed(2)}
                                </p>
                                <span className={`text-[11px] font-semibold ${transaction.status === "completed" ? "text-[#16a34a]" :
                                        transaction.status === "pending" ? "text-[#f59e0b]" :
                                            "text-[#ef4444]"
                                    }`}>
                                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="w-full mt-6 py-3 rounded-[16px] border-2 border-dashed border-[#eee] text-[14px] font-semibold text-[#767676] hover:border-[#2563eb] hover:text-[#2563eb] hover:bg-[#f0f4ff] flex items-center justify-center gap-2 transition-all">
                    <Download className="size-4" />
                    Download Statement
                </button>
            </div>
        </div>
    )
}
