import { prisma } from "@/lib/prisma"
import { NotificationType } from "@prisma/client"

type NotificationPayload = {
    userId: string
    type: NotificationType
    title: string
    body: string
    data?: any
}

/**
 * Sends a notification to a user.
 * 1. Stores it in the database (for "All/Unread" list).
 * 2. Sends a Push Notification to all registered devices.
 */
export async function sendNotification({
    userId,
    type,
    title,
    body,
    data
}: NotificationPayload) {
    try {
        // 1. Store in Database
        const notification = await prisma.notification.create({
            data: {
                userId,
                type,
                title,
                body,
                data: data || {},
            }
        })

        // 2. Fetch Devices
        const devices = await prisma.device.findMany({
            where: { userId }
        })

        if (devices.length > 0) {
            // 3. Send Push (Mock implementation / Placeholder for Expo/FCM)
            await sendPushNotification(devices.map(d => d.token), title, body, data)
        }

        return notification

    } catch (error) {
        console.error("Error sending notification:", error)
        // Don't throw, just log. We don't want to break the main flow.
        return null
    }
}

/**
 * Validates and sends push notifications to tokens.
 * Replace this with actual Expo/Firebase logic.
 */
async function sendPushNotification(tokens: string[], title: string, body: string, data?: any) {
    console.log(`[PUSH] Sending to ${tokens.length} devices:`)
    console.log(`[PUSH] Title: ${title}, Body: ${body}`)

    // Implementation example for Expo:
    // const messages = tokens.map(token => ({
    //   to: token,
    //   sound: 'default',
    //   title,
    //   body,
    //   data: { ...data },
    // }))
    // await fetch('https://exp.host/--/api/v2/push/send', { ... })
}
