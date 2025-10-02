// Rate Limit Monitor to track API usage
interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: number;
}

class RateLimitMonitor {
  private rateLimits = new Map<string, RateLimitInfo>();
  private requestCounts = new Map<string, number>();
  private readonly WARNING_THRESHOLD = 0.8; // Warn at 80% usage

  updateRateLimit(apiName: string, headers: Headers) {
    const limit = parseInt(headers.get('X-RateLimit-Limit') || '1000');
    const remaining = parseInt(headers.get('X-RateLimit-Remaining') || '1000');
    const resetTime = Date.now() + (60 * 60 * 1000); // Assume 1 hour reset

    this.rateLimits.set(apiName, {
      limit,
      remaining,
      resetTime
    });

    // Track request count
    const currentCount = this.requestCounts.get(apiName) || 0;
    this.requestCounts.set(apiName, currentCount + 1);
  }

  getRateLimitInfo(apiName: string): RateLimitInfo | null {
    return this.rateLimits.get(apiName) || null;
  }

  getUsagePercentage(apiName: string): number {
    const info = this.getRateLimitInfo(apiName);
    if (!info) return 0;
    return ((info.limit - info.remaining) / info.limit) * 100;
  }

  isNearLimit(apiName: string): boolean {
    return this.getUsagePercentage(apiName) >= (this.WARNING_THRESHOLD * 100);
  }

  getRequestCount(apiName: string): number {
    return this.requestCounts.get(apiName) || 0;
  }

  getAllStats() {
    const stats: Record<string, any> = {};
    
    for (const [apiName, info] of this.rateLimits.entries()) {
      stats[apiName] = {
        limit: info.limit,
        remaining: info.remaining,
        used: info.limit - info.remaining,
        usagePercentage: this.getUsagePercentage(apiName),
        requestCount: this.getRequestCount(apiName),
        isNearLimit: this.isNearLimit(apiName)
      };
    }

    return stats;
  }

  reset() {
    this.rateLimits.clear();
    this.requestCounts.clear();
  }
}

export const rateLimitMonitor = new RateLimitMonitor();

// Helper function to extract rate limit info from response
export const extractRateLimitInfo = (response: Response, apiName: string) => {
  if (response.headers.has('X-RateLimit-Limit')) {
    rateLimitMonitor.updateRateLimit(apiName, response.headers);
  }
};
