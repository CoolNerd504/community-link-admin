import { Shield, AlertTriangle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VerificationStatusCardProps {
    status: string
    onVerify: () => void
}

export function VerificationStatusCard({ status, onVerify }: VerificationStatusCardProps) {
    const isVerified = status === "VERIFIED"
    const isPending = status === "PENDING"

    return (
        <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
            <h3 className="text-[18px] font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Shield className="size-5 text-gray-700" />
                Verification Status
            </h3>

            <div className={`p-4 rounded-[16px] mb-6 ${isVerified ? "bg-green-50 border border-green-100" :
                    isPending ? "bg-blue-50 border border-blue-100" :
                        "bg-yellow-50 border border-yellow-100"
                }`}>
                <div className="flex items-start gap-3">
                    {isVerified ? (
                        <Check className="size-5 text-green-600 mt-0.5" />
                    ) : (
                        <AlertTriangle className={`size-5 mt-0.5 ${isPending ? "text-blue-600" : "text-yellow-600"}`} />
                    )}
                    <div>
                        <h4 className={`text-[15px] font-bold ${isVerified ? "text-green-900" :
                                isPending ? "text-blue-900" : "text-yellow-900"
                            }`}>
                            {isVerified ? "Account Verified" : isPending ? "Verification in Progress" : "Action Required"}
                        </h4>
                        <p className={`text-[13px] mt-1 ${isVerified ? "text-green-700" :
                                isPending ? "text-blue-700" : "text-yellow-700"
                            }`}>
                            {isVerified
                                ? "Your identity has been confirmed. You have full access to all provider features."
                                : isPending
                                    ? "We are reviewing your documents. This usually takes 24-48 hours."
                                    : "Submit your ID and credentials to unlock messaging and payments."
                            }
                        </p>
                    </div>
                </div>
            </div>

            {!isVerified && !isPending && (
                <Button onClick={onVerify} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-[12px]">
                    Complete Verification
                </Button>
            )}
        </div>
    )
}
