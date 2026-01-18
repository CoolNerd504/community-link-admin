import { ComponentProps } from "react"

export function VerificationIcon(props: ComponentProps<"div">) {
    return (
        <div className="overflow-clip relative shrink-0 size-[20px]" {...props}>
            <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0"
            >
                <path
                    d="M10 0L12.2451 1.54508L14.7553 0.954915L16.5451 2.93893L19.0451 3.81966L19.5106 6.54508L21.7553 8.09017L21.0211 10.8197L22.2451 13.0902L20.5106 15.4549L20.5106 18.0902H17.7553L16.2451 20L13.5106 19.5106L11.2451 21.0902L9.04508 19.5106L6.51057 20L5.02113 18.0902L2.24514 18.0902L2.24514 15.4549L0.510565 13.0902L1.75528 10.8197L1.02113 8.09017L3.24514 6.54508L3.75528 3.81966L6.24514 2.93893L8.02113 0.954915L10.5106 1.54508L10 0Z"
                    fill="url(#paint0_linear_dash)"
                />
                <defs>
                    <linearGradient
                        id="paint0_linear_dash"
                        x1="11.3776"
                        y1="0"
                        x2="11.3776"
                        y2="21.0902"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="#63ED67" />
                        <stop offset="1" stopColor="#30C935" />
                    </linearGradient>
                </defs>
            </svg>
            <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 scale-[0.6]"
            >
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M16.7071 5.29289C17.0976 5.68342 17.0976 6.31658 16.7071 6.70711L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071L3.29289 10.7071C2.90237 10.3166 2.90237 9.68342 3.29289 9.29289C3.68342 8.90237 4.31658 8.90237 4.70711 9.29289L8 12.5858L15.2929 5.29289C15.6834 4.90237 16.3166 4.90237 16.7071 5.29289Z"
                    fill="url(#paint0_linear_check_dash)"
                />
                <defs>
                    <linearGradient
                        id="paint0_linear_check_dash"
                        x1="10"
                        y1="5"
                        x2="10"
                        y2="15"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="#004703" />
                        <stop offset="1" stopColor="#007004" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    )
}
