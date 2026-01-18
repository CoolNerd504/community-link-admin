import { ArrowUpRight } from "lucide-react"

interface Transaction {
    id: string
    type: string
    minutesPurchased?: number
    amount: number
    description: string
    paymentStatus: string
    createdAt: string
}

interface TransactionHistoryProps {
    transactions: Transaction[]
    currency: string
}

export function TransactionHistory({ transactions, currency }: TransactionHistoryProps) {
    if (transactions.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-[24px] border border-[#eee]">
                <p className="text-[#767676]">No transactions yet.</p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {transactions.map((transaction) => {
                const isCredit = transaction.type === "DEPOSIT" || transaction.minutesPurchased

                return (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-[#f5f5f5] rounded-[16px] hover:bg-[#efefef] transition-colors border border-transparent hover:border-[#eee]">
                        <div className="flex items-center gap-4">
                            <div className={`size-10 rounded-[12px] flex items-center justify-center ${isCredit ? "bg-[#dcfce7]" : "bg-[#fee2e2]"
                                }`}>
                                {isCredit ? (
                                    <ArrowUpRight className="size-5 text-[#16a34a] rotate-180" />
                                ) : (
                                    <ArrowUpRight className="size-5 text-[#ef4444]" />
                                )}
                            </div>
                            <div>
                                <p className="text-[14px] font-semibold text-[#181818]">
                                    {transaction.description || `Minutes Purchase`}
                                </p>
                                <p className="text-[12px] text-[#767676]">
                                    {new Date(transaction.createdAt).toLocaleDateString()} at {new Date(transaction.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className={`text-[16px] font-bold ${isCredit ? "text-[#16a34a]" : "text-[#767676]"
                                }`}>
                                {isCredit ? "+" : "-"}
                                {currency} {transaction.amount.toFixed(2)}
                            </p>
                            <span className={`text-[11px] font-semibold ${transaction.paymentStatus === "COMPLETED" ? "text-[#16a34a]" :
                                    transaction.paymentStatus === "PENDING" ? "text-[#f59e0b]" :
                                        "text-[#ef4444]"
                                }`}>
                                {transaction.paymentStatus}
                            </span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
