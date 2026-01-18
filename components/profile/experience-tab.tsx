import { Provider } from "./types"

interface ExperienceTabProps {
    provider: Provider
}

export function ExperienceTab({ provider }: ExperienceTabProps) {
    // Since we don't have detailed experience data yet, we'll show a summary based on the years of experience field
    return (
        <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[32px] border border-[#eee] p-8">
            <h2 className="text-[28px] font-bold text-[#181818] mb-6">Experience</h2>
            <div className="space-y-6">
                <div className="flex gap-4">
                    <div className="shrink-0">
                        <div className="size-12 bg-[#efefef] rounded-[12px] flex items-center justify-center text-[20px] font-bold text-[#181818]">
                            {provider.name.charAt(0)}
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-[18px] font-semibold text-[#181818]">Professional Provider</h3>
                        <p className="text-[15px] text-[#767676] mb-1">Self-Employed</p>
                        <p className="text-[14px] text-[#a2a2a2]">{provider.experience} Years Experience</p>
                        <p className="text-[15px] text-[#181818] mt-3">
                            Has completed {provider.sessions} sessions on this platform with an average rating of {provider.rating.toFixed(1)}.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
