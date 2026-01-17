// @ts-nocheck
import { PrismaClient, UserRole, VettingStatus, DisputeStatus, AppSessionStatus, TransactionType, TransactionStatus, PayoutStatus } from '@prisma/client'
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

    // Clear existing data
    console.log('🗑️  Clearing existing data...')
    await prisma.minuteUsage.deleteMany()
    await prisma.minutePurchase.deleteMany()
    await prisma.providerEarnings.deleteMany()
    await prisma.review.deleteMany()
    await prisma.dispute.deleteMany()
    await prisma.payoutRequest.deleteMany()
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
    await prisma.minutePackage.deleteMany()

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
                    isAvailableForInstant: true,
                    isOnline: true,
                    interests: [categories[0].name, categories[1].name, categories[2].name]
                }
            },
            wallet: {
                create: {
                    balance: 2250,
                    availableMinutes: 0,
                    totalMinutesPurchased: 0,
                    totalMinutesUsed: 0
                }
            },
            kycStatus: "APPROVED",
            kycVerifiedAt: new Date(),
            idFrontUrl: "https://storage.googleapis.com/commlink-kyc/id_front_emily.jpg",
            idBackUrl: "https://storage.googleapis.com/commlink-kyc/id_back_emily.jpg",
            selfieUrl: "https://storage.googleapis.com/commlink-kyc/selfie_emily.jpg"
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
                create: {
                    balance: 1280,
                    availableMinutes: 0,
                    totalMinutesPurchased: 0,
                    totalMinutesUsed: 0
                }
            },
            kycStatus: "APPROVED",
            kycVerifiedAt: new Date(),
            idFrontUrl: "https://storage.googleapis.com/commlink-kyc/id_front_john.jpg",
            idBackUrl: "https://storage.googleapis.com/commlink-kyc/id_back_john.jpg",
            selfieUrl: "https://storage.googleapis.com/commlink-kyc/selfie_john.jpg"
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
                create: {
                    balance: 0,
                    availableMinutes: 0,
                    totalMinutesPurchased: 0,
                    totalMinutesUsed: 0
                }
            },
            kycStatus: "SUBMITTED",
            kycSubmittedAt: new Date(),
            idFrontUrl: "https://storage.googleapis.com/commlink-kyc/id_front_maria.jpg",
            idBackUrl: "https://storage.googleapis.com/commlink-kyc/id_back_maria.jpg",
            selfieUrl: "https://storage.googleapis.com/commlink-kyc/selfie_maria.jpg"
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
                create: {
                    balance: 0,
                    availableMinutes: 0,
                    totalMinutesPurchased: 0,
                    totalMinutesUsed: 0
                }
            },
            kycStatus: "REJECTED",
            idFrontUrl: "https://storage.googleapis.com/commlink-kyc/id_front_david.jpg",
            idBackUrl: "https://storage.googleapis.com/commlink-kyc/id_back_david.jpg",
            selfieUrl: "https://storage.googleapis.com/commlink-kyc/selfie_david.jpg"
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
                create: {
                    balance: 0,
                    availableMinutes: 0,
                    totalMinutesPurchased: 0,
                    totalMinutesUsed: 0
                }
            },
            kycStatus: "REJECTED",
            idFrontUrl: "https://storage.googleapis.com/commlink-kyc/id_front_lisa.jpg",
            idBackUrl: "https://storage.googleapis.com/commlink-kyc/id_back_lisa.jpg",
            selfieUrl: "https://storage.googleapis.com/commlink-kyc/selfie_lisa.jpg"
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
                create: {
                    balance: 0,
                    availableMinutes: 0,
                    totalMinutesPurchased: 0,
                    totalMinutesUsed: 0
                }
            },
            kycStatus: "PENDING",
            idFrontUrl: "https://storage.googleapis.com/commlink-kyc/id_front_ahmed.jpg",
            idBackUrl: "https://storage.googleapis.com/commlink-kyc/id_back_ahmed.jpg",
            selfieUrl: "https://storage.googleapis.com/commlink-kyc/selfie_ahmed.jpg"
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
                create: {
                    balance: 480,
                    availableMinutes: 0,
                    totalMinutesPurchased: 0,
                    totalMinutesUsed: 0
                }
            },
            kycStatus: "APPROVED",
            kycVerifiedAt: new Date(),
            idFrontUrl: "https://storage.googleapis.com/commlink-kyc/id_front_sophie.jpg",
            idBackUrl: "https://storage.googleapis.com/commlink-kyc/id_back_sophie.jpg",
            selfieUrl: "https://storage.googleapis.com/commlink-kyc/selfie_sophie.jpg"
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
                create: {
                    balance: 3685,
                    availableMinutes: 0,
                    totalMinutesPurchased: 0,
                    totalMinutesUsed: 0
                }
            },
            kycStatus: "APPROVED",
            kycVerifiedAt: new Date(),
            idFrontUrl: "https://storage.googleapis.com/commlink-kyc/id_front_robert.jpg",
            idBackUrl: "https://storage.googleapis.com/commlink-kyc/id_back_robert.jpg",
            selfieUrl: "https://storage.googleapis.com/commlink-kyc/selfie_robert.jpg"
        }
    })

    // SEED PROVIDER SERVICES
    console.log('🛠️ Seeding provider services...')
    const providersList = [provider1, provider2, provider3, provider4, provider5, provider6, provider7, provider8];

    for (let i = 0; i < providersList.length; i++) {
        const provider = providersList[i];
        const category = categories[i % categories.length];

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
                wallet: { create: { balance: 150, availableMinutes: 150 } }
            }
        }),
        prisma.user.create({
            data: {
                email: 'bob.williams@example.com',
                name: 'Bob Williams',
                role: UserRole.USER,
                password: hashedPassword,
                profile: { create: {} },
                wallet: { create: { balance: 200, availableMinutes: 200 } }
            }
        }),
        prisma.user.create({
            data: {
                email: 'carol.davis@example.com',
                name: 'Carol Davis',
                role: UserRole.USER,
                password: hashedPassword,
                profile: { create: {} },
                wallet: { create: { balance: 0, availableMinutes: 0 } }
            }
        }),
        prisma.user.create({
            data: {
                email: 'daniel.miller@example.com',
                name: 'Daniel Miller',
                role: UserRole.USER,
                password: hashedPassword,
                profile: { create: {} },
                wallet: { create: { balance: 100, availableMinutes: 100 } }
            }
        }),
        prisma.user.create({
            data: {
                email: 'emma.wilson@example.com',
                name: 'Emma Wilson',
                role: UserRole.USER,
                password: hashedPassword,
                profile: { create: {} },
                wallet: { create: { balance: 50, availableMinutes: 50 } }
            }
        }),
        prisma.user.create({
            data: {
                email: 'frank.moore@example.com',
                name: 'Frank Moore',
                role: UserRole.USER,
                password: hashedPassword,
                profile: { create: {} },
                wallet: { create: { balance: 75, availableMinutes: 75 } }
            }
        }),
        prisma.user.create({
            data: {
                email: 'grace.taylor@example.com',
                name: 'Grace Taylor',
                role: UserRole.USER,
                password: hashedPassword,
                profile: { create: {} },
                wallet: { create: { balance: 500, availableMinutes: 500 } }
            }
        }),
        prisma.user.create({
            data: {
                email: 'henry.anderson@example.com',
                name: 'Henry Anderson',
                role: UserRole.USER,
                password: hashedPassword,
                profile: { create: {} },
                wallet: { create: { balance: 300, availableMinutes: 300 } }
            }
        }),
        prisma.user.create({
            data: {
                email: 'iris.thomas@example.com',
                name: 'Iris Thomas',
                role: UserRole.USER,
                password: hashedPassword,
                profile: { create: {} },
                wallet: { create: { balance: 125, availableMinutes: 125 } }
            }
        }),
        prisma.user.create({
            data: {
                email: 'jack.jackson@example.com',
                name: 'Jack Jackson',
                role: UserRole.USER,
                password: hashedPassword,
                profile: { create: {} },
                wallet: { create: { balance: 0, availableMinutes: 0 } }
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

    // 6. SEED PROVIDER EARNINGS & PAYOUTS
    console.log('💰 Seeding provider earnings and payouts...')
    const p1Wallet = await prisma.wallet.findUnique({ where: { userId: provider1.id } })
    const p8Wallet = await prisma.wallet.findUnique({ where: { userId: provider8.id } })

    if (p1Wallet) {
        await prisma.payoutRequest.create({
            data: {
                walletId: p1Wallet.id,
                amount: 500,
                status: PayoutStatus.PENDING,
                bankDetails: 'Bank: ABC Bank, Account: 123456789'
            }
        })
    }

    if (p8Wallet) {
        await prisma.payoutRequest.create({
            data: {
                walletId: p8Wallet.id,
                amount: 1000,
                status: PayoutStatus.APPROVED,
                bankDetails: 'Bank: XYZ Bank, Account: 987654321',
                processedAt: new Date()
            }
        })
    }

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
    console.log('✅ Created provider earnings and payout samples')

    // 7. SEED SAMPLE SESSIONS, MINUTE PURCHASES & USAGE
    console.log('💳 Seeding usage history...')
    const alice = users[0]
    const aliceWallet = await prisma.wallet.findUnique({ where: { userId: alice.id } })

    if (aliceWallet) {
        const purchase = await prisma.minutePurchase.create({
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

        const session = await prisma.appSession.create({
            data: {
                clientId: alice.id,
                providerId: provider1.id,
                status: AppSessionStatus.COMPLETED,
                startTime: new Date(Date.now() - 3600000),
                endTime: new Date(),
                price: 50
            }
        })

        await prisma.minuteUsage.create({
            data: {
                walletId: aliceWallet.id,
                minutesUsed: 30,
                ratePerMinute: 2,
                totalCost: 60,
                sessionId: session.id
            }
        })

        await prisma.wallet.update({
            where: { id: aliceWallet.id },
            data: {
                totalMinutesPurchased: 100,
                totalMinutesUsed: 30,
                availableMinutes: 70
            }
        })
    }

    // 8. SEED BOOKING REQUESTS
    console.log('📅 Seeding booking requests...')
    const bookingService = await prisma.service.findFirst({
        where: { providerId: provider1.id }
    })

    if (bookingService) {
        await prisma.bookingRequest.create({
            data: {
                clientId: alice.id,
                serviceId: bookingService.id,
                status: 'PENDING',
                notes: 'Looking forward to this session!',
                requestedTime: new Date(Date.now() + 172800000) // 2 days from now
            }
        })

        // Instant Booking Request (Pending)
        await prisma.bookingRequest.create({
            data: {
                clientId: alice.id,
                serviceId: bookingService.id,
                status: 'PENDING',
                notes: 'I need this immediately!',
                isInstant: true,
                expiresAt: new Date(Date.now() + 30 * 60000) // Expires in 30 mins
            }
        })

        // Expired Instant Booking Request
        await prisma.bookingRequest.create({
            data: {
                clientId: alice.id,
                serviceId: bookingService.id,
                status: 'EXPIRED',
                notes: 'This request was missed.',
                isInstant: true,
                expiresAt: new Date(Date.now() - 60 * 60000) // Expired 1 hour ago
            }
        })
    }

    // 9. SEED SESSIONS FOR ANALYTICS
    console.log('📊 Seeding sessions for analytics...')
    const daysOfWeek = [0, 1, 2, 3, 4, 5, 6] // SUN-SAT
    const sessionsForAnalytics = []

    for (let i = 0; i < 20; i++) {
        const dayOffset = Math.floor(Math.random() * 7) // Within last 7 days
        const startTime = new Date(Date.now() - dayOffset * 24 * 60 * 60 * 1000)
        const durationMins = [30, 45, 60][Math.floor(Math.random() * 3)]
        const endTime = new Date(startTime.getTime() + durationMins * 60000)
        const status = i < 18 ? AppSessionStatus.COMPLETED : AppSessionStatus.CANCELLED // 90% completion rate

        const session = await prisma.appSession.create({
            data: {
                clientId: users[i % users.length].id,
                providerId: provider1.id,
                status,
                startTime,
                endTime,
                price: durationMins * 2
            }
        })
        sessionsForAnalytics.push(session)
    }
    console.log(`✅ Created ${sessionsForAnalytics.length} sessions for analytics`)

    // 10. SEED REVIEWS FOR RATING BREAKDOWN
    console.log('⭐ Seeding reviews...')
    const ratings = [5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 4, 3] // Mostly 5-star

    for (let i = 0; i < Math.min(ratings.length, sessionsForAnalytics.length); i++) {
        const session = sessionsForAnalytics[i]
        if (session.status === 'COMPLETED') {
            await prisma.review.create({
                data: {
                    sessionId: session.id,
                    clientId: session.clientId,
                    providerId: provider1.id,
                    rating: ratings[i],
                    comment: ratings[i] === 5
                        ? 'Excellent session! Highly recommended.'
                        : ratings[i] === 4
                            ? 'Great experience overall.'
                            : 'Good session, met my expectations.'
                }
            })
        }
    }
    console.log(`✅ Created ${ratings.length} reviews for rating breakdown`)

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
