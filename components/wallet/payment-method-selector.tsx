import { Smartphone, CreditCard, Check } from "lucide-react"
import { MinutePackage } from "./minute-package-grid"

interface PaymentMethodSelectorProps {
    packages: MinutePackage[]
    selectedPackageId: string
    selectedMethod: string | null
    onSelectMethod: (method: string) => void
    onPurchase: () => void
    currency: string
}

export function PaymentMethodSelector({
    packages,
    selectedPackageId,
    selectedMethod,
    onSelectMethod,
    onPurchase,
    currency
}: PaymentMethodSelectorProps) {
    const selectedPackage = packages.find(p => p.id === selectedPackageId)

    if (!selectedPackage) return null

    return (
        <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)]">
            <h3 className="text-[18px] font-semibold text-[#181818] mb-4">
                Select Payment Method
            </h3>

            {/* Payment Method Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* Mobile Money */}
                <button
                    onClick={() => onSelectMethod("MOBILE_MONEY")}
                    className={`flex items-center gap-3 p-4 rounded-[16px] border-2 transition-all ${selectedMethod === "MOBILE_MONEY"
                            ? "border-[#2563eb] bg-[#f0f4ff]"
                            : "border-[#eee] hover:border-[#2563eb]"
                        }`}
                >
                    <Smartphone className="size-6 text-[#2563eb]" />
                    <div className="text-left">
                        <p className="text-[14px] font-semibold text-[#181818]">Mobile Money</p>
                        <p className="text-[12px] text-[#767676]">MTN, Airtel, Zamtel</p>
                    </div>
                    {selectedMethod === "MOBILE_MONEY" && (
                        <Check className="size-5 text-[#2563eb] ml-auto" />
                    )}
                </button>

                {/* Credit Card */}
                <button
                    onClick={() => onSelectMethod("CREDIT_CARD")}
                    className={`flex items-center gap-3 p-4 rounded-[16px] border-2 transition-all ${selectedMethod === "CREDIT_CARD"
                            ? "border-[#2563eb] bg-[#f0f4ff]"
                            : "border-[#eee] hover:border-[#2563eb]"
                        }`}
                >
                    <CreditCard className="size-6 text-[#2563eb]" />
                    <div className="text-left">
                        <p className="text-[14px] font-semibold text-[#181818]">Credit Card</p>
                        <p className="text-[12px] text-[#767676]">Visa, Mastercard</p>
                    </div>
                    {selectedMethod === "CREDIT_CARD" && (
                        <Check className="size-5 text-[#2563eb] ml-auto" />
                    )}
                </button>
            </div>

            {/* Purchase Summary */}
            <div className="bg-[#f5f5f5] rounded-[16px] p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[14px] text-[#767676]">Package:</span>
                    <span className="text-[14px] font-semibold text-[#181818]">
                        {selectedPackage.name}
                    </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[14px] text-[#767676]">Minutes:</span>
                    <span className="text-[14px] font-semibold text-[#181818]">
                        {selectedPackage.minutes}
                    </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#eee]">
                    <span className="text-[16px] font-semibold text-[#181818]">Total:</span>
                    <span className="text-[20px] font-bold text-[#181818]">
                        {currency} {selectedPackage.price.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Complete Purchase Button */}
            <button
                onClick={onPurchase}
                disabled={!selectedMethod}
                className={`w-full bg-[#2563eb] text-white rounded-[12px] py-4 font-semibold text-[16px] transition-colors flex items-center justify-center gap-2 ${!selectedMethod ? "opacity-50 cursor-not-allowed" : "hover:bg-[#1d4ed8]"
                    }`}
            >
                <Check className="size-5" />
                Complete Purchase
            </button>
        </div>
    )
}
