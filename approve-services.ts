import 'dotenv/config'
import { prisma } from './lib/prisma'

async function main() {
    console.log("Approving all existing services...")

    const result = await prisma.service.updateMany({
        where: {},
        data: { isApproved: true }
    })

    console.log(`Approved ${result.count} services.`)
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect())
