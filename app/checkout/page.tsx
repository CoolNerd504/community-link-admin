"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function CheckoutPage() {
  const params = useSearchParams()
  const router = useRouter()
  const minutes = params.get("minutes") || "15"
  const price = params.get("price") || "7"

  const handlePay = (method: string) => {
    alert(`Proceeding to pay for ${minutes} minutes (${price} USD) via ${method}`)
    // TODO: Integrate payment API/flow
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow p-8 flex flex-col items-center">
        <h1 className="text-2xl font-extrabold text-black mb-2">Checkout</h1>
        <div className="flex flex-row items-center justify-center gap-8 w-full my-6">
          <div className="flex flex-col items-center px-2">
            <span className="text-xs text-gray-500 uppercase tracking-wide">Bundle</span>
            <span className="text-2xl font-extrabold text-black leading-tight">{minutes}</span>
            <span className="text-xs text-gray-400">minutes</span>
          </div>
          <div className="h-10 w-px bg-gray-200 mx-2" />
          <div className="flex flex-col items-center px-2">
            <span className="text-xs text-gray-500 uppercase tracking-wide">Price</span>
            <span className="text-2xl font-extrabold text-black leading-tight">ZMW{50}</span>
            <span className="text-xs text-gray-400">USD</span>
          </div>
        </div>
        <h2 className="text-lg font-semibold text-black mb-4 mt-2">Choose Payment Method</h2>
        <div className="flex flex-col gap-4 w-full">
          <Button className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-3" onClick={() => handlePay("MTN Mobile Money")}>Pay with MTN Mobile Money</Button>
          <Button className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-3" onClick={() => handlePay("Zamtel Mobile Money")}>Pay with Zamtel Mobile Money</Button>
          <Button className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-3" onClick={() => handlePay("Airtel Mobile Money")}>Pay with Airtel Mobile Money</Button>
          <Button className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-3" onClick={() => handlePay("Visa")}>Pay with Visa</Button>
        </div>
        <Button variant="ghost" className="mt-8 text-gray-500 hover:text-black" onClick={() => router.back()}>Cancel</Button>
      </div>
    </div>
  )
} 