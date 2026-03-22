I want to build a Dantotsu/Aniyomi compatible anime extension system. 

Here is the plan:

PART 1 - Vercel Proxy API (Node.js)
- Build a proxy API hosted on Vercel
- It will scrape these sites: AnimeKai, AnimePahe, AniWave, Aniwatchtv.su, Anikoto
- Start with AnimeKai first
- Each site needs 4 endpoints: /search, /info, /episodes, /stream
- Use axios + cheerio for scraping
- Add realistic browser headers in all requests to bypass Cloudflare
- All responses return standardized JSON format

PART 2 - Kotlin Extension
- Use the repo at ./extensions-source as reference for structure
- Build one Kotlin extension per site
- Each extension's BASE_URL points to our Vercel API, NOT the anime site directly
- This way VI ISP blocks are bypassed since our phone only talks to Vercel

Build PART 1 first, step by step, starting with:
1. package.json + vercel.json
2. lib/fetcher.js (core HTTP fetcher with browser headers)
3. lib/cors.js
4. api/health.js
5. api/animekai/ (all 4 endpoints)

Do not proceed to next step until current step is complete.