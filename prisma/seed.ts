// @ts-nocheck
import { PrismaClient, UserRole, VettingStatus, DisputeStatus, AppSessionStatus } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('🌱 Starting database seed...')
    console.log('Testing DB connection string:', process.env.DATABASE_URL ? 'Loaded' : 'MISSING')

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing data...')
    await prisma.minuteUsage.deleteMany()
    await prisma.minutePurchase.deleteMany()
    await prisma.providerEarnings.deleteMany()
    await prisma.review.deleteMany()
    await prisma.dispute.deleteMany()
    await prisma.transaction.deleteMany()
    await prisma.wallet.deleteMany()
    await prisma.appSession.deleteMany()
    await prisma.bookingRequest.deleteMany()
    await prisma.service.deleteMany()
    await prisma.profile.deleteMany()
    await prisma.user.deleteMany()
    await prisma.category.deleteMany()
    await prisma.pricingTier.deleteMany()
    await prisma.bundlePricing.deleteMany()

    // 1. SEED CATEGORIES
    console.log('📂 Seeding categories...')
    const categories = await Promise.all([
        prisma.category.create({
            data: {
                name: 'Mental Health & Counseling',
                description: 'Professional mental health support and counseling services',
                icon: '🧠',
                isActive: true
            }
        }),
        prisma.category.create({
            data: {
                name: 'Life Coaching',
                description: 'Personal development and life coaching',
                icon: '🎯',
                isActive: true
            }
        }),
        prisma.category.create({
            data: {
                name: 'Health & Wellness',
                description: 'Nutrition, wellness, and healthy lifestyle guidance',
                icon: '💪',
                isActive: true
            }
        }),
        prisma.category.create({
            data: {
                name: 'Career Development',
                description: 'Career coaching and professional development',
                icon: '📈',
                isActive: true
            }
        }),
        prisma.category.create({
            data: {
                name: 'Fitness & Training',
                description: 'Personal training and fitness coaching',
                icon: '🏋️',
                isActive: true
            }
        }),
        prisma.category.create({
            data: {
                name: 'Education & Tutoring',
                description: 'Academic tutoring and educational support',
                icon: '📚',
                isActive: true
            }
        }),
        prisma.category.create({
            data: {
                name: 'Business & Finance',
                description: 'Business consulting and financial advice',
                icon: '💼',
                isActive: true
            }
        }),
        prisma.category.create({
            data: {
                name: 'Technology & Programming',
                description: 'Tech mentorship and programming tutoring',
                icon: '💻',
                isActive: true
            }
        })
    ])
    console.log(`✅ Created ${categories.length} categories`)

    // 2. SEED PRICING TIERS
    console.log('💰 Seeding pricing tiers...')
    const pricingTiers = await Promise.all([
        prisma.pricingTier.create({
            data: {
                name: 'Basic',
                description: 'Entry-level pricing for new providers',
                pricePerMinute: 2,
                maxSessionsPerDay: 5,
                features: ['Basic analytics', 'Standard support', 'Profile listing'],
                bundleDiscounts: { '10_min': 0, '15_min': 5, '30_min': 10, '60_min': 15 },
                isActive: true
            }
        }),
        prisma.pricingTier.create({
            data: {
                name: 'Premium',
                description: 'Advanced features for experienced providers',
                pricePerMinute: 3,
                maxSessionsPerDay: 10,
                features: ['Advanced analytics', 'Priority support', 'Featured listing'],
                bundleDiscounts: { '10_min': 5, '15_min': 10, '30_min': 15, '60_min': 20 },
                isActive: true
            }
        }),
        prisma.pricingTier.create({
            data: {
                name: 'Enterprise',
                description: 'Professional tier with maximum benefits',
                pricePerMinute: 4,
                maxSessionsPerDay: 20,
                features: ['Full analytics', '24/7 support', 'Premium listing', 'Custom branding'],
                bundleDiscounts: { '10_min': 10, '15_min': 15, '30_min': 20, '60_min': 25 },
                isActive: true
            }
        })
    ])
    console.log(`✅ Created ${pricingTiers.length} pricing tiers`)

    // 3. SEED BUNDLE PRICING
    console.log('📦 Seeding bundle pricing...')
    const bundles = await Promise.all([
        prisma.bundlePricing.create({
            data: { name: '10 Minutes', minutes: 10, price: 18, isActive: true }
        }),
        prisma.bundlePricing.create({
            data: { name: '15 Minutes', minutes: 15, price: 25, isActive: true }
        }),
        prisma.bundlePricing.create({
            data: { name: '30 Minutes', minutes: 30, price: 45, isActive: true }
        }),
        prisma.bundlePricing.create({
            data: { name: '60 Minutes', minutes: 60, price: 80, isActive: true }
        })
    ])
    console.log(`✅ Created ${bundles.length} bundle pricing options`)

    // 4. SEED USERS
    console.log('👥 Seeding users...')
    const hashedPassword = await bcrypt.hash('Password123!', 10)

    // ADMINS (2)
    const admin1 = await prisma.user.create({
        data: {
            email: 'sarah.admin@commlink.com',
            name: 'Sarah Johnson',
            role: UserRole.ADMIN,
            password: hashedPassword,
            profile: { create: {} }
        }
    })

    const admin2 = await prisma.user.create({
        data: {
            email: 'michael.admin@commlink.com',
            name: 'Michael Chen',
            role: UserRole.ADMIN,
            password: hashedPassword,
            profile: { create: {} }
        }
    })

    // SERVICE PROVIDERS (8)
    const provider1 = await prisma.user.create({
        data: {
            email: 'emily.watson@example.com',
            name: 'Dr. Emily Watson',
            role: UserRole.PROVIDER,
            password: hashedPassword,
            profile: {
                create: {
                    bio: 'Licensed therapist with 10 years of experience specializing in anxiety and depression',
                    headline: 'Mental Health Therapist',
                    location: 'Lusaka, Zambia',
                    isVerified: true,
                    vettingStatus: VettingStatus.APPROVED,
                }
            },
            wallet: {
                create: { balance: 2250 }
            }
        }
    })

    const provider2 = await prisma.user.create({
        data: {
            email: 'john.smith@example.com',
            name: 'John Smith',
            role: UserRole.PROVIDER,
            password: hashedPassword,
            profile: {
                create: {
                    bio: 'Certified life coach helping people achieve their personal and professional goals',
                    headline: 'Life Coach',
                    location: 'Lusaka, Zambia',
                    isVerified: true,
                    vettingStatus: VettingStatus.APPROVED,
                }
            },
            wallet: {
                create: { balance: 1280 }
            }
        }
    })

    const provider3 = await prisma.user.create({
        data: {
            email: 'maria.garcia@example.com',
            name: 'Maria Garcia',
            role: UserRole.PROVIDER,
            password: hashedPassword,
            profile: {
                create: {
                    bio: 'Registered nutritionist specializing in weight management and healthy eating',
                    headline: 'Nutritionist',
                    location: 'Ndola, Zambia',
                    isVerified: false,
                    vettingStatus: VettingStatus.PENDING,
                }
            },
            wallet: {
                create: { balance: 0 }
            }
        }
    })

    const provider4 = await prisma.user.create({
        data: {
            email: 'david.lee@example.com',
            name: 'David Lee',
            role: UserRole.PROVIDER,
            password: hashedPassword,
            profile: {
                create: {
                    bio: 'Career development specialist',
                    headline: 'Career Coach',
                    location: 'Kitwe, Zambia',
                    isVerified: false,
                    vettingStatus: VettingStatus.REJECTED,
                }
            },
            wallet: {
                create: { balance: 0 }
            }
        }
    })

    const provider5 = await prisma.user.create({
        data: {
            email: 'lisa.brown@example.com',
            name: 'Lisa Brown',
            role: UserRole.PROVIDER,
            password: hashedPassword,
            profile: {
                create: {
                    bio: 'Certified personal trainer',
                    headline: 'Fitness Trainer',
                    location: 'Lusaka, Zambia',
                    isVerified: false,
                    vettingStatus: VettingStatus.REJECTED,
                }
            },
            wallet: {
                create: { balance: 0 }
            }
        }
    })

    const provider6 = await prisma.user.create({
        data: {
            email: 'ahmed.hassan@example.com',
            name: 'Ahmed Hassan',
            role: UserRole.PROVIDER,
            password: hashedPassword,
            profile: {
                create: {
                    bio: 'Language tutor specializing in English and French',
                    headline: 'Language Tutor',
                    location: 'Lusaka, Zambia',
                    isVerified: false,
                    vettingStatus: VettingStatus.PENDING,
                }
            },
            wallet: {
                create: { balance: 0 }
            }
        }
    })

    const provider7 = await prisma.user.create({
        data: {
            email: 'sophie.martin@example.com',
            name: 'Sophie Martin',
            role: UserRole.PROVIDER,
            password: hashedPassword,
            profile: {
                create: {
                    bio: 'Business consultant with MBA and 15 years corporate experience',
                    headline: 'Business Consultant',
                    location: 'Lusaka, Zambia',
                    isVerified: true,
                    vettingStatus: VettingStatus.APPROVED,
                }
            },
            wallet: {
                create: { balance: 480 }
            }
        }
    })

    const provider8 = await prisma.user.create({
        data: {
            email: 'robert.taylor@example.com',
            name: 'Robert Taylor',
            role: UserRole.PROVIDER,
            password: hashedPassword,
            profile: {
                create: {
                    bio: 'Senior software engineer and tech mentor with 12 years experience',
                    headline: 'Tech Mentor',
                    location: 'Lusaka, Zambia',
                    isVerified: true,
                    vettingStatus: VettingStatus.APPROVED,
                }
            },
            wallet: {
                create: { balance: 3685 }
            }
        }
    })

    // SEED PROVIDER SERVICES
    console.log('🛠️ Seeding provider services...')
    const providersList = [provider1, provider2, provider3, provider4, provider5, provider6, provider7, provider8];
    const serviceTitles = ["Initial Consultation", "Standard Session", "Deep Dive Strategy", "Quick Review"];

    for (let i = 0; i < providersList.length; i++) {
        const provider = providersList[i];
        // Assign a category cyclically
        const category = categories[i % categories.length];

        // Add 2 services per provider
        await prisma.service.create({
            data: {
                providerId: provider.id,
                title: `${category.name} Consultation`,
                description: `30-minute introductory consultation for ${category.name}.`,
                price: 50 + (i * 5),
                duration: 30,
                category: category.name,
                isActive: true
            }
        });

        await prisma.service.create({
            data: {
                providerId: provider.id,
                title: `Full ${category.name} Session`,
                description: `60-minute in-depth session for ${category.name}.`,
                price: 100 + (i * 10),
                duration: 60,
                category: category.name,
                isActive: true
            }
        });
    }

    // REGULAR USERS (10)
    const users = await Promise.all([
        prisma.user.create({
            data: {
                email: 'alice.cooper@example.com',
                name: 'Alice Cooper',
                role: UserRole.USER,
                password: hashedPassword,
                profile: { create: {} },
                wallet: { create: { balance: 150 } }
            }
        }),
        prisma.user.create({
            data: {
                email: 'bob.williams@example.com',
                name: 'Bob Williams',
                role: UserRole.USER,
                password: hashedPassword,
                profile: { create: {} },
                wallet: { create: { balance: 200 } }
            }
        }),
        prisma.user.create({
            data: {
                email: 'carol.davis@example.com',
                name: 'Carol Davis',
                role: UserRole.USER,
                profile: { create: {} },
                wallet: { create: { balance: 0 } }
            }
        }),
        prisma.user.create({
            data: {
                email: 'daniel.miller@example.com',
                name: 'Daniel Miller',
                role: UserRole.USER,
                profile: { create: {} },
                wallet: { create: { balance: 100 } }
            }
        }),
        prisma.user.create({
            data: {
                email: 'emma.wilson@example.com',
                name: 'Emma Wilson',
                role: UserRole.USER,
                profile: { create: {} },
                wallet: { create: { balance: 50 } }
            }
        }),
        prisma.user.create({
            data: {
                email: 'frank.moore@example.com',
                name: 'Frank Moore',
                role: UserRole.USER,
                profile: { create: {} },
                wallet: { create: { balance: 75 } }
            }
        }),
        prisma.user.create({
            data: {
                email: 'grace.taylor@example.com',
                name: 'Grace Taylor',
                role: UserRole.USER,
                profile: { create: {} },
                wallet: { create: { balance: 500 } }
            }
        }),
        prisma.user.create({
            data: {
                email: 'henry.anderson@example.com',
                name: 'Henry Anderson',
                role: UserRole.USER,
                profile: { create: {} },
                wallet: { create: { balance: 300 } }
            }
        }),
        prisma.user.create({
            data: {
                email: 'iris.thomas@example.com',
                name: 'Iris Thomas',
                role: UserRole.USER,
                profile: { create: {} },
                wallet: { create: { balance: 125 } }
            }
        }),
        prisma.user.create({
            data: {
                email: 'jack.jackson@example.com',
                name: 'Jack Jackson',
                role: UserRole.USER,
                profile: { create: {} },
                wallet: { create: { balance: 0 } }
            }
        })
    ])

    console.log(`✅ Created 2 admins, 8 providers, and 10 regular users`)

    // 5. SEED MINUTE PACKAGES
    console.log('📦 Seeding minute packages...')
    const packages = await Promise.all([
        prisma.minutePackage.create({
            data: {
                name: 'Starter Pack',
                minutes: 50,
                priceZMW: 100,
                discountPercent: 0,
                isActive: true,
                isPopular: false,
                description: 'Perfect for trying out our services'
            }
        }),
        prisma.minutePackage.create({
            data: {
                name: 'Value Pack',
                minutes: 100,
                priceZMW: 180,
                discountPercent: 10,
                isActive: true,
                isPopular: true,
                description: 'Most popular choice - 10% savings'
            }
        }),
        prisma.minutePackage.create({
            data: {
                name: 'Popular Pack',
                minutes: 200,
                priceZMW: 320,
                discountPercent: 20,
                isActive: true,
                isPopular: false,
                description: 'Great value for regular users'
            }
        }),
        prisma.minutePackage.create({
            data: {
                name: 'Premium Pack',
                minutes: 500,
                priceZMW: 750,
                discountPercent: 25,
                isActive: true,
                isPopular: false,
                description: 'Best value - 25% savings'
            }
        })
    ])
    console.log(`✅ Created ${packages.length} minute packages`)

    // 6. SEED PROVIDER EARNINGS
    console.log('💰 Seeding provider earnings...')
    await Promise.all([
        prisma.providerEarnings.create({
            data: {
                providerId: provider1.id,
                totalMinutesServiced: 450,
                currentMonthMinutes: 120,
                totalEarningsZMW: 2250,
                currentMonthEarnings: 600,
                pendingPayoutZMW: 600,
                lastPayoutDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                lastPayoutAmount: 1650
            }
        }),
        prisma.providerEarnings.create({
            data: {
                providerId: provider2.id,
                totalMinutesServiced: 320,
                currentMonthMinutes: 90,
                totalEarningsZMW: 1280,
                currentMonthEarnings: 360,
                pendingPayoutZMW: 360
            }
        }),
        prisma.providerEarnings.create({
            data: {
                providerId: provider7.id,
                totalMinutesServiced: 80,
                currentMonthMinutes: 80,
                totalEarningsZMW: 480,
                currentMonthEarnings: 480,
                pendingPayoutZMW: 480
            }
        }),
        prisma.providerEarnings.create({
            data: {
                providerId: provider8.id,
                totalMinutesServiced: 670,
                currentMonthMinutes: 150,
                totalEarningsZMW: 3685,
                currentMonthEarnings: 825,
                pendingPayoutZMW: 825,
                lastPayoutDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
                lastPayoutAmount: 2860
            }
        })
    ])
    console.log('✅ Created provider earnings records')

    // 7. SEED SAMPLE MINUTE PURCHASES
    console.log('💳 Seeding minute purchases...')
    const alice = users[0]
    const bob = users[1]
    const grace = users[6]

    const aliceWallet = await prisma.wallet.findUnique({ where: { userId: alice.id } })
    const bobWallet = await prisma.wallet.findUnique({ where: { userId: bob.id } })
    const graceWallet = await prisma.wallet.findUnique({ where: { userId: grace.id } })

    if (aliceWallet) {
        await prisma.minutePurchase.create({
            data: {
                walletId: aliceWallet.id,
                packageName: 'Value Pack',
                minutesPurchased: 100,
                priceZMW: 180,
                paymentMethod: 'MOBILE_MONEY',
                paymentStatus: 'COMPLETED',
                transactionRef: 'MM-' + Date.now()
            }
        })
        await prisma.minutePurchase.create({
            data: {
                walletId: aliceWallet.id,
                packageName: 'Starter Pack',
                minutesPurchased: 50,
                priceZMW: 100,
                paymentMethod: 'CARD',
                paymentStatus: 'COMPLETED',
                transactionRef: 'CARD-' + (Date.now() + 1000)
            }
        })
        await prisma.wallet.update({
            where: { id: aliceWallet.id },
            data: {
                totalMinutesPurchased: 150,
                availableMinutes: 150
            }
        })
    }

    if (bobWallet) {
        await prisma.minutePurchase.create({
            data: {
                walletId: bobWallet.id,
                packageName: 'Popular Pack',
                minutesPurchased: 200,
                priceZMW: 320,
                paymentMethod: 'MOBILE_MONEY',
                paymentStatus: 'COMPLETED',
                transactionRef: 'MM-' + (Date.now() + 2000)
            }
        })
        await prisma.wallet.update({
            where: { id: bobWallet.id },
            data: {
                totalMinutesPurchased: 200,
                availableMinutes: 200
            }
        })
    }

    if (graceWallet) {
        await prisma.minutePurchase.create({
            data: {
                walletId: graceWallet.id,
                packageName: 'Premium Pack',
                minutesPurchased: 500,
                priceZMW: 750,
                paymentMethod: 'CARD',
                paymentStatus: 'COMPLETED',
                transactionRef: 'CARD-' + (Date.now() + 3000)
            }
        })
        await prisma.wallet.update({
            where: { id: graceWallet.id },
            data: {
                totalMinutesPurchased: 500,
                availableMinutes: 500
            }
        })
    }
    console.log('✅ Created sample minute purchases')

    // 8. SEED SESSIONS & DISPUTES
    console.log('🗣️ Seeding sessions and disputes...')

    // Dispute 1 (OPEN): Alice vs Provider 1
    const d1Session = await prisma.appSession.create({
        data: {
            clientId: users[0].id,
            providerId: provider1.id,
            status: AppSessionStatus.COMPLETED,
            startTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
            endTime: new Date(Date.now() - 1000 * 60 * 60 * 24 + 1000 * 60 * 30),
            price: 50
        }
    })
    await prisma.dispute.create({
        data: {
            sessionId: d1Session.id,
            reason: "Session ended early: Provider left after 10 minutes but charged for full session",
            status: DisputeStatus.OPEN,
            creatorId: users[0].id,
            providerId: provider1.id,
            reportedById: users[0].id,
            reportedAgainstId: provider1.id
        }
    })

    // Dispute 2 (PENDING): Bob vs Provider 3
    const d2Session = await prisma.appSession.create({
        data: {
            clientId: users[1].id,
            providerId: provider3.id,
            status: AppSessionStatus.CANCELLED, // No show
            startTime: new Date(Date.now() - 1000 * 60 * 60 * 48),
            endTime: new Date(Date.now() - 1000 * 60 * 60 * 48 + 1000 * 60 * 60),
            price: 35
        }
    })
    await prisma.dispute.create({
        data: {
            sessionId: d2Session.id,
            reason: "Provider didn't show up: I waited for 15 mins and provider never joined",
            status: DisputeStatus.PENDING, // Waiting for provider
            creatorId: users[1].id,
            providerId: provider3.id,
            reportedById: users[1].id,
            reportedAgainstId: provider3.id
        }
    })

    // Dispute 3 (INVESTIGATING): Carol vs Provider 4
    const d3Session = await prisma.appSession.create({
        data: {
            clientId: users[2].id,
            providerId: provider4.id,
            status: AppSessionStatus.COMPLETED,
            startTime: new Date(Date.now() - 1000 * 60 * 60 * 72),
            endTime: new Date(Date.now() - 1000 * 60 * 60 * 72 + 1000 * 60 * 45),
            price: 45
        }
    })
    await prisma.dispute.create({
        data: {
            sessionId: d3Session.id,
            reason: "Inappropriate behavior: Provider made uncomfortable comments",
            status: DisputeStatus.INVESTIGATING,
            creatorId: users[2].id,
            providerId: provider4.id,
            reportedById: users[2].id,
            reportedAgainstId: provider4.id,
            notes: ["Admin assigned case", "Reviewing session logs"]
        }
    })

    // Dispute 4 (RESOLVED): Daniel vs Provider 2
    const d4Session = await prisma.appSession.create({
        data: {
            clientId: users[3].id,
            providerId: provider2.id,
            status: AppSessionStatus.COMPLETED,
            startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
            endTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5 + 1000 * 60 * 60),
            price: 40
        }
    })
    await prisma.dispute.create({
        data: {
            sessionId: d4Session.id,
            reason: "Technical issues: Connection kept dropping",
            status: DisputeStatus.RESOLVED,
            resolution: "Refunded 50%",
            resolvedAt: new Date(),
            creatorId: users[3].id,
            providerId: provider2.id,
            reportedById: users[3].id,
            reportedAgainstId: provider2.id
        }
    })

    // Dispute 5 (CLOSED): Emma vs Provider 7
    const d5Session = await prisma.appSession.create({
        data: {
            clientId: users[4].id,
            providerId: provider7.id,
            status: AppSessionStatus.COMPLETED,
            startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
            endTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 30),
            price: 60
        }
    })
    await prisma.dispute.create({
        data: {
            sessionId: d5Session.id,
            reason: "Accidental report: Clicked by mistake",
            status: DisputeStatus.CLOSED,
            resolution: "User closed report",
            resolvedAt: new Date(),
            creatorId: users[4].id,
            providerId: provider7.id,
            reportedById: users[4].id,
            reportedAgainstId: provider7.id
        }
    })

    // Dispute 6 (DISMISSED): Frank vs Provider 8
    const d6Session = await prisma.appSession.create({
        data: {
            clientId: users[5].id,
            providerId: provider8.id,
            status: AppSessionStatus.COMPLETED,
            startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
            endTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10 + 1000 * 60 * 60),
            price: 55
        }
    })
    await prisma.dispute.create({
        data: {
            sessionId: d6Session.id,
            reason: "Didn't like advice: Provider gave advice I disagreed with",
            status: DisputeStatus.DISMISSED,
            resolution: "Subjective disagreement is not grounds for refund",
            resolvedAt: new Date(),
            creatorId: users[5].id,
            providerId: provider8.id,
            reportedById: users[5].id,
            reportedAgainstId: provider8.id
        }
    })
    console.log('✅ Created 6 test disputes with various statuses')

    // 9. SEED BOOKING REQUESTS
    console.log('📅 Seeding booking requests...')
    // Find service for Provider 1 (Dr. Emily)
    const bookingService = await prisma.service.findFirst({
        where: { providerId: provider1.id }
    })

    if (bookingService) {
        // Pending booking for Alice (users[0])
        await prisma.bookingRequest.create({
            data: {
                clientId: users[0].id,
                serviceId: bookingService.id,
                status: 'PENDING',
                notes: 'Looking forward to this session! I have some questions about anxiety management.',
                requestedTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2) // 2 days from now
            }
        })

        // Accepted booking for Bob (users[1])
        await prisma.bookingRequest.create({
            data: {
                clientId: users[1].id,
                serviceId: bookingService.id,
                status: 'ACCEPTED',
                notes: 'Please bring your previous medical history.',
                requestedTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3) // 3 days from now
            }
        })
        console.log('✅ Created 2 sample booking requests')
    } else {
        console.log('⚠️ Could not find service for provider 1, skipping bookings')
    }

    // --- Verification ---
    const adminEmail = 'sarah.admin@commlink.com'
    const verificationUser = await prisma.user.findUnique({ where: { email: adminEmail } })
    if (verificationUser) {
        console.log("🔍 VERIFICATION: User found", adminEmail)
        console.log("🔍 VERIFICATION: Role", verificationUser.role)
        const valid = await bcrypt.compare('Password123!', verificationUser.password || '')
        console.log("🔍 VERIFICATION: Password Valid?", valid ? "YES ✅" : "NO ❌")
    } else {
        console.log("❌ VERIFICATION: User NOT found", adminEmail)
    }

    const providerEmail = 'emily.watson@example.com'
    const verificationProvider = await prisma.user.findUnique({ where: { email: providerEmail } })
    if (verificationProvider) {
        console.log("🔍 VERIFICATION: Provider found", providerEmail)
        console.log("🔍 VERIFICATION: Role", verificationProvider.role)
        const valid = await bcrypt.compare('Password123!', verificationProvider.password || '')
        console.log("🔍 VERIFICATION: Provider Password Valid?", valid ? "YES ✅" : "NO ❌")
    } else {
        console.log("❌ VERIFICATION: User NOT found", adminEmail)
    }

    console.log('✨ Database seeding completed successfully!')
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
