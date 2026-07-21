const fs = require('fs');
// read mockData.ts
let content = fs.readFileSync('src/lib/data/mockData.ts', 'utf-8');

// Since mockData.ts is TypeScript and we just need URLs, we can extract them using regex
let urls = [];
let regex = /avatarUrl:\s*['"`](.*?)['"`]/g;
let match;
while ((match = regex.exec(content)) !== null) {
  urls.push({ type: 'avatar', url: match[1] });
}

let regexHero = /heroUrl:\s*['"`](.*?)['"`]/g;
while ((match = regexHero.exec(content)) !== null) {
  urls.push({ type: 'hero', url: match[1] });
}

console.log(`Found ${urls.length} URLs to check.`);

async function checkUrls() {
  for (let item of urls) {
    if (!item.url.startsWith('http')) continue;
    try {
      const res = await fetch(item.url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!res.ok) {
        console.log(`BROKEN: [${res.status}] ${item.type} - ${item.url}`);
      }
    } catch (e) {
      console.log(`ERROR: ${item.type} - ${item.url} - ${e.message}`);
    }
  }
  console.log('Finished checking URLs.');
}

checkUrls();
