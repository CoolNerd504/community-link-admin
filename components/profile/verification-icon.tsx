import React from "react"
import { svgPaths } from "@/imports/svg-kgp0lgcn47"

export function VerificationIcon() {
    return (
        <div className="overflow-clip relative shrink-0 size-[24px]">
            <div className="absolute h-[23.178px] left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-[23.464px]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.4636 23.1784">
                    <path d={svgPaths.p3d7f7000} fill="url(#paint0_linear_profile)" />
                    <defs>
                        <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_profile" x1="11.7318" x2="11.7318" y1="-3.4849e-08" y2="23.1784">
                            <stop stopColor="#63ED67" />
                            <stop offset="1" stopColor="#30C935" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            <div className="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]">
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 4.5L3.5 6.5L8.5 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    )
}
