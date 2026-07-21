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

async function fetchImage(artistName) {
    const slug = artistWikiMap[artistName] || artistName.replace(/\s+/g, '_');
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

    const artistRegex = /name:\s*'([^']+)'/g;
    let match;
    const names = [];
    while ((match = artistRegex.exec(content)) !== null) {
        names.push(match[1]);
    }

    console.log(`Found ${names.length} artists in mockData.ts`);

    for (const name of names) {
        const imageUrl = await fetchImage(name);
        if (imageUrl) {
            console.log(`[OK] Fetched ${name}: ${imageUrl}`);
            
            // Replace avatarUrl
            const avatarRegex = new RegExp(`(name:\\s*'${name.replace(/[.*+?^$\\{}()|[\\]\\\\]/g, '\\$&')}',[\\s\\S]*?avatarUrl:\\s*')([^']+)(')`, 'g');
            content = content.replace(avatarRegex, `$1${imageUrl}$3`);

            // Replace heroUrl
            const heroRegex = new RegExp(`(name:\\s*'${name.replace(/[.*+?^$\\{}()|[\\]\\\\]/g, '\\$&')}',[\\s\\S]*?heroUrl:\\s*')([^']+)(')`, 'g');
            content = content.replace(heroRegex, `$1${imageUrl}$3`);
        } else {
            console.log(`[FAILED] Could not fetch image for ${name}`);
        }
        
        // slight delay to not hammer the API
        await new Promise(r => setTimeout(r, 100));
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log("Updated mockData.ts successfully!");
}

run();
