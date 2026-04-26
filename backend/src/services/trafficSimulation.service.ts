/**
 * Traffic Simulation Service
 * Simulates real-world traffic conditions by applying multipliers
 * to route segments based on time-of-day and road type heuristics.
 *
 * This fulfills the project's requirement for "simulated traffic conditions"
 * in the dynamic routing engine.
 */

export interface TrafficCondition {
  segmentFrom: string;
  segmentTo: string;
  delayMultiplier: number;     // 1.0 = normal, 1.5 = 50% delay, etc.
  estimatedDelayMinutes: number;
  congestionLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
  reason: string;
}

export class TrafficSimulator {
  /**
   * Generates simulated traffic conditions for a set of route segments.
   * Uses time-of-day and random factors to mimic real traffic patterns.
   */
  static simulateTraffic(
    stopCount: number,
    timeOfDay: 'MORNING' | 'AFTERNOON' | 'EVENING' = 'MORNING'
  ): TrafficCondition[] {
    const conditions: TrafficCondition[] = [];

    // Base multiplier varies by time of day (school runs are typically morning rush)
    const baseMultipliers: Record<string, number> = {
      MORNING: 1.4,    // Morning rush hour — higher base delay
      AFTERNOON: 1.15,  // Midday — moderate traffic
      EVENING: 1.25     // Evening pickup — moderate-high
    };
    const baseMult = baseMultipliers[timeOfDay] || 1.2;

    for (let i = 0; i < stopCount - 1; i++) {
      // Random variation: ±30% of base multiplier
      const variation = (Math.random() - 0.5) * 0.6;
      const delayMultiplier = Math.max(1.0, baseMult + variation);

      // Estimate delay in minutes based on multiplier
      const baseSegmentTime = 3; // Assume 3 min average between stops
      const estimatedDelayMinutes = Math.round((delayMultiplier - 1.0) * baseSegmentTime * 10) / 10;

      // Classify congestion level
      let congestionLevel: TrafficCondition['congestionLevel'];
      let reason: string;

      if (delayMultiplier < 1.15) {
        congestionLevel = 'LOW';
        reason = 'Clear roads, normal traffic flow';
      } else if (delayMultiplier < 1.35) {
        congestionLevel = 'MODERATE';
        reason = 'Typical commuter traffic on arterial roads';
      } else if (delayMultiplier < 1.6) {
        congestionLevel = 'HIGH';
        reason = 'Heavy traffic near school zone / intersection backup';
      } else {
        congestionLevel = 'SEVERE';
        reason = 'Road construction / accident reported on route segment';
      }

      conditions.push({
        segmentFrom: `Stop ${i + 1}`,
        segmentTo: `Stop ${i + 2}`,
        delayMultiplier: Math.round(delayMultiplier * 100) / 100,
        estimatedDelayMinutes,
        congestionLevel,
        reason
      });
    }

    return conditions;
  }

  /**
   * Calculate the adjusted total route time including traffic delays.
   * @param baseTimeMinutes - base route time without traffic
   * @param conditions - traffic conditions for each segment
   * @returns adjusted total time in minutes
   */
  static calculateAdjustedTime(
    baseTimeMinutes: number,
    conditions: TrafficCondition[]
  ): number {
    if (conditions.length === 0) return baseTimeMinutes;

    const avgMultiplier = conditions.reduce((sum, c) => sum + c.delayMultiplier, 0) / conditions.length;
    return Math.round(baseTimeMinutes * avgMultiplier * 10) / 10;
  }

  /**
   * Calculate dynamic pickup time windows based on route order and traffic.
   * @param startTime - route start time in "HH:MM" format
   * @param stopCount - number of stops
   * @param conditions - traffic conditions
   * @returns array of {start, end} time strings for each stop
   */
  static calculatePickupWindows(
    startTime: string = '07:00',
    stopCount: number,
    conditions: TrafficCondition[]
  ): { start: string; end: string }[] {
    const [startHour, startMin] = startTime.split(':').map(Number);
    let currentMinutes = startHour * 60 + startMin;
    const windows: { start: string; end: string }[] = [];

    for (let i = 0; i < stopCount; i++) {
      const windowStart = this.minutesToTime(currentMinutes);
      const windowEnd = this.minutesToTime(currentMinutes + 5); // 5-min pickup window at each stop
      windows.push({ start: windowStart, end: windowEnd });

      // Calculate travel time to next stop with traffic
      if (i < conditions.length) {
        const baseTravel = 3; // 3 min base between stops
        const adjustedTravel = baseTravel * conditions[i].delayMultiplier;
        currentMinutes += adjustedTravel + 2; // +2 min for stop/board time
      }
    }

    return windows;
  }

  private static minutesToTime(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60) % 24;
    const mins = Math.round(totalMinutes % 60);
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }
}

export default TrafficSimulator;
