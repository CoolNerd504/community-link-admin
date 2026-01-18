import 'dotenv/config'
import { prisma } from './lib/prisma'

async function main() {
    console.log("Checking Provider Services...")

    // Find a user who is a provider and has services
    const provider = await prisma.user.findFirst({
        where: {
            role: 'PROVIDER',
            providerServices: { some: {} }
        },
        include: {
            providerServices: true
        }
    })

    if (!provider) {
        console.log("No providers with services found.")
        return
    }

    console.log(`Found Provider: ${provider.name} (${provider.id})`)
    console.log(`Total Services (DB): ${provider.providerServices.length}`)

    // Check visibility logic
    const visibleServices = provider.providerServices.filter(s => s.isActive && s.isApproved)
    console.log(`Visible Services (isActive=true, isApproved=true): ${visibleServices.length}`)

    provider.providerServices.forEach(s => {
        console.log(` - Service [${s.title}]: Active=${s.isActive}, Approved=${s.isApproved}, Price=${s.price}`)
    })

    // Simulate API query
    const apiResult = await prisma.user.findUnique({
        where: { id: provider.id },
        include: {
            providerServices: {
                where: {
                    isActive: true,
                    isApproved: true
                }
            }
        }
    })

    console.log(`API Query would return: ${apiResult?.providerServices.length} services.`)
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect())
