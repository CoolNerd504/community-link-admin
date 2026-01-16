import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    role: z.enum(["USER", "PROVIDER"]).default("USER"),
    username: z.string().min(3, "Username must be at least 3 characters").max(20).regex(/^[a-zA-Z0-9]+$/, "Username must be alphanumeric"),
    phoneNumber: z.string().min(10, "Phone number required"),
    pin: z.string().length(6, "PIN must be exactly 6 digits").regex(/^\d+$/, "PIN must be numeric"),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email, password, name, role, username, phoneNumber, pin } = registerSchema.parse(body)

        // Check if user exists (email, username, or phone)
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username },
                    { phoneNumber }
                ]
            }
        })

        if (existingUser) {
            let message = "User already exists"
            if (existingUser.email === email) message = "Email already registered"
            if (existingUser.username === username) message = "Username already taken"
            if (existingUser.phoneNumber === phoneNumber) message = "Phone number already registered"

            return NextResponse.json(
                { message },
                { status: 409 }
            )
        }

        // Hash password and PIN
        const hashedPassword = await hash(password, 12)
        const hashedPin = await hash(pin, 12)

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                name,
                role: role as any,
                password: hashedPassword,
                username,
                phoneNumber,
                pinHash: hashedPin,
                kycStatus: "PENDING"
            },
        })

        return NextResponse.json(
            { message: "User created successfully", userId: user.id },
            { status: 201 }
        )

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.errors[0].message }, { status: 400 })
        }
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}
