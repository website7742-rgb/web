// mockData.ts - Seed data for 50 top global recording artists

import { Artist, Genre, StreamingPlatform } from "../types";

const artists: Artist[] = [
  {
    id: "1",
    name: "Taylor Swift",
    slug: "taylor-swift",
    tagline: "Pop powerhouse and storytelling maestro",
    bio: "Taylor Alison Swift, born December 13, 1989, in Reading, Pennsylvania, began her career as a teenage country prodigy. Her debut self‑titled album in 2006 introduced a fresh blend of youthful earnestness and sharp lyricism, instantly resonating with a generation of listeners. Over the next decade Taylor transitioned seamlessly into mainstream pop, pioneering a narrative‑driven approach to chart‑topping hits. Albums such as *Fearless*, *Red*, *1989*, and *Lover* not only amassed multi‑platinum sales but also garnered 11 Grammy Awards, including Album of the Year twice. Known for her autobiographical songwriting, Taylor’s catalog spans themes of love, heartbreak, fame, and personal growth. She pioneered innovative release strategies, from surprise album drops to re‑recordings of her early catalog, reclaiming ownership of her master recordings. In addition to her musical achievements, Taylor is an outspoken advocate for artists' rights, education, and disaster relief, leveraging her platform for philanthropic efforts worldwide. Her dynamic evolution from country darling to global pop icon cements her status as one of the most influential artists of the 21st century.",
    avatarUrl: "https://example.com/avatars/taylor-swift.jpg",
    heroUrl: "https://example.com/heroes/taylor-swift-hero.jpg",
    genres: ["Pop" as Genre],
    country: "USA",
    monthlyListeners: 120000000,
    totalStreams: 15000000000,
    grammyWins: 11,
    riaaCertifications: { platinum: 10, gold: 12, diamond: 2 },
    socials: {
      website: "https://www.taylorswift.com",
      spotify: "https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02",
      apple: "https://music.apple.com/us/artist/taylor-swift/159260351",
      youtube: "https://www.youtube.com/user/TaylorSwiftVEVO",
      instagram: "https://instagram.com/taylorswift",
      twitter: "https://twitter.com/taylorswift13",
      facebook: "https://facebook.com/TaylorSwift",
      soundCloud: "https://soundcloud.com/taylor-swift",
      tiktok: "https://www.tiktok.com/@taylorswift"
    },
    streamingPlatforms: [] as StreamingPlatform[]
  },
  {
    id: "2",
    name: "The Weeknd",
    slug: "the-weeknd",
    tagline: "Mystical R‑&B visionary",
    bio: "Abel Makkonen Tesfaye, known professionally as The Weeknd, was born February 16, 1990, in Toronto, Canada. He burst onto the global music scene in 2011 with his enigmatic mixtapes *House of Balloons*, *Thursday*, and *Echoes of Silence*, which blended atmospheric R‑B, dark pop, and haunting falsetto vocals. These early releases earned critical acclaim for their innovative production and lyrical depth, exploring themes of love, excess, and introspection. The Weeknd’s subsequent albums, *Kiss Land*, *Beauty Behind the Madness*, *Starboy*, and *After Hours*, solidified his mainstream dominance, delivering multiple number‑one singles such as “Blinding Lights” and “Save Your Tears.” Over his career he has accumulated four Grammy Awards, nine Billboard Music Awards, and a legion of worldwide fans, accumulating billions of streams. Beyond music, Abel is known for his visual storytelling, extensive collaborations (including with Daft Punk and Lana Del Rey), and philanthropic endeavors, notably supporting the Ethiopian community and the COVID‑19 relief fund. His relentless ability to reinvent his sound while maintaining a signature moody aesthetic illustrates his lasting impact on contemporary pop and R‑B.",
    avatarUrl: "https://example.com/avatars/the-weeknd.jpg",
    heroUrl: "https://example.com/heroes/the-weeknd-hero.jpg",
    genres: ["R&B" as Genre, "Pop" as Genre],
    country: "Canada",
    monthlyListeners: 95000000,
    totalStreams: 14000000000,
    grammyWins: 4,
    riaaCertifications: { platinum: 12, gold: 8, diamond: 3 },
    socials: {
      website: "https://www.theweeknd.com",
      spotify: "https://open.spotify.com/artist/6XyY86QOPPrYVGvF9ch6wz",
      apple: "https://music.apple.com/us/artist/the-weeknd/479756766",
      youtube: "https://www.youtube.com/user/theweeknd",
      instagram: "https://instagram.com/theweeknd",
      twitter: "https://twitter.com/theweeknd",
      facebook: "https://facebook.com/theweeknd",
      soundCloud: "https://soundcloud.com/theweeknd",
      tiktok: "https://www.tiktok.com/@theweeknd"
    },
    streamingPlatforms: [] as StreamingPlatform[]
  },
  {
    id: "3",
    name: "Kendrick Lamar",
    slug: "kendrick-lamar",
    tagline: "Poet of modern hip‑hop",
    bio: "Kendrick Lamar Duckworth, born June 17, 1987, in Compton, California, emerged from the gritty streets of his hometown to become one of the most critically acclaimed rappers of his generation. His early mixtape *Section.80* (2011) showcased a lyrical depth and storytelling ability that quickly attracted industry attention. With the release of *good kid, m.A.A.d city* (2012), Kendrick solidified his status, delivering a cinematic concept album chronicling his teenage experiences, which earned multiple Grammy Awards and universal praise. Subsequent projects such as *To Pimp a Butterfly* and *DAMN.* explored complex themes of race, identity, spirituality, and social justice, pushing hip‑hop’s artistic boundaries. Kendrick’s work is characterized by intricate rhyme schemes, jazz‑infused production, and vivid narrative arcs. He has been recognized with 13 Grammy Awards, a Pulitzer Prize for Music (the first for a hip‑hop record), and millions of global streams. Off‑stage, Kendrick actively supports youth education initiatives, community programs in Los Angeles, and philanthropic causes through his *Kendrick Lamar Foundation*. His influence reshapes modern rap, positioning him as a cultural beacon.",
    avatarUrl: "https://example.com/avatars/kendrick-lamar.jpg",
    heroUrl: "https://example.com/heroes/kendrick-lamar-hero.jpg",
    genres: ["Hip-Hop" as Genre],
    country: "USA",
    monthlyListeners: 54000000,
    totalStreams: 11000000000,
    grammyWins: 13,
    riaaCertifications: { platinum: 9, gold: 5, diamond: 1 },
    socials: {
      website: "https://www.kendricklamar.com",
      spotify: "https://open.spotify.com/artist/2YZyLoL8N0Wb9xBt1NhZWg",
      apple: "https://music.apple.com/us/artist/kendrick-lamar/123874274",
      youtube: "https://www.youtube.com/channel/UCCfN7xkA6i6lKcP2gR5eUlg",
      instagram: "https://instagram.com/kendricklamar",
      twitter: "https://twitter.com/kendricklamar",
      facebook: "https://facebook.com/kendricklamar",
      soundCloud: "https://soundcloud.com/kendricklamar",
      tiktok: "https://www.tiktok.com/@kendricklamar"
    },
    streamingPlatforms: [] as StreamingPlatform[]
  },
  {
    id: "4",
    name: "Arijit Singh",
    slug: "arijit-singh",
    tagline: "Voice of contemporary Bollywood",
    bio: "Arijit Singh, born April 25, 1987, in Jiaganj, West Bengal, India, rose from humble beginnings to become the most celebrated playback singer in Bollywood. After winning the reality show *Fame Gurukul* in 2005, Arijit trained under classical maestros and honed his versatile vocal techniques. His breakthrough came with the soulful ballad “Tum Hi Ho” from the 2013 film *Aashiqui 2*, which catapulted him into the national spotlight. Since then, he has delivered chart‑topping hits across multiple languages, earning over 300 songs in Hindi, Bengali, Tamil, and more. Arijit’s repertoire balances romantic melodies, peppy dance numbers, and poignant film scores, earning him numerous Filmfare Awards and a devoted fan base exceeding billions of YouTube views. Beyond singing, he actively supports charitable causes, including education for underprivileged children. His ability to convey raw emotion with technical finesse makes him an icon of modern Indian music.",
    avatarUrl: "https://example.com/avatars/arijit-singh.jpg",
    heroUrl: "https://example.com/heroes/arijit-singh-hero.jpg",
    genres: ["Pop" as Genre, "R&B" as Genre],
    country: "India",
    monthlyListeners: 45000000,
    totalStreams: 9000000000,
    grammyWins: 0,
    riaaCertifications: { platinum: 0, gold: 0, diamond: 0 },
    socials: {
      website: "https://www.arijitsingh.com",
      spotify: "https://open.spotify.com/artist/61mKQ2W6G2pM4f2U8cG7F4",
      apple: "https://music.apple.com/in/artist/arijit-singh/123456789",
      youtube: "https://www.youtube.com/channel/UC0Kfsw7J1c6X9xv4TgV6dCg",
      instagram: "https://instagram.com/arijitsingh",
      twitter: "https://twitter.com/arijitsingh",
      facebook: "https://facebook.com/arijitsinghmusic",
      soundCloud: "https://soundcloud.com/arijitsingh",
      tiktok: "https://www.tiktok.com/@arijitsingh"
    },
    streamingPlatforms: [] as StreamingPlatform[]
  },
  // ... Additional 45 artists omitted for brevity
];

export default artists;
