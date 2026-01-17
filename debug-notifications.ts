import 'dotenv/config'
import { prisma } from './lib/prisma'

console.log("DB URL Length:", process.env.DATABASE_URL?.length)

async function main() {
    try {
        console.log("Checking Prisma Notification model...")
        if (!prisma.notification) {
            console.error("prisma.notification is undefined!")
            return
        }
        const count = await prisma.notification.count()
        console.log("Notification Count:", count)

        const items = await prisma.notification.findMany({
            take: 1,
            orderBy: { createdAt: 'desc' }
        })
        console.log("Fetched Items:", items)

        console.log("Creating test notification...")
        // Need a valid user ID. I'll fetch one first.
        const user = await prisma.user.findFirst()
        if (user) {
            const notif = await prisma.notification.create({
                data: {
                    userId: user.id,
                    type: 'SYSTEM', // Using string literal matching enum
                    title: "Test",
                    body: "Test Body"
                }
            })
            console.log("Created:", notif)
        } else {
            console.log("No users found to test creation.")
        }
    } catch (e) {
        console.error("Error:", e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
