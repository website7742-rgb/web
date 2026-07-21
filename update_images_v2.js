const fs = require('fs');

const API_BASE = 'https://en.wikipedia.org/api/rest_v1/page/summary/';

const artistWikiMap = {
    'Taylor Swift': 'Taylor_Swift',
    'Kendrick Lamar': 'Kendrick_Lamar',
    'The Weeknd': 'The_Weeknd',
    'Billie Eilish': 'Billie_Eilish',
    'Drake': 'Drake_(musician)',
    'Bad Bunny': 'Bad_Bunny',
    'SZA': 'SZA_(singer)',
    'Travis Scott': 'Travis_Scott',
    'Ed Sheeran': 'Ed_Sheeran',
    'Beyoncé': 'Beyonc%C3%A9',
    'Ariana Grande': 'Ariana_Grande',
    'Post Malone': 'Post_Malone',
    'Dua Lipa': 'Dua_Lipa',
    'Adele': 'Adele',
    'Bruno Mars': 'Bruno_Mars',
    'Eminem': 'Eminem',
    'BTS': 'BTS',
    'Lady Gaga': 'Lady_Gaga',
    'Olivia Rodrigo': 'Olivia_Rodrigo',
    'J Balvin': 'J_Balvin',
    'Coldplay': 'Coldplay',
    'Rihanna': 'Rihanna',
    'Justin Bieber': 'Justin_Bieber',
    'Shakira': 'Shakira',
    'Nicki Minaj': 'Nicki_Minaj',
    'Doja Cat': 'Doja_Cat',
    'Harry Styles': 'Harry_Styles',
    'Elton John': 'Elton_John',
    'Michael Jackson': 'Michael_Jackson',
    'Lana Del Rey': 'Lana_Del_Rey',
    'Rosalía': 'Rosal%C3%ADa',
    'Imagine Dragons': 'Imagine_Dragons',
    'Miley Cyrus': 'Miley_Cyrus',
    'Kanye West': 'Kanye_West',
    'Jay-Z': 'Jay-Z',
    'Katy Perry': 'Katy_Perry',
    'Lil Wayne': 'Lil_Wayne',
    'Sam Smith': 'Sam_Smith_(singer)',
    'Arijit Singh': 'Arijit_Singh',
    'Camila Cabello': 'Camila_Cabello',
    'Future': 'Future_(rapper)',
    'Mariah Carey': 'Mariah_Carey',
    'Selena Gomez': 'Selena_Gomez',
    'Cardi B': 'Cardi_B',
    'Sabrina Carpenter': 'Sabrina_Carpenter',
    'Morgan Wallen': 'Morgan_Wallen',
    'Burna Boy': 'Burna_Boy',
    'The Beatles': 'The_Beatles',
    'Lizzo': 'Lizzo',
    'Wizkid': 'Wizkid'
};

const artistList = Object.keys(artistWikiMap);

async function fetchImage(artistName) {
    const slug = artistWikiMap[artistName];
    try {
        const response = await fetch(API_BASE + slug);
        if (!response.ok) return null;
        const data = await response.json();
        if (data.originalimage && data.originalimage.source) {
            return data.originalimage.source;
        } else if (data.thumbnail && data.thumbnail.source) {
            return data.thumbnail.source;
        }
    } catch (e) {
        console.error("Error fetching", artistName, e);
    }
    return null;
}

async function run() {
    const filePath = 'e:/winddosfiles/for my/src/lib/data/mockData.ts';
    let content = fs.readFileSync(filePath, 'utf-8');

    // Split by the artist comment header "// 1. Taylor Swift", "// 2. Kendrick Lamar" etc.
    // This safely isolates each artist's block.
    // The separator is `\n  // \d+\. `
    const splitRegex = /\n\s*\/\/\s*\d+\.\s*/;
    const blocks = content.split(splitRegex);
    
    console.log(`Found ${blocks.length - 1} artist blocks in mockData.ts`);

    if (blocks.length - 1 !== 50) {
        console.error("Error: Expected 50 artist blocks, found " + (blocks.length - 1));
        return;
    }

    // blocks[0] is everything before the first artist (imports, etc)
    // blocks[1] is Artist 1, blocks[50] is Artist 50

    for (let i = 1; i <= 50; i++) {
        const artistName = artistList[i - 1]; // arrays are 0 indexed
        const imageUrl = await fetchImage(artistName);
        
        if (imageUrl) {
            console.log(`[OK] Fetched ${artistName}: ${imageUrl}`);
            
            // Only replace the FIRST occurrence of avatarUrl and heroUrl in this specific block
            blocks[i] = blocks[i].replace(/avatarUrl:\s*'[^']+',/, `avatarUrl: '${imageUrl}',`);
            blocks[i] = blocks[i].replace(/heroUrl:\s*'[^']+',/, `heroUrl: '${imageUrl}',`);
        } else {
            console.log(`[FAILED] Could not fetch image for ${artistName}`);
        }
        
        // slight delay to not hammer the API
        await new Promise(r => setTimeout(r, 80));
    }

    // Reconstruct the file content
    let newContent = blocks[0];
    for (let i = 1; i <= 50; i++) {
        newContent += `\n  // ${i}. ` + blocks[i];
    }

    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log("Updated mockData.ts successfully!");
}

run();
