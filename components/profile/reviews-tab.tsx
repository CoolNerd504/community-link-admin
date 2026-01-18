import { Star } from "lucide-react"
import { Provider } from "./types"

interface ReviewsTabProps {
    provider: Provider
}

export function ReviewsTab({ provider }: ReviewsTabProps) {
    return (
        <div className="space-y-6">
            <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[32px] border border-[#eee] p-8">
                {/* Review Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[28px] font-bold text-[#181818]">Client Reviews</h2>
                    <div className="flex items-center gap-2">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`size-5 ${i < Math.floor(provider.rating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-[20px] font-bold text-[#181818]">{provider.rating.toFixed(1)}</span>
                        <span className="text-[15px] text-[#767676]">({provider.reviewCount} reviews)</span>
                    </div>
                </div>

                {/* Individual Reviews */}
                <div className="space-y-6">
                    {provider.reviews.map((review) => (
                        <div key={review.id} className="border-t border-[#eee] pt-6 first:border-0 first:pt-0">
                            <div className="flex gap-4">
                                <img
                                    src={review.client.image || "/placeholder-user.jpg"}
                                    alt={review.client.name}
                                    className="size-12 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-[16px] font-semibold text-[#181818]">{review.client.name}</h4>
                                        <span className="text-[13px] text-[#767676]">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`size-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-[15px] text-[#181818] italic leading-[1.6]">"{review.comment}"</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {provider.reviews.length === 0 && (
                        <p className="text-center text-gray-500 py-4">No reviews yet.</p>
                    )}
                </div>

                {provider.reviewCount > 5 && (
                    <button className="w-full mt-6 py-4 border border-[#eee] rounded-[16px] text-[15px] font-semibold text-[#181818] hover:bg-[#f5f5f5] transition-colors">
                        Read All {provider.reviewCount} Reviews
                    </button>
                )}
            </div>
        </div>
    )
}
