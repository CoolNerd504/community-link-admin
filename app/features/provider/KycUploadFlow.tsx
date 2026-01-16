"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Upload, CheckCircle, Smartphone } from "lucide-react"
import { submitKycDocumentsAction } from "../../actions"
import { useRouter } from "next/navigation"

interface KycUploadFlowProps {
    userId: string
    userName: string
}

export function KycUploadFlow({ userId, userName }: KycUploadFlowProps) {
    const router = useRouter()
    const [step, setStep] = useState<1 | 2 | 3>(1) // 1: ID Front, 2: ID Back, 3: Selfie
    const [loading, setLoading] = useState(false)
    const [files, setFiles] = useState<{ idFront: File | null, idBack: File | null, selfie: File | null }>({
        idFront: null,
        idBack: null,
        selfie: null
    })

    // Mock upload urls for now
    const [uploadedUrls, setUploadedUrls] = useState<{ idFront: string, idBack: string, selfie: string }>({
        idFront: "",
        idBack: "",
        selfie: ""
    })

    const handleFileChange = (key: keyof typeof files, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setFiles(prev => ({ ...prev, [key]: file }))

            // Simulate immediate "upload" to get a local URL for preview
            // In real app, we would upload to storage here or on submit
            const mockUrl = URL.createObjectURL(file)
            setUploadedUrls(prev => ({ ...prev, [key]: mockUrl }))
        }
    }

    const handleNext = () => {
        if (step < 3) setStep(prev => (prev + 1) as 1 | 2 | 3)
    }

    const handleBack = () => {
        if (step > 1) setStep(prev => (prev - 1) as 1 | 2 | 3)
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            // In a real app, upload files to S3/Firebase here and get actual URLs
            // For now using mock/blob URLs which won't persist but serve for Demo flow
            // Or better: use a placeholder "uploaded-file-name" string for DB to avoid broken images

            const payload = {
                idFront: uploadedUrls.idFront || "https://placehold.co/600x400?text=ID+Front",
                idBack: uploadedUrls.idBack || "https://placehold.co/600x400?text=ID+Back",
                selfie: uploadedUrls.selfie || "https://placehold.co/400x400?text=Selfie"
            }

            await submitKycDocumentsAction(userId, payload)

            // Use window.location for more reliable redirect
            window.location.href = '/'
        } catch (error) {
            console.error("KYC Submission failed", error)
            alert("Failed to submit documents. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleSkip = () => {
        // Allow user to skip KYC and complete later
        window.location.href = '/'
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-2xl w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Verify Your Identity</h1>
                    <p className="mt-2 text-gray-600">
                        Welcome, {userName}. To activate your Provider account, we need to verify your identity.
                    </p>
                    <Button
                        variant="ghost"
                        className="mt-4 text-gray-600 hover:text-gray-900"
                        onClick={handleSkip}
                    >
                        Skip for Now →
                    </Button>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-center items-center space-x-4">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= s ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
                                }`}>
                                {s}
                            </div>
                            {s < 3 && <div className={`w-12 h-1 ${step > s ? "bg-blue-600" : "bg-gray-200"}`} />}
                        </div>
                    ))}
                </div>

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>
                            {step === 1 && "Upload ID (Front)"}
                            {step === 2 && "Upload ID (Back)"}
                            {step === 3 && "Take a Selfie"}
                        </CardTitle>
                        <CardDescription>
                            {step === 1 && "Please upload a clear photo of the front of your National Registration Card (NRC) or Passport."}
                            {step === 2 && "Please upload a clear photo of the back of your ID document."}
                            {step === 3 && "Please take a clear photo of your face to match with your ID."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                            <Input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) => handleFileChange(
                                    step === 1 ? "idFront" : step === 2 ? "idBack" : "selfie",
                                    e
                                )}
                            />

                            {step === 1 && uploadedUrls.idFront ? (
                                <img src={uploadedUrls.idFront} alt="ID Front Preview" className="max-h-64 object-contain rounded" />
                            ) : step === 2 && uploadedUrls.idBack ? (
                                <img src={uploadedUrls.idBack} alt="ID Back Preview" className="max-h-64 object-contain rounded" />
                            ) : step === 3 && uploadedUrls.selfie ? (
                                <img src={uploadedUrls.selfie} alt="Selfie Preview" className="max-h-64 object-cover rounded-full" />
                            ) : (
                                <>
                                    {step === 3 ? <Smartphone className="h-12 w-12 text-gray-400 mb-4" /> : <Upload className="h-12 w-12 text-gray-400 mb-4" />}
                                    <p className="text-sm font-medium text-gray-900">
                                        {step === 3 ? "Take or Upload Selfie" : "Click to Upload or Drag and Drop"}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG (max. 5MB)</p>
                                </>
                            )}
                        </div>

                        <div className="flex justify-between pt-4">
                            <Button
                                variant="outline"
                                onClick={handleBack}
                                disabled={step === 1 || loading}
                            >
                                Back
                            </Button>

                            {step < 3 ? (
                                <Button
                                    onClick={handleNext}
                                    disabled={
                                        (step === 1 && !files.idFront) ||
                                        (step === 2 && !files.idBack)
                                    }
                                >
                                    Next Step
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!files.selfie || loading}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    {loading ? "Submitting..." : "Submit for Verification"}
                                </Button>
                            )}
                        </div>

                        {step === 3 && (
                            <div className="bg-blue-50 p-4 rounded-md flex items-start space-x-2">
                                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                                <p className="text-sm text-blue-800">
                                    By submitting, you consent to our processing of your biometric data for identity verification purposes in accordance with our Privacy Policy.
                                </p>
                            </div>
                        )}

                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
