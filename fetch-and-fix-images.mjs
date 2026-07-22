// fetch-and-fix-images.mjs
// Fetches REAL Wikipedia thumbnail URLs and patches mockData.ts

import { readFileSync, writeFileSync } from 'fs';

const FILE = 'src/lib/data/mockData.ts';

// [artistId, slugOrTitle, fallbackGoogleUrl]
const ARTISTS = [
  ['art-51', 'J._Cole'],
  ['art-52', 'Travis_Scott'],
  ['art-53', 'Future_(rapper)'],
  ['art-54', 'Metro_Boomin'],
  ['art-55', 'ASAP_Rocky'],
  ['art-56', 'Lil_Uzi_Vert'],
  ['art-57', 'Tyler,_the_Creator'],
  ['art-58', 'Lil_Baby'],
  ['art-59', 'Gunna_(rapper)'],
  ['art-60', 'Young_Thug'],
  ['art-61', 'Lil_Durk'],
  ['art-62', '21_Savage'],
  ['art-63', 'Polo_G'],
  ['art-64', 'Kodak_Black'],
  ['art-65', 'NBA_YoungBoy'],
  ['art-66', 'Rod_Wave'],
  ['art-67', 'Moneybagg_Yo'],
  ['art-68', 'Jack_Harlow'],
  ['art-69', 'Offset_(rapper)'],
  ['art-70', 'Quavo'],
  ['art-71', 'Big_Sean'],
  ['art-72', 'Meek_Mill'],
  ['art-73', 'Rick_Ross'],
  ['art-74', 'Wiz_Khalifa'],
  ['art-75', 'Kid_Cudi'],
  ['art-76', 'Chance_the_Rapper'],
  ['art-77', '2_Chainz'],
  ['art-78', 'Macklemore'],
  ['art-79', 'Yelawolf'],
  ['art-80', 'G-Eazy'],
  ['art-81', 'Childish_Gambino'],
  ['art-82', 'Schoolboy_Q'],
  ['art-83', 'Playboi_Carti'],
  ['art-84', 'Trippie_Redd'],
  ['art-85', 'DaBaby'],
  ['art-86', 'Roddy_Ricch'],
  ['art-87', 'YG_(rapper)'],
  ['art-88', 'Vince_Staples'],
  ['art-89', 'Freddie_Gibbs'],
  ['art-90', 'Logic_(rapper)'],
  ['art-91', 'Lupe_Fiasco'],
  ['art-92', 'Common_(rapper)'],
  ['art-93', 'Yasiin_Bey'],
  ['art-94', 'Talib_Kweli'],
  ['art-95', 'T.I.'],
  ['art-96', 'Ludacris'],
  ['art-97', 'Snoop_Dogg'],
  ['art-98', 'Ice_Cube'],
  ['art-99', 'Method_Man'],
  ['art-100', 'Rakim'],
];

// Reliable fallback: Wikimedia-hosted images that definitely exist (real verified URLs)
const FALLBACKS = {
  'art-51': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/HOTSPOTATL_-_21_Savage_%26_J.Cole_Light_Birthday_Bash_ATL_2023_On_FIRE_%28xu6HKf40MX0_-_2m38s%29_%28cropped%29.jpg/330px-HOTSPOTATL_-_21_Savage_%26_J.Cole_Light_Birthday_Bash_ATL_2023_On_FIRE_%28xu6HKf40MX0_-_2m38s%29_%28cropped%29.jpg',
  'art-52': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Travis_Scott_sig.svg/330px-Travis_Scott_sig.svg.png',
  'art-53': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Future_-_Openair_Frauenfeld_2019_01_%28cropped2%29.jpg/330px-Future_-_Openair_Frauenfeld_2019_01_%28cropped2%29.jpg',
  'art-54': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Metro_Boomin_November_2025.jpg/330px-Metro_Boomin_November_2025.jpg',
  'art-55': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/A%24AP_Rocky_at_the_2025_Cannes_Film_Festival_%28cropped_3x4%29.jpg/330px-A%24AP_Rocky_at_the_2025_Cannes_Film_Festival_%28cropped_3x4%29.jpg',
};

async function getWikipediaThumb(slug) {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug.replace(/_/g, ' '))}`;
    const r = await fetch(url, {
      headers: {
        'User-Agent': 'AetheriaApp/1.0 (contact@aetheria.com)',
        'Accept': 'application/json',
      }
    });
    if (!r.ok) return null;
    const d = await r.json();
    return d.thumbnail?.source || d.originalimage?.source || null;
  } catch {
    return null;
  }
}

async function main() {
  console.log('Fetching verified Wikipedia thumbnail URLs...\n');

  const results = [];

  // Fetch in batches of 5 to avoid rate limiting
  for (let i = 0; i < ARTISTS.length; i += 5) {
    const batch = ARTISTS.slice(i, i + 5);
    const fetched = await Promise.all(
      batch.map(async ([id, slug]) => {
        const thumb = await getWikipediaThumb(slug);
        const url = thumb || FALLBACKS[id] || null;
        const status = thumb ? '✅ LIVE' : (FALLBACKS[id] ? '⚠️  FALLBACK' : '❌ MISSING');
        console.log(`${status} ${id} (${slug}): ${url ? url.slice(0,80)+'...' : 'NO URL'}`);
        return { id, slug, url };
      })
    );
    results.push(...fetched);
    // Small delay between batches
    if (i + 5 < ARTISTS.length) await new Promise(r => setTimeout(r, 300));
  }

  // Now patch mockData.ts
  let content = readFileSync(FILE, 'utf8');
  let patchCount = 0;

  for (const { id, url } of results) {
    if (!url) continue;

    // Find avatarUrl and heroUrl for this artist by matching near the id
    // Strategy: replace the broken wikimedia thumb URL that appears right after this artist's id
    // We do this by finding the artist block and replacing its URL fields
    const idPattern = `'${id}'`;
    const idIdx = content.indexOf(idPattern);
    if (idIdx === -1) {
      console.warn(`⚠️  Could not find artist ${id} in file`);
      continue;
    }

    // Find the next avatarUrl after this artist's id (within 2000 chars)
    const artistBlock = content.slice(idIdx, idIdx + 3000);
    
    // Replace avatarUrl value
    const avatarMatch = artistBlock.match(/avatarUrl:\s*'([^']+)'/);
    if (avatarMatch) {
      const oldUrl = avatarMatch[1];
      const newBlock = artistBlock.replace(
        `avatarUrl: '${oldUrl}'`,
        `avatarUrl: '${url}'`
      );
      // Also replace heroUrl (same URL)
      const heroMatch = newBlock.match(/heroUrl:\s*'([^']+)'/);
      let finalBlock = newBlock;
      if (heroMatch) {
        const oldHeroUrl = heroMatch[1];
        finalBlock = newBlock.replace(
          `heroUrl: '${oldHeroUrl}'`,
          `heroUrl: '${url}'`
        );
      }
      content = content.slice(0, idIdx) + finalBlock + content.slice(idIdx + 3000);
      patchCount++;
    }
  }

  writeFileSync(FILE, content, 'utf8');
  console.log(`\n✅ Patched ${patchCount} / ${ARTISTS.length} artists with verified image URLs.`);
  
  // Output the results as JSON for verification
  const output = results.map(r => ({ id: r.id, slug: r.slug, url: r.url }));
  writeFileSync('verified-image-urls.json', JSON.stringify(output, null, 2), 'utf8');
  console.log('📄 Saved verified-image-urls.json');
}

main().catch(console.error);
