export function calculateDynamicPrice(basePrice: number, baseDuration: number, requestedDuration: number): number {
    const pricePerMinute = basePrice / baseDuration
    const baseCost = pricePerMinute * requestedDuration

    // Mock Dynamic Multiplier (random between 1.0 and 1.3)
    // In a real app, this would query a pricing engine context
    const multiplier = 1.0 + (Math.random() * 0.3)

    return Number((baseCost * multiplier).toFixed(2))
}
