import { Repository, Between, MoreThanOrEqual, LessThan } from 'typeorm';
import { subDays } from 'date-fns';

export interface GrowthResult {
    current: number;
    previous: number;
    change: number;
    percentage: number;
    trend: 'up' | 'down' | 'neutral';
}

/**
 * Calculates growth Between current period and previous period
 * @param repository The TypeORM repository
 * @param dateField The field to filter by date (e.g., 'createdAt')
 * @param periodDays Number of days for the period (default 30)
 * @param additionalWhere Optional additional where conditions
 */
export async function calculateGrowth(
    repository: Repository<any>,
    dateField: string,
    periodDays: number = 30,
    additionalWhere: object = {}
): Promise<GrowthResult> {
    const now = new Date();
    const currentPeriodStart = subDays(now, periodDays);
    const previousPeriodStart = subDays(currentPeriodStart, periodDays);

    const currentCount = await repository.count({
        where: {
            ...additionalWhere,
            [dateField]: Between(currentPeriodStart, now)
        }
    });

    const previousCount = await repository.count({
        where: {
            ...additionalWhere,
            [dateField]: Between(previousPeriodStart, currentPeriodStart)
        }
    });

    const change = currentCount - previousCount;
    const percentage = previousCount > 0 ? (change / previousCount) * 100 : currentCount > 0 ? 100 : 0;
    const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';

    return {
        current: currentCount,
        previous: previousCount,
        change,
        percentage: Math.round(percentage * 10) / 10,
        trend
    };
}
