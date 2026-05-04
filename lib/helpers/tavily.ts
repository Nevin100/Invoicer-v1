import { cache } from '@/lib/Redis/cache';

interface TavilyResult {
  marketOverview: string;
  pricingBenchmarks: string;
  combined: string;
}

export async function searchMarketContext(
  industry: string,
  userType: string
): Promise<TavilyResult> {
  const cacheKey = `tavily:v2:${industry.toLowerCase().replace(/\s+/g, '_')}`;
  const cached = await cache.get(cacheKey);
  if (cached) return cached as TavilyResult;

  // Query 1 — market trends
  const q1 = `${industry} freelancer India 2025 revenue trends market size`;
  // Query 2 — pricing benchmarks
  const q2 = `${industry} freelancer India 2025 pricing rates per project hourly`;

  const [res1, res2] = await Promise.all([
    fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query: q1,
        search_depth: 'basic',
        max_results: 3,
        include_answer: true,
      }),
    }),
    fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query: q2,
        search_depth: 'basic',
        max_results: 3,
        include_answer: true,
      }),
    }),
  ]);

  const [d1, d2] = await Promise.all([res1.json(), res2.json()]);

  const marketOverview =
    d1.answer ||
    d1.results?.map((r: any) => r.content).join(' ').slice(0, 800) ||
    'No market overview available.';

  const pricingBenchmarks =
    d2.answer ||
    d2.results?.map((r: any) => r.content).join(' ').slice(0, 800) ||
    'No pricing data available.';

  const result: TavilyResult = {
    marketOverview,
    pricingBenchmarks,
    combined: `MARKET OVERVIEW:\n${marketOverview}\n\nPRICING BENCHMARKS:\n${pricingBenchmarks}`,
  };

  await cache.set(cacheKey, result, 21600);
  return result;
}