import { Provider } from "./types"

interface AboutTabProps {
    provider: Provider
}

export function AboutTab({ provider }: AboutTabProps) {
    return (
        <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[32px] border border-[#eee] p-8">
            <h2 className="text-[28px] font-bold text-[#181818] mb-4">
                About {provider.name.split(" ")[0]}
            </h2>
            <div className="text-[15px] text-[#181818] leading-[1.7] space-y-4 whitespace-pre-wrap">
                <p>{provider.profile?.bio || "No bio available."}</p>
            </div>

            {/* Specializations */}
            {provider.profile?.interests.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-[18px] font-semibold text-[#181818] mb-4">Specializations</h3>
                    <div className="flex flex-wrap gap-2">
                        {provider.profile.interests.map((interest, index) => (
                            <span
                                key={index}
                                className="px-4 py-2 bg-[#efefef] rounded-full text-[14px] text-[#181818]"
                            >
                                {interest}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
