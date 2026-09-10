import { Artist } from "../types";
import { artistsPart2 } from "./mockPart2";

const artists: Artist[] = [
  {
    "id": "1",
    "name": "Drake",
    "slug": "drake",
    "tagline": "The 6ix God — King of modern rap",
    "bio": "Aubrey Drake Graham, born October 24, 1986, in Toronto, Canada, is one of the best-selling music artists of all time with over 170 million records sold worldwide. He first gained recognition as Jimmy Brooks on Degrassi before transitioning to music. His mixtape Thank Me Later launched his career, and albums like Take Care, Nothing Was the Same, Views, and Certified Lover Boy cemented his dominance. Drake holds the record for most Billboard Hot 100 entries ever. He is the founder of OVO Sound label.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Drake_and_lil_wayne_2014.jpg/440px-Drake_and_lil_wayne_2014.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Drake_and_lil_wayne_2014.jpg/440px-Drake_and_lil_wayne_2014.jpg",
    "genres": [
      "Hip-Hop",
      "R&B"
    ],
    "country": "Canada",
    "monthlyListeners": 85000000,
    "totalStreams": 18000000000,
    "grammyWins": 5,
    "isVerified": true,
    "isFeatured": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "God's Plan",
      "Hotline Bling",
      "One Dance",
      "In My Feelings",
      "Started From The Bottom"
    ],
    "riaaCertifications": {
      "platinum": 30,
      "gold": 20,
      "diamond": 5
    },
    "socials": {
      "website": "https://drakerelated.com",
      "spotify": "https://open.spotify.com/artist/3TVXtAsR1Inumwj472S9r4",
      "instagram": "https://www.instagram.com/champagnepapi",
      "twitter": "https://twitter.com/drake",
      "youtube": "https://www.youtube.com/channel/UCByOQJjav0CUDwxCk-jVNRQ",
      "apple": "https://music.apple.com/us/artist/drake/271256"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-1",
        "name": "Official Website",
        "url": "https://drakerelated.com"
      },
      {
        "id": "sp-spot-1",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/3TVXtAsR1Inumwj472S9r4"
      },
      {
        "id": "sp-app-1",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/drake/271256"
      },
      {
        "id": "sp-yt-1",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UCByOQJjav0CUDwxCk-jVNRQ"
      }
    ]
  },
  {
    "id": "2",
    "name": "Kendrick Lamar",
    "slug": "kendrick-lamar",
    "tagline": "Compton's poet — Pulitzer Prize winner",
    "bio": "Kendrick Lamar Duckworth, born June 17, 1987, in Compton, California, is widely regarded as the greatest rapper of his generation. His debut major-label album good kid, m.A.A.d city (2012) was universally acclaimed. To Pimp a Butterfly (2015) and DAMN. (2017) pushed hip-hop artistic boundaries. In 2018, DAMN. won the Pulitzer Prize for Music. He has 17 Grammy Awards and headlined the 2025 Super Bowl halftime show.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Kendrick_Lamar_-_2019_by_Glenn_Francis.jpg/440px-Kendrick_Lamar_-_2019_by_Glenn_Francis.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Kendrick_Lamar_-_2019_by_Glenn_Francis.jpg/440px-Kendrick_Lamar_-_2019_by_Glenn_Francis.jpg",
    "genres": [
      "Hip-Hop",
      "Conscious Rap"
    ],
    "country": "USA",
    "monthlyListeners": 62000000,
    "totalStreams": 13000000000,
    "grammyWins": 17,
    "isVerified": true,
    "isFeatured": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "HUMBLE.",
      "DNA.",
      "Not Like Us",
      "Swimming Pools",
      "Money Trees"
    ],
    "riaaCertifications": {
      "platinum": 12,
      "gold": 8,
      "diamond": 2
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/2YZyLoL8N0Wb9xBtJNhZWJ",
      "instagram": "https://instagram.com/kendricklamar",
      "twitter": "https://twitter.com/kendricklamar"
    },
    "streamingPlatforms": []
  },
  {
    "id": "3",
    "name": "J. Cole",
    "slug": "j-cole",
    "tagline": "Forest Hills Drive — lyricist's lyricist",
    "bio": "Jermaine Lamarr Cole, born January 28, 1985, in Frankfurt, Germany and raised in Fayetteville, North Carolina, is one of the most respected MCs in hip-hop. His debut album Cole World: The Sideline Story (2011) debuted at number one. He became one of the few rappers to release a platinum album with no features. He co-founded Dreamville Records.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/J_Cole_2018.jpg/440px-J_Cole_2018.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/J_Cole_2018.jpg/440px-J_Cole_2018.jpg",
    "genres": [
      "Hip-Hop",
      "Conscious Rap"
    ],
    "country": "USA",
    "monthlyListeners": 48000000,
    "totalStreams": 9500000000,
    "grammyWins": 1,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "No Role Modelz",
      "Work Out",
      "MIDDLE CHILD",
      "Love Yourz",
      "Apparently"
    ],
    "riaaCertifications": {
      "platinum": 8,
      "gold": 6,
      "diamond": 1
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/6l3HvQ5sa6mXTsMTB19rO5",
      "instagram": "https://instagram.com/realcoleworld",
      "twitter": "https://twitter.com/JColeNC"
    },
    "streamingPlatforms": []
  },
  {
    "id": "4",
    "name": "Eminem",
    "slug": "eminem",
    "tagline": "Slim Shady — The rap god of Detroit",
    "bio": "Marshall Bruce Mathers III, born October 17, 1972, in St. Joseph, Missouri and raised in Detroit, Michigan, is one of the best-selling music artists of all time with over 220 million records sold worldwide. His albums The Slim Shady LP, The Marshall Mathers LP, and The Eminem Show became cultural phenomena. He has 15 Grammy Awards and remains the best-selling rapper of all time.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Eminem-2013.jpg/440px-Eminem-2013.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Eminem-2013.jpg/440px-Eminem-2013.jpg",
    "genres": [
      "Hip-Hop",
      "Hardcore Rap"
    ],
    "country": "USA",
    "monthlyListeners": 58000000,
    "totalStreams": 16000000000,
    "grammyWins": 15,
    "isVerified": true,
    "isFeatured": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Lose Yourself",
      "Rap God",
      "Without Me",
      "Slim Shady",
      "Not Afraid"
    ],
    "riaaCertifications": {
      "platinum": 40,
      "gold": 15,
      "diamond": 6
    },
    "socials": {
      "website": "https://www.eminem.com",
      "spotify": "https://open.spotify.com/artist/7dGJo4pcD2V6oG8kP0tJRR",
      "instagram": "https://instagram.com/eminem",
      "twitter": "https://twitter.com/Eminem",
      "youtube": "https://www.youtube.com/eminem"
    },
    "streamingPlatforms": []
  },
  {
    "id": "5",
    "name": "Kanye West",
    "slug": "kanye-west",
    "tagline": "Ye — Genius producer and cultural disruptor",
    "bio": "Kanye Omari West, born June 8, 1977, in Atlanta and raised in Chicago, Illinois, is a rapper, record producer, and fashion designer. His debut album The College Dropout (2004) redefined mainstream hip-hop. He has 24 Grammy Awards, making him one of the most awarded artists ever. His My Beautiful Dark Twisted Fantasy is widely considered one of the greatest albums ever made.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Kanye_West_at_the_2009_Tribeca_Film_Festival.jpg/440px-Kanye_West_at_the_2009_Tribeca_Film_Festival.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Kanye_West_at_the_2009_Tribeca_Film_Festival.jpg/440px-Kanye_West_at_the_2009_Tribeca_Film_Festival.jpg",
    "genres": [
      "Hip-Hop",
      "Experimental Rap"
    ],
    "country": "USA",
    "monthlyListeners": 52000000,
    "totalStreams": 12000000000,
    "grammyWins": 24,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Stronger",
      "Gold Digger",
      "POWER",
      "All Falls Down",
      "Heartless"
    ],
    "riaaCertifications": {
      "platinum": 20,
      "gold": 10,
      "diamond": 3
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x",
      "instagram": "https://instagram.com/ye",
      "twitter": "https://twitter.com/kanyewest"
    },
    "streamingPlatforms": []
  },
  {
    "id": "6",
    "name": "Travis Scott",
    "slug": "travis-scott",
    "tagline": "La Flame — Psychedelic rap superstar",
    "bio": "Jacques Bermon Webster II, born April 30, 1991, in Houston, Texas, is a rapper and record producer known for his energetic live performances and atmospheric production. His breakthrough came with Rodeo (2015), followed by Astroworld (2018) which spawned the diamond-certified SICKO MODE, and Utopia (2023). His Fortnite virtual concert drew 27.7 million concurrent players.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Travis_Scott_2018.jpg/440px-Travis_Scott_2018.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Travis_Scott_2018.jpg/440px-Travis_Scott_2018.jpg",
    "genres": [
      "Hip-Hop",
      "Trap",
      "Psychedelic Rap"
    ],
    "country": "USA",
    "monthlyListeners": 60000000,
    "totalStreams": 11500000000,
    "grammyWins": 0,
    "isVerified": true,
    "isFeatured": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "SICKO MODE",
      "goosebumps",
      "HIGHEST IN THE ROOM",
      "Antidote",
      "Butterfly Effect"
    ],
    "riaaCertifications": {
      "platinum": 15,
      "gold": 8,
      "diamond": 2
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/0Y5tJX1MQlPlqiwlOH1tJY",
      "instagram": "https://instagram.com/travisscott",
      "twitter": "https://twitter.com/trvisXX"
    },
    "streamingPlatforms": []
  },
  {
    "id": "7",
    "name": "Nicki Minaj",
    "slug": "nicki-minaj",
    "tagline": "The Queen — Trinidad rap royalty",
    "bio": "Onika Tanya Maraj-Petty, born December 8, 1982, in Saint James, Trinidad and Tobago, is one of the most successful female rappers of all time. She is the first female solo artist to have 100 entries on the Billboard Hot 100. Her albums Pink Friday, The Pinkprint, and Queen all debuted at number one.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Nicki_Minaj_-_Barclays_Center_2019_%2848675400222%29_%28cropped%29.jpg/440px-Nicki_Minaj_-_Barclays_Center_2019_%2848675400222%29_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Nicki_Minaj_-_Barclays_Center_2019_%2848675400222%29_%28cropped%29.jpg/440px-Nicki_Minaj_-_Barclays_Center_2019_%2848675400222%29_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "Pop Rap"
    ],
    "country": "Trinidad & Tobago",
    "monthlyListeners": 55000000,
    "totalStreams": 10000000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Super Bass",
      "Starships",
      "Anaconda",
      "Pills N Potions",
      "Bang Bang"
    ],
    "riaaCertifications": {
      "platinum": 18,
      "gold": 12,
      "diamond": 2
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/0hCNtLu0JehylgoiP8L4Gh",
      "instagram": "https://www.instagram.com/nickiminaj",
      "twitter": "https://twitter.com/NICKIMINAJ",
      "youtube": "https://www.youtube.com/channel/UC3jOd7GUMhpgJRBhiLzuLsg",
      "website": "https://mypinkfriday.com",
      "apple": "https://music.apple.com/us/artist/nicki-minaj/317584102"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-7",
        "name": "Official Website",
        "url": "https://mypinkfriday.com"
      },
      {
        "id": "sp-spot-7",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/0hCNtLu0JehylgoiP8L4Gh"
      },
      {
        "id": "sp-app-7",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/nicki-minaj/317584102"
      },
      {
        "id": "sp-yt-7",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UC3jOd7GUMhpgJRBhiLzuLsg"
      }
    ]
  },
  {
    "id": "8",
    "name": "Cardi B",
    "slug": "cardi-b",
    "tagline": "Bardi Gang — Bronx's billion-stream queen",
    "bio": "Belcalis Marlenis Almanzar, born October 11, 1992, in New York City, rose to fame on Love & Hip Hop: New York. Her debut single Bodak Yellow (2017) made her the first solo female rapper to top the Billboard Hot 100 since Lauryn Hill in 1998. Her debut album Invasion of Privacy (2018) won the Grammy for Best Rap Album.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Cardi_B_2019_%28cropped%29.jpg/440px-Cardi_B_2019_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Cardi_B_2019_%28cropped%29.jpg/440px-Cardi_B_2019_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "Trap"
    ],
    "country": "USA",
    "monthlyListeners": 50000000,
    "totalStreams": 9000000000,
    "grammyWins": 1,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Bodak Yellow",
      "WAP",
      "I Like It",
      "Money",
      "Up"
    ],
    "riaaCertifications": {
      "platinum": 14,
      "gold": 9,
      "diamond": 2
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/4kYSro6naA4h99UJvo89HB",
      "instagram": "https://instagram.com/iamcardib",
      "twitter": "https://twitter.com/iamcardib"
    },
    "streamingPlatforms": []
  },
  {
    "id": "9",
    "name": "Lil Baby",
    "slug": "lil-baby",
    "tagline": "ATL's realest — from the streets to the top",
    "bio": "Dominique Armani Jones, born December 3, 1994, in Atlanta, Georgia, is one of the defining voices of late 2010s trap music. His album My Turn (2020) spent over 12 weeks at number one and became one of the most streamed albums of 2020.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Lil_Baby_%28cropped%29.jpg/440px-Lil_Baby_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Lil_Baby_%28cropped%29.jpg/440px-Lil_Baby_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "Trap"
    ],
    "country": "USA",
    "monthlyListeners": 45000000,
    "totalStreams": 8000000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Drip Too Hard",
      "Woah",
      "The Bigger Picture",
      "Pure Cocaine",
      "Sum 2 Prove"
    ],
    "riaaCertifications": {
      "platinum": 10,
      "gold": 7,
      "diamond": 1
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/5f7VJjfbwm532GiveGC0ZK",
      "instagram": "https://instagram.com/lilbaby",
      "twitter": "https://twitter.com/lilbaby4PF"
    },
    "streamingPlatforms": []
  },
  {
    "id": "10",
    "name": "Future",
    "slug": "future",
    "tagline": "Freebandz — Atlanta trap pioneer",
    "bio": "Nayvadius DeMun Wilburn, born November 20, 1983, in Atlanta, Georgia, is a rapper who helped pioneer the melodic trap subgenre. His 2017 self-titled album and HNDRXX both debuted at number one in the same week, making him the first artist to accomplish that feat.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Future_%28rapper%29_2014_%28cropped%29.jpg/440px-Future_%28rapper%29_2014_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Future_%28rapper%29_2014_%28cropped%29.jpg/440px-Future_%28rapper%29_2014_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "Trap"
    ],
    "country": "USA",
    "monthlyListeners": 38000000,
    "totalStreams": 7500000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Mask Off",
      "Low Life",
      "March Madness",
      "Jumpman",
      "Life Is Good"
    ],
    "riaaCertifications": {
      "platinum": 12,
      "gold": 8,
      "diamond": 1
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/1RyvyyTE3xzB2ZywiAwp0i",
      "instagram": "https://instagram.com/future",
      "twitter": "https://twitter.com/1future"
    },
    "streamingPlatforms": []
  },
  {
    "id": "11",
    "name": "Lil Wayne",
    "slug": "lil-wayne",
    "tagline": "Weezy F Baby — New Orleans rap legend",
    "bio": "Dwayne Michael Carter Jr., born September 27, 1982, in New Orleans, Louisiana, is one of the most influential rappers of all time. He signed to Cash Money Records at age nine. His album Tha Carter III (2008) sold over one million copies in its first week. He has 5 Grammy Awards and over 100 million records sold.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Lil_Wayne.jpg/440px-Lil_Wayne.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Lil_Wayne.jpg/440px-Lil_Wayne.jpg",
    "genres": [
      "Hip-Hop",
      "Southern Rap"
    ],
    "country": "USA",
    "monthlyListeners": 35000000,
    "totalStreams": 8000000000,
    "grammyWins": 5,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Lollipop",
      "A Milli",
      "How To Love",
      "6 Foot 7 Foot",
      "Mirror"
    ],
    "riaaCertifications": {
      "platinum": 20,
      "gold": 15,
      "diamond": 2
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/55Aa2cqylxrFIXC767Z865",
      "instagram": "https://instagram.com/liltunechi",
      "twitter": "https://twitter.com/LilTunechi"
    },
    "streamingPlatforms": []
  },
  {
    "id": "12",
    "name": "Megan Thee Stallion",
    "slug": "megan-thee-stallion",
    "tagline": "Hot Girl Coach — Houston's fiercest",
    "bio": "Megan Jovon Ruth Pete, born February 15, 1995, in San Antonio, Texas, raised in Houston, Texas, is a rapper who won three Grammy Awards at the 2021 ceremony, including Best New Artist. Her collaboration WAP with Cardi B broke multiple streaming records.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Megan_Thee_Stallion_%28cropped%29.jpg/440px-Megan_Thee_Stallion_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Megan_Thee_Stallion_%28cropped%29.jpg/440px-Megan_Thee_Stallion_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "Trap"
    ],
    "country": "USA",
    "monthlyListeners": 42000000,
    "totalStreams": 7000000000,
    "grammyWins": 3,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "WAP",
      "Savage",
      "Hot Girl Summer",
      "Body",
      "Thot Shit"
    ],
    "riaaCertifications": {
      "platinum": 10,
      "gold": 6,
      "diamond": 1
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/181bsRPaVXVlUKXrxwZfHK",
      "instagram": "https://instagram.com/theestallion",
      "twitter": "https://twitter.com/theestallion"
    },
    "streamingPlatforms": []
  },
  {
    "id": "13",
    "name": "Post Malone",
    "slug": "post-malone",
    "tagline": "Posty — Genre-bending rap rock superstar",
    "bio": "Austin Richard Post, born July 4, 1995, in Syracuse, New York, is a rapper and singer known for blending hip-hop, pop, rock, and country. His album beerbongs and bentleys (2018) broke the record for most streams in a single day. Hollywood's Bleeding (2019) debuted at number one.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Post_Malone_2019_by_Glenn_Francis.jpg/440px-Post_Malone_2019_by_Glenn_Francis.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Post_Malone_2019_by_Glenn_Francis.jpg/440px-Post_Malone_2019_by_Glenn_Francis.jpg",
    "genres": [
      "Hip-Hop",
      "Pop Rap"
    ],
    "country": "USA",
    "monthlyListeners": 58000000,
    "totalStreams": 13000000000,
    "grammyWins": 0,
    "isVerified": true,
    "isFeatured": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Rockstar",
      "Circles",
      "Sunflower",
      "White Iverson",
      "Congratulations"
    ],
    "riaaCertifications": {
      "platinum": 20,
      "gold": 12,
      "diamond": 3
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/246dkjvS1zLTtiykXe5h60",
      "instagram": "https://instagram.com/postmalone",
      "twitter": "https://twitter.com/PostMalone"
    },
    "streamingPlatforms": []
  },
  {
    "id": "14",
    "name": "Young Thug",
    "slug": "young-thug",
    "tagline": "Slime Season — Atlanta's fashion-forward trapper",
    "bio": "Jeffery Lamar Williams, born August 16, 1991, in Atlanta, Georgia, is a rapper known for his unique melodic vocal style that influenced a generation of rappers. He founded YSL Records. His 2019 album So Much Fun debuted at number one.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Young_Thug_2018.jpg/440px-Young_Thug_2018.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Young_Thug_2018.jpg/440px-Young_Thug_2018.jpg",
    "genres": [
      "Hip-Hop",
      "Trap"
    ],
    "country": "USA",
    "monthlyListeners": 30000000,
    "totalStreams": 6000000000,
    "grammyWins": 1,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Havana",
      "Best Friend",
      "Check",
      "Digits",
      "Wyclef Jean"
    ],
    "riaaCertifications": {
      "platinum": 8,
      "gold": 5,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/50co4Is1HCEo8bhOyUWKpn",
      "instagram": "https://instagram.com/thuggerthugger1",
      "twitter": "https://twitter.com/youngthug"
    },
    "streamingPlatforms": []
  },
  {
    "id": "15",
    "name": "21 Savage",
    "slug": "21-savage",
    "tagline": "Slaughter Gang — London-born ATL king",
    "bio": "Sheeyaa Bin Abraham-Joseph, born October 22, 1992, in London, England and raised in Atlanta, Georgia, is a rapper known for his cold, deadpan delivery. His collaborative album Savage Mode II (2020) won the Grammy for Best Rap Album.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/21_Savage_2017_%28cropped%29.jpg/440px-21_Savage_2017_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/21_Savage_2017_%28cropped%29.jpg/440px-21_Savage_2017_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "Trap"
    ],
    "country": "UK",
    "monthlyListeners": 40000000,
    "totalStreams": 8500000000,
    "grammyWins": 1,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "A Lot",
      "Rockstar",
      "Bank Account",
      "No Heart",
      "Runnin"
    ],
    "riaaCertifications": {
      "platinum": 12,
      "gold": 8,
      "diamond": 1
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/1URnnhqYAYcrqrcwql10ft",
      "instagram": "https://instagram.com/21savage",
      "twitter": "https://twitter.com/21savage"
    },
    "streamingPlatforms": []
  },
  {
    "id": "16",
    "name": "Roddy Ricch",
    "slug": "roddy-ricch",
    "tagline": "Compton to global — the box builder",
    "bio": "Rodrick Lavell Moore Jr., born October 22, 1998, in Compton, California. His single The Box spent 11 consecutive weeks at number one on the Billboard Hot 100 in 2020. His debut album Please Excuse Me for Being Antisocial (2019) debuted at number one.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Roddy_Ricch_%28cropped%29.jpg/440px-Roddy_Ricch_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Roddy_Ricch_%28cropped%29.jpg/440px-Roddy_Ricch_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "Trap",
      "Melodic Rap"
    ],
    "country": "USA",
    "monthlyListeners": 32000000,
    "totalStreams": 6500000000,
    "grammyWins": 1,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "The Box",
      "High Fashion",
      "Ballin",
      "Start Wit Me",
      "Late at Night"
    ],
    "riaaCertifications": {
      "platinum": 9,
      "gold": 5,
      "diamond": 1
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/757aE44tKEUQEqRuT6GnEB",
      "instagram": "https://www.instagram.com/roddyricch",
      "twitter": "https://twitter.com/roddyricch",
      "youtube": "https://www.youtube.com/channel/UChQdA1rid5kKZh6oIc6DLNg",
      "website": "https://www.roddyricchofficial.com",
      "apple": "https://music.apple.com/us/artist/roddy-ricch/1301072970"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-16",
        "name": "Official Website",
        "url": "https://www.roddyricchofficial.com"
      },
      {
        "id": "sp-spot-16",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/757aE44tKEUQEqRuT6GnEB"
      },
      {
        "id": "sp-app-16",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/roddy-ricch/1301072970"
      },
      {
        "id": "sp-yt-16",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UChQdA1rid5kKZh6oIc6DLNg"
      }
    ]
  },
  {
    "id": "17",
    "name": "DaBaby",
    "slug": "dababy",
    "tagline": "Baby on Baby — Charlotte's finest",
    "bio": "Jonathan Lyndale Kirk, born December 22, 1991, in Cleveland, Ohio and raised in Charlotte, North Carolina. His collaboration with Dua Lipa on Levitating (2020 remix) spent 14 consecutive weeks at number one on the Hot 100.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/DaBaby_2019_%28cropped%29.jpg/440px-DaBaby_2019_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/DaBaby_2019_%28cropped%29.jpg/440px-DaBaby_2019_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "Trap"
    ],
    "country": "USA",
    "monthlyListeners": 28000000,
    "totalStreams": 5500000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Rockstar",
      "Suge",
      "BOP",
      "Levitating Remix",
      "BLIND"
    ],
    "riaaCertifications": {
      "platinum": 8,
      "gold": 5,
      "diamond": 1
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/4r63FhuTkUYltbVAg5TQnk",
      "instagram": "https://www.instagram.com/dababy",
      "twitter": "https://twitter.com/DaBabyDaBaby",
      "youtube": "https://www.youtube.com/channel/UC2CCXzC56k0b8L49R_iW-Yw",
      "website": "http://www.officialdababy.com/",
      "apple": "https://music.apple.com/us/artist/dababy/1175595427"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-17",
        "name": "Official Website",
        "url": "http://www.officialdababy.com/"
      },
      {
        "id": "sp-spot-17",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/4r63FhuTkUYltbVAg5TQnk"
      },
      {
        "id": "sp-app-17",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/dababy/1175595427"
      },
      {
        "id": "sp-yt-17",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UC2CCXzC56k0b8L49R_iW-Yw"
      }
    ]
  },
  {
    "id": "18",
    "name": "Polo G",
    "slug": "polo-g",
    "tagline": "Capalot — Chicago's emotional drill voice",
    "bio": "Taurus Bartlett, born January 6, 1999, in Chicago, Illinois. His album The GOAT (2020) featured RAPSTAR which hit number one on the Hot 100. He is one of the leading voices of Chicago's new generation of rappers.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Polo_G_2021.jpg/440px-Polo_G_2021.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Polo_G_2021.jpg/440px-Polo_G_2021.jpg",
    "genres": [
      "Hip-Hop",
      "Drill",
      "Melodic Rap"
    ],
    "country": "USA",
    "monthlyListeners": 25000000,
    "totalStreams": 5000000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "RAPSTAR",
      "Pop Out",
      "Through Da Storm",
      "Heartless",
      "Martin & Gina"
    ],
    "riaaCertifications": {
      "platinum": 6,
      "gold": 4,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/6AgTAQt8XS6jRWi4sX7w49",
      "instagram": "https://www.instagram.com/polo.capalot",
      "twitter": "https://twitter.com/polo_capalot",
      "youtube": "https://www.youtube.com/channel/UC0ifXd2AVf1LMYbqwB5GH4g",
      "website": "https://www.polocapalot.com/",
      "apple": "https://music.apple.com/us/artist/polo-g/1159371412"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-18",
        "name": "Official Website",
        "url": "https://www.polocapalot.com/"
      },
      {
        "id": "sp-spot-18",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/6AgTAQt8XS6jRWi4sX7w49"
      },
      {
        "id": "sp-app-18",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/polo-g/1159371412"
      },
      {
        "id": "sp-yt-18",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UC0ifXd2AVf1LMYbqwB5GH4g"
      }
    ]
  },
  {
    "id": "19",
    "name": "Gunna",
    "slug": "gunna",
    "tagline": "Wunna — Drip God of Atlanta",
    "bio": "Sergio Giavanni Kitchens, born June 14, 1993, in College Park, Georgia. His 2020 album WUNNA debuted at number one. His hit Fukumean (2022) became his biggest solo single, reaching the top five of the Hot 100.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Gunna_2018.jpg/440px-Gunna_2018.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Gunna_2018.jpg/440px-Gunna_2018.jpg",
    "genres": [
      "Hip-Hop",
      "Trap"
    ],
    "country": "USA",
    "monthlyListeners": 24000000,
    "totalStreams": 5000000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Fukumean",
      "Drip Too Hard",
      "Wit It",
      "Selling Sunset",
      "Banking on Me"
    ],
    "riaaCertifications": {
      "platinum": 7,
      "gold": 4,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/2hlmm7s2ICUX0LVIhVFlZQ",
      "instagram": "https://www.instagram.com/gunna",
      "twitter": "https://twitter.com/1GunnaGunna",
      "youtube": "https://www.youtube.com/channel/UCAkIMkEaa9sZmjcy7mfd5lQ",
      "website": "https://gunnamusic.com",
      "apple": "https://music.apple.com/us/artist/gunna/1236248981"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-19",
        "name": "Official Website",
        "url": "https://gunnamusic.com"
      },
      {
        "id": "sp-spot-19",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/2hlmm7s2ICUX0LVIhVFlZQ"
      },
      {
        "id": "sp-app-19",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/gunna/1236248981"
      },
      {
        "id": "sp-yt-19",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UCAkIMkEaa9sZmjcy7mfd5lQ"
      }
    ]
  },
  {
    "id": "20",
    "name": "Lil Durk",
    "slug": "lil-durk",
    "tagline": "The Voice — Chicago's emotional trap king",
    "bio": "Durk Derrick Banks, born October 19, 1992, in Chicago, Illinois. His 2022 album 7220 debuted at number one. He has had numerous collaborations with Drake, Lil Baby, and Morgan Wallen.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Lil_Durk_2022_%28cropped%29.jpg/440px-Lil_Durk_2022_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Lil_Durk_2022_%28cropped%29.jpg/440px-Lil_Durk_2022_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "Trap",
      "Drill"
    ],
    "country": "USA",
    "monthlyListeners": 28000000,
    "totalStreams": 5500000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "All My Life",
      "Laugh Now Cry Later",
      "Broadway Girls",
      "The Voice",
      "Foolish"
    ],
    "riaaCertifications": {
      "platinum": 8,
      "gold": 5,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/3hcs9uc56yIGFCSy9leWe7",
      "instagram": "https://instagram.com/lildurk",
      "twitter": "https://twitter.com/lildurk"
    },
    "streamingPlatforms": []
  },
  {
    "id": "21",
    "name": "Playboi Carti",
    "slug": "playboi-carti",
    "tagline": "Opium — Fashion rap's punk king",
    "bio": "Jordan Terrell Carter, born September 13, 1996, in Atlanta, Georgia. His third studio album Whole Lotta Red (2020) debuted at number one. Known for his vampiric aesthetic and baby voice rapping style.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Playboi_Carti_2021.jpg/440px-Playboi_Carti_2021.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Playboi_Carti_2021.jpg/440px-Playboi_Carti_2021.jpg",
    "genres": [
      "Hip-Hop",
      "Trap",
      "Cloud Rap"
    ],
    "country": "USA",
    "monthlyListeners": 22000000,
    "totalStreams": 4500000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "magnolia",
      "Shoota",
      "R.I.P.",
      "Broke Boi",
      "New Tank"
    ],
    "riaaCertifications": {
      "platinum": 5,
      "gold": 4,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/3uL4UpqU4MFNV7o5dTgl36",
      "instagram": "https://instagram.com/playboicarti",
      "twitter": "https://twitter.com/playboicarti"
    },
    "streamingPlatforms": []
  },
  {
    "id": "22",
    "name": "A$AP Rocky",
    "slug": "asap-rocky",
    "tagline": "Testing — Harlem's fashion rap philosopher",
    "bio": "Rakim Athelaston Mayers, born October 3, 1988, in Harlem, New York. His debut album Long.Live.A$AP (2013) debuted at number one. Known for his eclectic musical influences and high fashion sensibility.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/ASAP_Rocky_2012.jpg/440px-ASAP_Rocky_2012.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/ASAP_Rocky_2012.jpg/440px-ASAP_Rocky_2012.jpg",
    "genres": [
      "Hip-Hop",
      "Trap",
      "Cloud Rap"
    ],
    "country": "USA",
    "monthlyListeners": 22000000,
    "totalStreams": 4000000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Praise The Lord",
      "Fuckin Problems",
      "Fashion Killa",
      "Goldie",
      "Wild for the Night"
    ],
    "riaaCertifications": {
      "platinum": 6,
      "gold": 4,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/13ubrt8QOOCPljQ2FL1Kca",
      "instagram": "https://instagram.com/asaprocky",
      "twitter": "https://twitter.com/asvpxrocky"
    },
    "streamingPlatforms": []
  },
  {
    "id": "23",
    "name": "Lil Uzi Vert",
    "slug": "lil-uzi-vert",
    "tagline": "XO TOUR Llif3 — Philly's emo rap alien",
    "bio": "Symere Bysil Woods, born July 31, 1994, in Philadelphia, Pennsylvania. His debut album Luv Is Rage 2 (2017) debuted at number one. His 2020 album Eternal Atake broke multiple streaming records.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Lil_Uzi_Vert_2017_%28cropped%29.jpg/440px-Lil_Uzi_Vert_2017_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Lil_Uzi_Vert_2017_%28cropped%29.jpg/440px-Lil_Uzi_Vert_2017_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "Emo Rap",
      "Trap"
    ],
    "country": "USA",
    "monthlyListeners": 28000000,
    "totalStreams": 6000000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "XO TOUR Llif3",
      "Money Longer",
      "The Way Life Goes",
      "Futsal Shuffle 2020",
      "That Way"
    ],
    "riaaCertifications": {
      "platinum": 8,
      "gold": 5,
      "diamond": 1
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/4O15NlyKLIASxsJ0PrXPfg",
      "instagram": "https://instagram.com/liluzivert",
      "twitter": "https://twitter.com/LILUZIVERT"
    },
    "streamingPlatforms": []
  },
  {
    "id": "24",
    "name": "Tyler the Creator",
    "slug": "tyler-the-creator",
    "tagline": "IGOR — Odd Future's visionary auteur",
    "bio": "Tyler Gregory Okonma, born March 6, 1991, in Los Angeles, California, is a rapper, record producer, music video director, and fashion designer. He is the founder of Odd Future and Golf Wang. His Igor (2019) and Call Me If You Get Lost (2021) both debuted at number one.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Tyler_The_Creator_2019_%28cropped%29.jpg/440px-Tyler_The_Creator_2019_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Tyler_The_Creator_2019_%28cropped%29.jpg/440px-Tyler_The_Creator_2019_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "Alternative Rap",
      "Experimental Rap"
    ],
    "country": "USA",
    "monthlyListeners": 30000000,
    "totalStreams": 6000000000,
    "grammyWins": 1,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "EARFQUAKE",
      "See You Again",
      "Potato Salad",
      "GONE GONE",
      "NEW MAGIC WAND"
    ],
    "riaaCertifications": {
      "platinum": 5,
      "gold": 4,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/4V8LLVI7PbaPR0K2TGSxFF",
      "instagram": "https://instagram.com/feliciathegoat",
      "twitter": "https://twitter.com/tylerthecreator"
    },
    "streamingPlatforms": []
  },
  {
    "id": "25",
    "name": "Juice WRLD",
    "slug": "juice-wrld",
    "tagline": "999 — Emo rap's fallen icon",
    "bio": "Jarad Higgins, born December 2, 1998, in Chicago, Illinois. His debut album Goodbye & Good Riddance (2018) went quadruple platinum. He tragically passed away on December 8, 2019. Posthumous albums Legends Never Die and Fighting Demons have continued to chart worldwide.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Juice_WRLD_2019_%28cropped%29.jpg/440px-Juice_WRLD_2019_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Juice_WRLD_2019_%28cropped%29.jpg/440px-Juice_WRLD_2019_%28cropped%29.jpg",
    "genres": [
      "Emo Rap",
      "Trap",
      "Hip-Hop"
    ],
    "country": "USA",
    "monthlyListeners": 42000000,
    "totalStreams": 9000000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "ALUMNI",
    "topSongs": [
      "Lucid Dreams",
      "Legends",
      "Robbery",
      "Wishing Well",
      "All Girls Are the Same"
    ],
    "riaaCertifications": {
      "platinum": 14,
      "gold": 8,
      "diamond": 2
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/4MCBfE4596Uoi2O4DtmEMz",
      "instagram": "https://instagram.com/juicewrld999"
    },
    "streamingPlatforms": []
  },
  {
    "id": "26",
    "name": "NBA YoungBoy",
    "slug": "nba-youngboy",
    "tagline": "Never Broke Again — Baton Rouge's most prolific",
    "bio": "Kentrell DeSean Gaulden, born October 20, 1999, in Baton Rouge, Louisiana. He holds the record for most YouTube views for a solo rap artist with over 15 billion views. His emotional and raw style resonates with millions of fans worldwide.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/NBA_YoungBoy_2019.jpg/440px-NBA_YoungBoy_2019.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/NBA_YoungBoy_2019.jpg/440px-NBA_YoungBoy_2019.jpg",
    "genres": [
      "Hip-Hop",
      "Trap",
      "Southern Rap"
    ],
    "country": "USA",
    "monthlyListeners": 28000000,
    "totalStreams": 7000000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Outside Today",
      "Bandit",
      "Dirty Iyanna",
      "Valuable Pain",
      "No Smoke"
    ],
    "riaaCertifications": {
      "platinum": 9,
      "gold": 6,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/7wlFDEWiM5OoIAt8RSli8b",
      "instagram": "https://www.instagram.com/nba_youngboy",
      "youtube": "https://www.youtube.com/channel/UClW4jraMKz6Qj69lJf-tODA",
      "twitter": "https://twitter.com/ggyoungboy",
      "website": "https://youngboynba.com",
      "apple": "https://music.apple.com/us/artist/youngboy-never-broke-again/1126343561"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-26",
        "name": "Official Website",
        "url": "https://youngboynba.com"
      },
      {
        "id": "sp-spot-26",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/7wlFDEWiM5OoIAt8RSli8b"
      },
      {
        "id": "sp-app-26",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/youngboy-never-broke-again/1126343561"
      },
      {
        "id": "sp-yt-26",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UClW4jraMKz6Qj69lJf-tODA"
      }
    ]
  },
  {
    "id": "27",
    "name": "Rick Ross",
    "slug": "rick-ross",
    "tagline": "Bawse — Miami's biggest boss",
    "bio": "William Leonard Roberts II, born January 28, 1976, in Clarksdale, Mississippi and raised in Miami, Florida, founded Maybach Music Group. He discovered and signed artists including Meek Mill, Wale, and Gunplay.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Rick_Ross_2012.jpg/440px-Rick_Ross_2012.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Rick_Ross_2012.jpg/440px-Rick_Ross_2012.jpg",
    "genres": [
      "Hip-Hop",
      "Southern Rap"
    ],
    "country": "USA",
    "monthlyListeners": 12000000,
    "totalStreams": 3000000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "BMF",
      "Aston Martin Music",
      "Stay Schemin",
      "Port of Miami",
      "Hustlin"
    ],
    "riaaCertifications": {
      "platinum": 5,
      "gold": 4,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/1sBkRIssrMs1AbVkOJbc7a",
      "instagram": "https://www.instagram.com/richforever",
      "twitter": "https://twitter.com/RickRoss",
      "youtube": "https://www.youtube.com/channel/UCdLf5_x-4eic2Hw-uovjdKA",
      "website": "http://www.godforgivesidont.com/",
      "apple": "https://music.apple.com/us/artist/rick-ross/4022281"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-27",
        "name": "Official Website",
        "url": "http://www.godforgivesidont.com/"
      },
      {
        "id": "sp-spot-27",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/1sBkRIssrMs1AbVkOJbc7a"
      },
      {
        "id": "sp-app-27",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/rick-ross/4022281"
      },
      {
        "id": "sp-yt-27",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UCdLf5_x-4eic2Hw-uovjdKA"
      }
    ]
  },
  {
    "id": "28",
    "name": "Meek Mill",
    "slug": "meek-mill",
    "tagline": "The Philly Dream Chaser",
    "bio": "Robert Rihmeek Williams, born May 6, 1987, in Philadelphia, Pennsylvania. He became a symbol of criminal justice reform and co-founded REFORM Alliance alongside Jay-Z to change probation and parole laws.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Meek_Mill_2019_%28cropped%29.jpg/440px-Meek_Mill_2019_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Meek_Mill_2019_%28cropped%29.jpg/440px-Meek_Mill_2019_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "East Coast Rap"
    ],
    "country": "USA",
    "monthlyListeners": 10000000,
    "totalStreams": 2500000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Dreams and Nightmares",
      "All Eyes on You",
      "Taking Trips",
      "Millidelphia",
      "Going Bad"
    ],
    "riaaCertifications": {
      "platinum": 4,
      "gold": 3,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/20sxb77xiYeusSH8cVdatc",
      "instagram": "https://instagram.com/meekmill",
      "twitter": "https://twitter.com/MeekMill"
    },
    "streamingPlatforms": []
  },
  {
    "id": "29",
    "name": "Jay-Z",
    "slug": "jay-z",
    "tagline": "HOV — Brooklyn's business mogul rapper",
    "bio": "Shawn Corey Carter, born December 4, 1969, in Brooklyn, New York, is one of the greatest rappers of all time. He co-founded Roc-A-Fella Records and Roc Nation. He has 24 Grammy Awards and in 2021 became hip-hop's first billionaire.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Jay-Z_at_the_2009_Tribeca_Film_Festival.jpg/440px-Jay-Z_at_the_2009_Tribeca_Film_Festival.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Jay-Z_at_the_2009_Tribeca_Film_Festival.jpg/440px-Jay-Z_at_the_2009_Tribeca_Film_Festival.jpg",
    "genres": [
      "Hip-Hop",
      "East Coast Rap"
    ],
    "country": "USA",
    "monthlyListeners": 18000000,
    "totalStreams": 5000000000,
    "grammyWins": 24,
    "isVerified": true,
    "isFeatured": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Empire State of Mind",
      "99 Problems",
      "Big Pimpin",
      "Run This Town",
      "OTIS"
    ],
    "riaaCertifications": {
      "platinum": 25,
      "gold": 15,
      "diamond": 3
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/3nFkdlSjzX9mRTtwJOzDYB",
      "youtube": "https://www.youtube.com/channel/UC_Bf08Y-3m6CMAvTms3EkKg",
      "twitter": "https://twitter.com/sc",
      "website": "https://rocnation.com",
      "apple": "https://music.apple.com/us/artist/jay-z/1352449404"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-29",
        "name": "Official Website",
        "url": "https://rocnation.com"
      },
      {
        "id": "sp-spot-29",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/3nFkdlSjzX9mRTtwJOzDYB"
      },
      {
        "id": "sp-app-29",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/jay-z/1352449404"
      },
      {
        "id": "sp-yt-29",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UC_Bf08Y-3m6CMAvTms3EkKg"
      }
    ]
  },
  {
    "id": "30",
    "name": "Snoop Dogg",
    "slug": "snoop-dogg",
    "tagline": "Tha Doggfather — West Coast legend",
    "bio": "Calvin Cordozar Broadus Jr., born October 20, 1971, in Long Beach, California. His debut Doggystyle (1993) sold over 4 million copies in its first year. He was the Paris 2024 Olympic Games special correspondent for NBC.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Snoop_Dogg_2019_%28cropped%29.jpg/440px-Snoop_Dogg_2019_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Snoop_Dogg_2019_%28cropped%29.jpg/440px-Snoop_Dogg_2019_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "G-Funk",
      "West Coast Rap"
    ],
    "country": "USA",
    "monthlyListeners": 20000000,
    "totalStreams": 4000000000,
    "grammyWins": 0,
    "isVerified": true,
    "isFeatured": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Drop It Like Its Hot",
      "Young Wild Free",
      "Beautiful",
      "Signs",
      "Gin and Juice"
    ],
    "riaaCertifications": {
      "platinum": 15,
      "gold": 10,
      "diamond": 2
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/7hJcb9fa4alzcOq3EaNPoG",
      "instagram": "https://instagram.com/snoopdogg",
      "twitter": "https://twitter.com/SnoopDogg"
    },
    "streamingPlatforms": []
  },
  {
    "id": "31",
    "name": "50 Cent",
    "slug": "50-cent",
    "tagline": "G-Unit — Queens' bulletproof hustler",
    "bio": "Curtis James Jackson III, born July 6, 1975, in South Jamaica, Queens, New York. His debut Get Rich or Die Tryin (2003) sold 872,000 copies in its first day. He built a business empire including Vitamin Water and G-Unit Films.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/50_Cent_2012_Shankbone.jpg/440px-50_Cent_2012_Shankbone.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/50_Cent_2012_Shankbone.jpg/440px-50_Cent_2012_Shankbone.jpg",
    "genres": [
      "Hip-Hop",
      "East Coast Rap",
      "Gangsta Rap"
    ],
    "country": "USA",
    "monthlyListeners": 15000000,
    "totalStreams": 3500000000,
    "grammyWins": 1,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "In Da Club",
      "21 Questions",
      "Candy Shop",
      "PIMP",
      "Many Men"
    ],
    "riaaCertifications": {
      "platinum": 18,
      "gold": 10,
      "diamond": 2
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/3q7HBObVc0L8jNeTe5Gofh",
      "instagram": "https://www.instagram.com/50cent",
      "twitter": "https://twitter.com/50cent",
      "youtube": "https://www.youtube.com/channel/UC8zJedg1f4sKnyuHWeS6vyw",
      "website": "https://50cent.com",
      "apple": "https://music.apple.com/us/artist/50-cent/4226"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-31",
        "name": "Official Website",
        "url": "https://50cent.com"
      },
      {
        "id": "sp-spot-31",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/3q7HBObVc0L8jNeTe5Gofh"
      },
      {
        "id": "sp-app-31",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/50-cent/4226"
      },
      {
        "id": "sp-yt-31",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UC8zJedg1f4sKnyuHWeS6vyw"
      }
    ]
  },
  {
    "id": "32",
    "name": "Nas",
    "slug": "nas",
    "tagline": "Illmatic — Queens greatest storyteller",
    "bio": "Nasir Bin Olu Dara Jones, born September 14, 1973, raised in Queens, New York. His debut album Illmatic (1994) is frequently cited as the greatest rap album ever made. In 2021 he won his first Grammy Award for Best Rap Album for Kings Disease.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Nas_2012.jpg/440px-Nas_2012.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Nas_2012.jpg/440px-Nas_2012.jpg",
    "genres": [
      "Hip-Hop",
      "East Coast Rap",
      "Golden Age Hip-Hop"
    ],
    "country": "USA",
    "monthlyListeners": 12000000,
    "totalStreams": 2500000000,
    "grammyWins": 1,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "NY State of Mind",
      "If I Ruled the World",
      "One Love",
      "Hate Me Now",
      "Made You Look"
    ],
    "riaaCertifications": {
      "platinum": 8,
      "gold": 6,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/20qISvAhX20dpIbOOzGK3q",
      "instagram": "https://instagram.com/nas",
      "twitter": "https://twitter.com/Nas"
    },
    "streamingPlatforms": []
  },
  {
    "id": "33",
    "name": "Wiz Khalifa",
    "slug": "wiz-khalifa",
    "tagline": "Taylor Gang — Pittsburgh rolling paper king",
    "bio": "Cameron Jibril Thomaz, born September 8, 1987, raised in Pittsburgh, Pennsylvania. His collaboration with Charlie Puth, See You Again (2015), became an anthem for the Fast and Furious franchise and was among the most-streamed songs in history.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Wiz_Khalifa_2016.jpg/440px-Wiz_Khalifa_2016.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Wiz_Khalifa_2016.jpg/440px-Wiz_Khalifa_2016.jpg",
    "genres": [
      "Hip-Hop",
      "Pop Rap"
    ],
    "country": "USA",
    "monthlyListeners": 30000000,
    "totalStreams": 7000000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "See You Again",
      "Black and Yellow",
      "Work Hard Play Hard",
      "We Dem Boyz",
      "Roll Up"
    ],
    "riaaCertifications": {
      "platinum": 12,
      "gold": 8,
      "diamond": 2
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/137W8MRPWKqSmrBGDBFSop",
      "instagram": "https://www.instagram.com/wizkhalifa",
      "twitter": "https://twitter.com/wizkhalifa",
      "youtube": "https://www.youtube.com/channel/UCVp3nfGRxmMadNDuVbJSk8A",
      "website": "https://wizkhalifa.com",
      "apple": "https://music.apple.com/us/artist/wiz-khalifa/201714418"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-33",
        "name": "Official Website",
        "url": "https://wizkhalifa.com"
      },
      {
        "id": "sp-spot-33",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/137W8MRPWKqSmrBGDBFSop"
      },
      {
        "id": "sp-app-33",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/wiz-khalifa/201714418"
      },
      {
        "id": "sp-yt-33",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UCVp3nfGRxmMadNDuVbJSk8A"
      }
    ]
  },
  {
    "id": "34",
    "name": "Chance the Rapper",
    "slug": "chance-the-rapper",
    "tagline": "Coloring Book — Chicago independent gospel rapper",
    "bio": "Chancelor Johnathan Bennett, born April 16, 1993, in Chicago, Illinois. He became the first artist to win a Grammy Award for a streaming-only release with Coloring Book (2016). He has donated millions to the Chicago Public Schools.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Chance_the_Rapper_2019_%28cropped%29.jpg/440px-Chance_the_Rapper_2019_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Chance_the_Rapper_2019_%28cropped%29.jpg/440px-Chance_the_Rapper_2019_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "Gospel Rap",
      "Alternative Rap"
    ],
    "country": "USA",
    "monthlyListeners": 10000000,
    "totalStreams": 2000000000,
    "grammyWins": 3,
    "isVerified": true,
    "labelStatus": "OPEN",
    "topSongs": [
      "No Problem",
      "Blessings",
      "Summer Friends",
      "Same Drugs",
      "All We Got"
    ],
    "riaaCertifications": {
      "platinum": 4,
      "gold": 3,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/1anyVhU62p31KFi8MEzkbf",
      "instagram": "https://instagram.com/chancetherapper",
      "twitter": "https://twitter.com/chancetherapper"
    },
    "streamingPlatforms": []
  },
  {
    "id": "35",
    "name": "Central Cee",
    "slug": "central-cee",
    "tagline": "West London export to the world",
    "bio": "Oakley Caesar-Su, born June 4, 2001, in Shepherd's Bush, London. His 2021 debut mixtape Wild West was a critical and commercial smash. He has collaborated with Drake and Lil Baby, expanding his reach to the American market.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Central_Cee_2023.jpg/440px-Central_Cee_2023.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Central_Cee_2023.jpg/440px-Central_Cee_2023.jpg",
    "genres": [
      "Hip-Hop",
      "Drill"
    ],
    "country": "UK",
    "monthlyListeners": 22000000,
    "totalStreams": 4000000000,
    "grammyWins": 0,
    "isVerified": true,
    "isFeatured": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Doja",
      "Loading",
      "Let Go",
      "Obsessed With You",
      "Sprinter"
    ],
    "riaaCertifications": {
      "platinum": 3,
      "gold": 2,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/5H4yInM5zmHqpKIoMNAx4r",
      "instagram": "https://www.instagram.com/centralcee",
      "twitter": "https://twitter.com/centralcee",
      "youtube": "https://www.youtube.com/channel/UCV_CsAy5CNBX_uwDQ7RMe1Q",
      "website": "https://centralcee.com/",
      "apple": "https://music.apple.com/us/artist/central-cee/1085149646"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-35",
        "name": "Official Website",
        "url": "https://centralcee.com/"
      },
      {
        "id": "sp-spot-35",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/5H4yInM5zmHqpKIoMNAx4r"
      },
      {
        "id": "sp-app-35",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/central-cee/1085149646"
      },
      {
        "id": "sp-yt-35",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UCV_CsAy5CNBX_uwDQ7RMe1Q"
      }
    ]
  },
  {
    "id": "36",
    "name": "Pop Smoke",
    "slug": "pop-smoke",
    "tagline": "Shoot for the Stars — Brooklyn Drill pioneer",
    "bio": "Bashar Barakah Jackson, born July 20, 1999, in Brooklyn, New York, pioneered the Brooklyn drill music scene. His posthumous debut album Shoot for the Stars, Aim for the Moon (2020) debuted at number one and produced multiple hits including the diamond-certified For the Night.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Pop_Smoke_2019.jpg/440px-Pop_Smoke_2019.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Pop_Smoke_2019.jpg/440px-Pop_Smoke_2019.jpg",
    "genres": [
      "Hip-Hop",
      "Drill",
      "Trap"
    ],
    "country": "USA",
    "monthlyListeners": 32000000,
    "totalStreams": 7000000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "ALUMNI",
    "topSongs": [
      "Welcome to the Party",
      "For the Night",
      "What You Know Bout Love",
      "Mood Swings",
      "Dior"
    ],
    "riaaCertifications": {
      "platinum": 10,
      "gold": 6,
      "diamond": 1
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/0eDvMgVFoNV3TpwtrVCoTj",
      "instagram": "https://instagram.com/realpopsmoke"
    },
    "streamingPlatforms": []
  },
  {
    "id": "37",
    "name": "Lil Nas X",
    "slug": "lil-nas-x",
    "tagline": "Montero — Country rap genre-shattering star",
    "bio": "Montero Lamar Hill, born April 9, 1999, in Lithia Springs, Georgia. His Old Town Road (2019) became the longest-running number one single in Billboard Hot 100 history, spending 19 weeks at the top.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Lil_Nas_X_2021_%28cropped%29.jpg/440px-Lil_Nas_X_2021_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Lil_Nas_X_2021_%28cropped%29.jpg/440px-Lil_Nas_X_2021_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "Pop Rap",
      "Country Rap"
    ],
    "country": "USA",
    "monthlyListeners": 38000000,
    "totalStreams": 8000000000,
    "grammyWins": 2,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Old Town Road",
      "MONTERO",
      "INDUSTRY BABY",
      "Panini",
      "Thats What I Want"
    ],
    "riaaCertifications": {
      "platinum": 15,
      "gold": 8,
      "diamond": 3
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/7jVv8c5Fj3E9VhNjxT4snq",
      "instagram": "https://www.instagram.com/lilnasx",
      "twitter": "https://twitter.com/LilNasX",
      "youtube": "https://www.youtube.com/channel/UC_uMv3bNXwapHl8Dzf2p01Q",
      "website": "https://www.lilnasx.com/",
      "apple": "https://music.apple.com/us/artist/lil-nas-x/1400730578"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-37",
        "name": "Official Website",
        "url": "https://www.lilnasx.com/"
      },
      {
        "id": "sp-spot-37",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/7jVv8c5Fj3E9VhNjxT4snq"
      },
      {
        "id": "sp-app-37",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/lil-nas-x/1400730578"
      },
      {
        "id": "sp-yt-37",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UC_uMv3bNXwapHl8Dzf2p01Q"
      }
    ]
  },
  {
    "id": "38",
    "name": "Jack Harlow",
    "slug": "jack-harlow",
    "tagline": "Louisville charming crossover rapper",
    "bio": "Jackman Thomas Harlow, born March 13, 1998, in Louisville, Kentucky. His single What's Poppin (2020) reached number two on the Billboard Hot 100. His album Come Home the Kids Miss You (2022) debuted at number three.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Jack_Harlow_2022.jpg/440px-Jack_Harlow_2022.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Jack_Harlow_2022.jpg/440px-Jack_Harlow_2022.jpg",
    "genres": [
      "Hip-Hop",
      "Pop Rap"
    ],
    "country": "USA",
    "monthlyListeners": 20000000,
    "totalStreams": 4000000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "What's Poppin",
      "INDUSTRY BABY",
      "First Class",
      "Nail Tech",
      "Dua Lipa"
    ],
    "riaaCertifications": {
      "platinum": 8,
      "gold": 5,
      "diamond": 1
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/2LIk90788K0zvyj2JJVwkJ",
      "instagram": "https://instagram.com/jackharlow",
      "twitter": "https://twitter.com/jackharlow"
    },
    "streamingPlatforms": []
  },
  {
    "id": "39",
    "name": "Doja Cat",
    "slug": "doja-cat",
    "tagline": "Planet Her — LA's internet queen",
    "bio": "Amala Ratna Zandile Dlamini, born October 21, 1995, in Los Angeles, California. Her Say So (remix with Nicki Minaj) reached number one. She swept the 2024 Grammy Awards winning three awards.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Doja_Cat_2022_%28cropped%29.jpg/440px-Doja_Cat_2022_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Doja_Cat_2022_%28cropped%29.jpg/440px-Doja_Cat_2022_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "Pop Rap",
      "R&B"
    ],
    "country": "USA",
    "monthlyListeners": 55000000,
    "totalStreams": 10000000000,
    "grammyWins": 3,
    "isVerified": true,
    "isFeatured": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Say So",
      "Kiss Me More",
      "Need to Know",
      "Planet Her",
      "Paint The Town Red"
    ],
    "riaaCertifications": {
      "platinum": 12,
      "gold": 8,
      "diamond": 1
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/5cj0lLjcoR7YOSnhnX0Po5",
      "instagram": "https://instagram.com/dojacat",
      "twitter": "https://twitter.com/DojaCat"
    },
    "streamingPlatforms": []
  },
  {
    "id": "40",
    "name": "Moneybagg Yo",
    "slug": "moneybagg-yo",
    "tagline": "CMG — Memphis grind made global",
    "bio": "Demario DeWayne White Jr., born September 22, 1991, in Memphis, Tennessee. His 2021 album A Gangsta's Pain debuted at number one on the Billboard 200, staying there for multiple weeks.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Moneybagg_Yo_2022.jpg/440px-Moneybagg_Yo_2022.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Moneybagg_Yo_2022.jpg/440px-Moneybagg_Yo_2022.jpg",
    "genres": [
      "Hip-Hop",
      "Trap",
      "Southern Rap"
    ],
    "country": "USA",
    "monthlyListeners": 15000000,
    "totalStreams": 3000000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Wockesha",
      "Said Sum",
      "Time Today",
      "Shottas",
      "Hard For The Next"
    ],
    "riaaCertifications": {
      "platinum": 5,
      "gold": 4,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/3tJoFztHeIJkJWMrx0td2f",
      "instagram": "https://www.instagram.com/moneybaggyo",
      "twitter": "https://twitter.com/moneybaggyo",
      "youtube": "https://www.youtube.com/channel/UCrdPrDuDCbG8xayk5QkRLQA",
      "website": "https://moneybaggyo.com",
      "apple": "https://music.apple.com/us/artist/moneybagg-yo/1124119852"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-40",
        "name": "Official Website",
        "url": "https://moneybaggyo.com"
      },
      {
        "id": "sp-spot-40",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/3tJoFztHeIJkJWMrx0td2f"
      },
      {
        "id": "sp-app-40",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/moneybagg-yo/1124119852"
      },
      {
        "id": "sp-yt-40",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UCrdPrDuDCbG8xayk5QkRLQA"
      }
    ]
  },
  {
    "id": "41",
    "name": "Latto",
    "slug": "latto",
    "tagline": "777 — Atlanta's Big Latto",
    "bio": "Alyssa Michelle Stephens, born December 22, 1998, raised in Atlanta, Georgia. Her 2022 single Big Energy became her biggest hit, sampling Mariah Carey's Fantasy and reaching number three on the Hot 100.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Latto_2022_%28cropped%29.jpg/440px-Latto_2022_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Latto_2022_%28cropped%29.jpg/440px-Latto_2022_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "Trap"
    ],
    "country": "USA",
    "monthlyListeners": 12000000,
    "totalStreams": 2500000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Big Energy",
      "Bitch from da Souf",
      "Pussy",
      "Wheelie",
      "Sunday Service"
    ],
    "riaaCertifications": {
      "platinum": 4,
      "gold": 3,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/3MdXrJWsbVzdn6fe5JYkSQ",
      "instagram": "https://www.instagram.com/latto777",
      "twitter": "https://twitter.com/Latto",
      "youtube": "https://www.youtube.com/channel/UCRQ6wJbGwbF9Wmvp5HfT7Pg",
      "website": "https://www.biglatto.com",
      "apple": "https://music.apple.com/us/artist/latto/1131758652"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-41",
        "name": "Official Website",
        "url": "https://www.biglatto.com"
      },
      {
        "id": "sp-spot-41",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/3MdXrJWsbVzdn6fe5JYkSQ"
      },
      {
        "id": "sp-app-41",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/latto/1131758652"
      },
      {
        "id": "sp-yt-41",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UCRQ6wJbGwbF9Wmvp5HfT7Pg"
      }
    ]
  },
  {
    "id": "42",
    "name": "Pusha T",
    "slug": "pusha-t",
    "tagline": "King Push — Cocaine rap's undisputed king",
    "bio": "Terrence LeVarr Thornton, born May 13, 1977, in the Bronx and raised in Virginia Beach, Virginia. His album It's Almost Dry (2022) debuted at number one. He is the president of G.O.O.D. Music.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Pusha_T_2019.jpg/440px-Pusha_T_2019.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Pusha_T_2019.jpg/440px-Pusha_T_2019.jpg",
    "genres": [
      "Hip-Hop",
      "East Coast Rap",
      "Hardcore Rap"
    ],
    "country": "USA",
    "monthlyListeners": 8000000,
    "totalStreams": 1500000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Infrared",
      "SANTERIA",
      "Dreamin of the Past",
      "Diet Coke",
      "If You Know You Know"
    ],
    "riaaCertifications": {
      "platinum": 2,
      "gold": 2,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/0ONHkAv9pCAFxb0zJwDNTy",
      "instagram": "https://www.instagram.com/kingpush",
      "twitter": "https://twitter.com/PUSHA_T",
      "youtube": "https://www.youtube.com/channel/UCoA_cEhtRi07_12Ib_k3yuw",
      "website": "https://kingpush.com",
      "apple": "https://music.apple.com/us/artist/pusha-t/428236170"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-42",
        "name": "Official Website",
        "url": "https://kingpush.com"
      },
      {
        "id": "sp-spot-42",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/0ONHkAv9pCAFxb0zJwDNTy"
      },
      {
        "id": "sp-app-42",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/pusha-t/428236170"
      },
      {
        "id": "sp-yt-42",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UCoA_cEhtRi07_12Ib_k3yuw"
      }
    ]
  },
  {
    "id": "43",
    "name": "Chief Keef",
    "slug": "chief-keef",
    "tagline": "Bang Bang — Chicago drill's founding father",
    "bio": "Keith Farrelle Cozart, born August 15, 1995, in Chicago, Illinois, is widely credited as the founder of Chicago drill music. His 2012 debut single I Don't Like went viral and launched a new era in hip-hop. He inspired Future, Young Thug, and Kanye West.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Chief_Keef_2014_%28cropped%29.jpg/440px-Chief_Keef_2014_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Chief_Keef_2014_%28cropped%29.jpg/440px-Chief_Keef_2014_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "Drill",
      "Trap"
    ],
    "country": "USA",
    "monthlyListeners": 8000000,
    "totalStreams": 1500000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "OPEN",
    "topSongs": [
      "I Don't Like",
      "Love Sosa",
      "Faneto",
      "Hate Bein Sober",
      "Bang"
    ],
    "riaaCertifications": {
      "platinum": 3,
      "gold": 2,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/15iVAtD3s3FsQR4w1v6M0P",
      "instagram": "https://www.instagram.com/chieffkeeffsossa",
      "twitter": "https://twitter.com/ChiefKeef",
      "youtube": "https://www.youtube.com/channel/UCrCRtpW2BMBCeqoivRV2pWw",
      "apple": "https://music.apple.com/us/artist/chief-keef/516663045"
    },
    "streamingPlatforms": [
      {
        "id": "sp-spot-43",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/15iVAtD3s3FsQR4w1v6M0P"
      },
      {
        "id": "sp-app-43",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/chief-keef/516663045"
      },
      {
        "id": "sp-yt-43",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UCrCRtpW2BMBCeqoivRV2pWw"
      }
    ]
  },
  {
    "id": "44",
    "name": "GloRilla",
    "slug": "glorilla",
    "tagline": "Big Glo — Memphis breakout female force",
    "bio": "Gloria Hallelujah Woods, born July 28, 1999, in Memphis, Tennessee. Her viral hit F.N.F. (Let's Go) was co-signed by Cardi B and earned a Grammy nomination for Best Melodic Rap Performance. She signed to Yo Gotti's CMG label.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/GloRilla_2022.jpg/440px-GloRilla_2022.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/GloRilla_2022.jpg/440px-GloRilla_2022.jpg",
    "genres": [
      "Hip-Hop",
      "Trap",
      "Southern Rap"
    ],
    "country": "USA",
    "monthlyListeners": 14000000,
    "totalStreams": 2500000000,
    "grammyWins": 0,
    "isVerified": true,
    "isFeatured": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "FNF Let's Go",
      "Tomorrow 2",
      "TGIF",
      "Blessed",
      "On Da Come Up"
    ],
    "riaaCertifications": {
      "platinum": 3,
      "gold": 2,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/2qoQgPAilErOKCwE2Y8wOG",
      "instagram": "https://www.instagram.com/glorillapimp",
      "twitter": "https://twitter.com/GloTheofficial",
      "youtube": "https://www.youtube.com/channel/UC9bZ9eWvF0eXVqrxK9ve7Nw",
      "website": "https://www.glorillaofficial.com/",
      "apple": "https://music.apple.com/us/artist/glorilla/1441017729"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-44",
        "name": "Official Website",
        "url": "https://www.glorillaofficial.com/"
      },
      {
        "id": "sp-spot-44",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/2qoQgPAilErOKCwE2Y8wOG"
      },
      {
        "id": "sp-app-44",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/glorilla/1441017729"
      },
      {
        "id": "sp-yt-44",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UC9bZ9eWvF0eXVqrxK9ve7Nw"
      }
    ]
  },
  {
    "id": "45",
    "name": "Ice Spice",
    "slug": "ice-spice",
    "tagline": "Munch — Bronx Drill princess",
    "bio": "Isis Naija Gaston, born January 1, 2000, in the Bronx, New York. She became a viral sensation in 2022 with Munch (Feelin' U). She has collaborated with Taylor Swift (Karma remix) and Nicki Minaj (Princess Diana remix).",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Ice_Spice_2023_%28cropped%29.jpg/440px-Ice_Spice_2023_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Ice_Spice_2023_%28cropped%29.jpg/440px-Ice_Spice_2023_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "Drill",
      "Trap"
    ],
    "country": "USA",
    "monthlyListeners": 20000000,
    "totalStreams": 3500000000,
    "grammyWins": 0,
    "isVerified": true,
    "isFeatured": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Munch Feelin U",
      "Princess Diana",
      "In Ha Mood",
      "Karma",
      "Boy's a liar Pt. 2"
    ],
    "riaaCertifications": {
      "platinum": 4,
      "gold": 3,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/3LZZPxNDGDFVSIPqf4JuEf",
      "instagram": "https://www.instagram.com/icespice",
      "twitter": "https://twitter.com/icespicee_",
      "youtube": "https://www.youtube.com/channel/UCJTqwQj5iTHYrko04PbGI9w",
      "apple": "https://music.apple.com/us/artist/ice-spice/1552372505",
      "website": "https://icespicemusic.com/"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-45",
        "name": "Official Website",
        "url": "https://icespicemusic.com/"
      },
      {
        "id": "sp-spot-45",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/3LZZPxNDGDFVSIPqf4JuEf"
      },
      {
        "id": "sp-app-45",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/ice-spice/1552372505"
      },
      {
        "id": "sp-yt-45",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UCJTqwQj5iTHYrko04PbGI9w"
      }
    ]
  },
  {
    "id": "46",
    "name": "Don Toliver",
    "slug": "don-toliver",
    "tagline": "Heaven or Hell — Houston's psychedelic crooner",
    "bio": "Caleb Zackery Toliver, born June 12, 1994, in Houston, Texas. His debut album Heaven or Hell (2020) debuted in the top five. He is one of the most popular artists within Travis Scott's Cactus Jack roster.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Don_Toliver_2021.jpg/440px-Don_Toliver_2021.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Don_Toliver_2021.jpg/440px-Don_Toliver_2021.jpg",
    "genres": [
      "Hip-Hop",
      "Trap",
      "R&B"
    ],
    "country": "USA",
    "monthlyListeners": 18000000,
    "totalStreams": 3500000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "No Idea",
      "After Party",
      "Drugs N Hella Melodies",
      "Way Big",
      "Beautiful Mistake"
    ],
    "riaaCertifications": {
      "platinum": 4,
      "gold": 3,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/4Gso3d4CscCijv0lmajZWs",
      "instagram": "https://instagram.com/dontoliver",
      "twitter": "https://twitter.com/dontoliver"
    },
    "streamingPlatforms": []
  },
  {
    "id": "47",
    "name": "Metro Boomin",
    "slug": "metro-boomin",
    "tagline": "Super Producer — Atlanta's darkest beatmaker",
    "bio": "Leland Tyler Wayne, born October 16, 1993, in St. Louis, Missouri and raised in Atlanta, Georgia, is one of the most in-demand producers in hip-hop. His collaborative album with Future We Don't Trust You (2024) debuted at number one. He won Grammy Awards for his production work.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Metro_Boomin_2019.jpg/440px-Metro_Boomin_2019.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Metro_Boomin_2019.jpg/440px-Metro_Boomin_2019.jpg",
    "genres": [
      "Hip-Hop",
      "Trap"
    ],
    "country": "USA",
    "monthlyListeners": 25000000,
    "totalStreams": 6000000000,
    "grammyWins": 1,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Superhero",
      "Too Many Nights",
      "Creepin",
      "All The Money",
      "Overdue"
    ],
    "riaaCertifications": {
      "platinum": 10,
      "gold": 7,
      "diamond": 1
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/0iEtIxbK0KxaSlF7G42ZOp",
      "instagram": "https://instagram.com/metroboomin",
      "twitter": "https://twitter.com/MetroBoomin"
    },
    "streamingPlatforms": []
  },
  {
    "id": "48",
    "name": "Fivio Foreign",
    "slug": "fivio-foreign",
    "tagline": "800 BC — Brooklyn Drill ambassador",
    "bio": "Maxie Lee Ryles III, born March 29, 1990, in Flatbush, Brooklyn, New York. His debut album B.I.B.L.E. (2022) featured collaborations with Kanye West, Alicia Keys, and Lil Baby, debuting at number two on the Billboard 200.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Fivio_Foreign_2022.jpg/440px-Fivio_Foreign_2022.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Fivio_Foreign_2022.jpg/440px-Fivio_Foreign_2022.jpg",
    "genres": [
      "Hip-Hop",
      "Drill"
    ],
    "country": "USA",
    "monthlyListeners": 10000000,
    "totalStreams": 2000000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Wetty",
      "Big Drip",
      "Say My Grace",
      "City of Gods",
      "Magic City"
    ],
    "riaaCertifications": {
      "platinum": 3,
      "gold": 2,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/27SWmSxj1aVEFWfQOlxg6G",
      "instagram": "https://instagram.com/fivioforeign",
      "twitter": "https://twitter.com/FivioForeign"
    },
    "streamingPlatforms": []
  },
  {
    "id": "49",
    "name": "Gucci Mane",
    "slug": "gucci-mane",
    "tagline": "La Flare — East Atlanta's prolific trap king",
    "bio": "Radric Delantic Davis, born February 12, 1980, in Bessemer, Alabama and raised in Atlanta, Georgia, is one of the founding fathers of trap music. He mentored Young Jeezy, Waka Flocka Flame, and Migos.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Gucci_Mane_2019_%28cropped%29.jpg/440px-Gucci_Mane_2019_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Gucci_Mane_2019_%28cropped%29.jpg/440px-Gucci_Mane_2019_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "Trap",
      "Southern Rap"
    ],
    "country": "USA",
    "monthlyListeners": 8000000,
    "totalStreams": 2000000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "I Get The Bag",
      "Both",
      "Wake Up in the Sky",
      "Lemonade",
      "Bling Blaww Burr"
    ],
    "riaaCertifications": {
      "platinum": 6,
      "gold": 4,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/3s5TOK6lBKCcqLKMvHBrE0",
      "instagram": "https://instagram.com/laflare1017",
      "twitter": "https://twitter.com/gucci1017"
    },
    "streamingPlatforms": []
  },
  {
    "id": "50",
    "name": "Kid Cudi",
    "slug": "kid-cudi",
    "tagline": "Man on the Moon — Cleveland's cosmic dreamer",
    "bio": "Scott Ramon Seguro Mescudi, born January 30, 1984, in Cleveland, Ohio. His debut Man on the Moon: The End of Day (2009) revolutionized rap by introducing themes of depression and existentialism. He inspired Drake, Kanye West, and Travis Scott.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Kid_Cudi_2022_%28cropped%29.jpg/440px-Kid_Cudi_2022_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Kid_Cudi_2022_%28cropped%29.jpg/440px-Kid_Cudi_2022_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "Alternative Rap",
      "Psychedelic Rap"
    ],
    "country": "USA",
    "monthlyListeners": 15000000,
    "totalStreams": 3500000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Pursuit of Happiness",
      "Motions and Feelings",
      "Sad People",
      "Memories",
      "Erase Me"
    ],
    "riaaCertifications": {
      "platinum": 5,
      "gold": 4,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/0fA0VVWsXO9YnASrzqfmYu",
      "instagram": "https://www.instagram.com/kidcudi",
      "twitter": "https://twitter.com/KidCudi",
      "youtube": "https://www.youtube.com/channel/UCoNPsL8j28yfKRu6e7YUhPA",
      "website": "https://www.kidcudi.com",
      "apple": "https://music.apple.com/us/artist/kid-cudi/283623549"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-50",
        "name": "Official Website",
        "url": "https://www.kidcudi.com"
      },
      {
        "id": "sp-spot-50",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/0fA0VVWsXO9YnASrzqfmYu"
      },
      {
        "id": "sp-app-50",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/kid-cudi/283623549"
      },
      {
        "id": "sp-yt-50",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UCoNPsL8j28yfKRu6e7YUhPA"
      }
    ]
  },
  {
    "id": "51",
    "name": "XXXTentacion",
    "slug": "xxxtentacion",
    "tagline": "17 — South Florida tortured artistic genius",
    "bio": "Jahseh Dwayne Ricardo Onfroy, born January 23, 1998, in Plantation, Florida. His second album ? (2018) reached number one, featuring the diamond-certified Sad! He was tragically shot and killed on June 18, 2018.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/XXXTENTACION_2017_%28cropped%29.jpg/440px-XXXTENTACION_2017_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/XXXTENTACION_2017_%28cropped%29.jpg/440px-XXXTENTACION_2017_%28cropped%29.jpg",
    "genres": [
      "Emo Rap",
      "Hip-Hop",
      "Alternative Rap"
    ],
    "country": "USA",
    "monthlyListeners": 35000000,
    "totalStreams": 8000000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "ALUMNI",
    "topSongs": [
      "SAD!",
      "Lucid Dreams",
      "Moonlight",
      "Jocelyn Flores",
      "changes"
    ],
    "riaaCertifications": {
      "platinum": 12,
      "gold": 7,
      "diamond": 2
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/15UsOTVnJzReFVN1VCnxy4",
      "instagram": "https://instagram.com/xxxtentacion"
    },
    "streamingPlatforms": []
  },
  {
    "id": "52",
    "name": "Mac Miller",
    "slug": "mac-miller",
    "tagline": "Swimming — Pittsburgh's soulful rapper",
    "bio": "Malcolm James McCormick, born January 19, 1992, in Pittsburgh, Pennsylvania. His debut Blue Slide Park (2011) debuted at number one independently. His posthumous album Circles (2020) was Grammy-nominated. He tragically passed away on September 7, 2018.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Mac_Miller_2016_%28cropped%29.jpg/440px-Mac_Miller_2016_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Mac_Miller_2016_%28cropped%29.jpg/440px-Mac_Miller_2016_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "Alternative Rap",
      "Neo-Soul"
    ],
    "country": "USA",
    "monthlyListeners": 20000000,
    "totalStreams": 4500000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "ALUMNI",
    "topSongs": [
      "Self Care",
      "Circles",
      "Come Back to Earth",
      "Diablo",
      "Small Worlds"
    ],
    "riaaCertifications": {
      "platinum": 5,
      "gold": 4,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/4LLpKhyESsyAXpc4laK94U",
      "instagram": "https://instagram.com/macmiller"
    },
    "streamingPlatforms": []
  },
  {
    "id": "53",
    "name": "Nipsey Hussle",
    "slug": "nipsey-hussle",
    "tagline": "The Marathon Continues — Crenshaw's eternal king",
    "bio": "Ermias Joseph Asghedom, born August 15, 1985, in Los Angeles, California. His debut album Victory Lap (2018) was nominated for the Grammy for Best Rap Album. Beyond music he invested heavily in his community in South LA. He was tragically shot on March 31, 2019.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Nipsey_Hussle_at_the_2018_GQ_Men_of_the_Year_party_%28cropped%29.jpg/440px-Nipsey_Hussle_at_the_2018_GQ_Men_of_the_Year_party_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Nipsey_Hussle_at_the_2018_GQ_Men_of_the_Year_party_%28cropped%29.jpg/440px-Nipsey_Hussle_at_the_2018_GQ_Men_of_the_Year_party_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "West Coast Rap",
      "Conscious Rap"
    ],
    "country": "USA",
    "monthlyListeners": 12000000,
    "totalStreams": 2500000000,
    "grammyWins": 2,
    "isVerified": true,
    "isFeatured": true,
    "labelStatus": "ALUMNI",
    "topSongs": [
      "Racks in the Middle",
      "Double Up",
      "Dedication",
      "Grinding All My Life",
      "Last Time That I Checkd"
    ],
    "riaaCertifications": {
      "platinum": 3,
      "gold": 3,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/0E7a8eRjHPbX9BbFXSzXXk",
      "instagram": "https://instagram.com/nipseyhussle"
    },
    "streamingPlatforms": []
  },
  {
    "id": "54",
    "name": "Stormzy",
    "slug": "stormzy",
    "tagline": "Heavy is the Head — Grime's biggest global star",
    "bio": "Michael Ebenazer Kwadjo Omari Owuo Jr., born July 26, 1993, in Croydon, London. He became the first black British solo artist to headline the Glastonbury Festival in 2019. His albums Gang Signs & Prayer (2017) and Heavy is the Head (2019) both debuted at number one in the UK.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Stormzy_2019_%28cropped%29.jpg/440px-Stormzy_2019_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Stormzy_2019_%28cropped%29.jpg/440px-Stormzy_2019_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop"
    ],
    "country": "UK",
    "monthlyListeners": 12000000,
    "totalStreams": 2500000000,
    "grammyWins": 0,
    "isVerified": true,
    "isFeatured": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Shut Up",
      "Vossi Bop",
      "Crown",
      "Blinded by Your Grace",
      "Superheroes"
    ],
    "riaaCertifications": {
      "platinum": 2,
      "gold": 2,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/2SrSdSvpminqmStGELCSNd",
      "instagram": "https://www.instagram.com/stormzyoffical",
      "twitter": "https://twitter.com/stormzy",
      "youtube": "https://www.youtube.com/channel/UC7D-09kUG6Ei11SVO_deW_w",
      "apple": "https://music.apple.com/us/artist/stormzy/394865154",
      "website": "https://www.stormzy.com/"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-54",
        "name": "Official Website",
        "url": "https://www.stormzy.com/"
      },
      {
        "id": "sp-spot-54",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/2SrSdSvpminqmStGELCSNd"
      },
      {
        "id": "sp-app-54",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/stormzy/394865154"
      },
      {
        "id": "sp-yt-54",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UC7D-09kUG6Ei11SVO_deW_w"
      }
    ]
  },
  {
    "id": "55",
    "name": "Quavo",
    "slug": "quavo",
    "tagline": "Culture — Migos charismatic trap captain",
    "bio": "Quavious Keyate Marshall, born April 2, 1991, in Athens, Georgia. The Migos signature triplet flow revolutionized modern rap. Bad and Boujee (2016) spent three weeks at number one.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Quavo_2019_%28cropped%29.jpg/440px-Quavo_2019_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Quavo_2019_%28cropped%29.jpg/440px-Quavo_2019_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "Trap"
    ],
    "country": "USA",
    "monthlyListeners": 12000000,
    "totalStreams": 3000000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Bad and Boujee",
      "T-Shirt",
      "Motorsport",
      "Walk It Talk It",
      "Bartier Cardi"
    ],
    "riaaCertifications": {
      "platinum": 10,
      "gold": 7,
      "diamond": 1
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/0VRj0yCOv2FXJNP47XQnx5",
      "instagram": "https://www.instagram.com/quavohuncho",
      "twitter": "https://twitter.com/QuavoStuntin",
      "youtube": "https://www.youtube.com/channel/UCU_xT0uVi5cku7cg9hDgkMA",
      "website": "https://quavohuncho.com",
      "apple": "https://music.apple.com/us/artist/quavo/923307623"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-55",
        "name": "Official Website",
        "url": "https://quavohuncho.com"
      },
      {
        "id": "sp-spot-55",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/0VRj0yCOv2FXJNP47XQnx5"
      },
      {
        "id": "sp-app-55",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/quavo/923307623"
      },
      {
        "id": "sp-yt-55",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UCU_xT0uVi5cku7cg9hDgkMA"
      }
    ]
  },
  {
    "id": "56",
    "name": "Swae Lee",
    "slug": "swae-lee",
    "tagline": "Sunflower — Rae Sremmurd's melodic half",
    "bio": "Khalif Malik Ibn Shaman Brown, born June 7, 1993. His collaboration with Post Malone, Sunflower (2018), for Spider-Man: Into the Spider-Verse spent 33 weeks on the Billboard Hot 100.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Swae_Lee_2019_%28cropped%29.jpg/440px-Swae_Lee_2019_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Swae_Lee_2019_%28cropped%29.jpg/440px-Swae_Lee_2019_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "Pop Rap",
      "R&B"
    ],
    "country": "USA",
    "monthlyListeners": 18000000,
    "totalStreams": 5000000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Sunflower",
      "Black Beatles",
      "Guatemala",
      "Hurt to Look",
      "Sextasy"
    ],
    "riaaCertifications": {
      "platinum": 8,
      "gold": 5,
      "diamond": 2
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/1zNqQNIdeOUZHb8zbZRFMX",
      "instagram": "https://www.instagram.com/swaelee",
      "twitter": "https://twitter.com/SwaeLee",
      "youtube": "https://www.youtube.com/channel/UCUJTvb20oc_15y3DRNvZlEA",
      "apple": "https://music.apple.com/us/artist/swae-lee/922547500",
      "website": "http://www.swaeleeofficial.com/"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-56",
        "name": "Official Website",
        "url": "http://www.swaeleeofficial.com/"
      },
      {
        "id": "sp-spot-56",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/1zNqQNIdeOUZHb8zbZRFMX"
      },
      {
        "id": "sp-app-56",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/swae-lee/922547500"
      },
      {
        "id": "sp-yt-56",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UCUJTvb20oc_15y3DRNvZlEA"
      }
    ]
  },
  {
    "id": "57",
    "name": "YNW Melly",
    "slug": "ynw-melly",
    "tagline": "Slang King — Gifted voices from Gifford",
    "bio": "Jamell Maurice Demons, born May 1, 1999, in Gifford, Florida. His breakout single Murder on My Mind (2017) gained viral success. His collaboration with Kanye West, Mixed Personalities, became his biggest mainstream hit.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/YNW_Melly_2019.jpg/440px-YNW_Melly_2019.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/YNW_Melly_2019.jpg/440px-YNW_Melly_2019.jpg",
    "genres": [
      "Hip-Hop",
      "Trap",
      "Melodic Rap"
    ],
    "country": "USA",
    "monthlyListeners": 16000000,
    "totalStreams": 3500000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Murder on My Mind",
      "Mixed Personalities",
      "223s",
      "Suicidal",
      "Butter Pecan"
    ],
    "riaaCertifications": {
      "platinum": 5,
      "gold": 3,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/1cNDP5yjU5vjeR8qMf4grg",
      "instagram": "https://www.instagram.com/ynwmelly",
      "youtube": "https://www.youtube.com/channel/UCelvBrvTHaZL_V6WuMkJDxQ",
      "twitter": "https://twitter.com/ynwmelly",
      "apple": "https://music.apple.com/us/artist/ynw-melly/1271167175"
    },
    "streamingPlatforms": [
      {
        "id": "sp-spot-57",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/1cNDP5yjU5vjeR8qMf4grg"
      },
      {
        "id": "sp-app-57",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/ynw-melly/1271167175"
      },
      {
        "id": "sp-yt-57",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UCelvBrvTHaZL_V6WuMkJDxQ"
      }
    ]
  },
  {
    "id": "58",
    "name": "Trippie Redd",
    "slug": "trippie-redd",
    "tagline": "1400 — Canton emo rock rapper",
    "bio": "Michael Lamar White IV, born June 18, 1999, in Canton, Ohio. He gained popularity through SoundCloud and YouTube. His debut album Life's a Trip (2018) debuted at number one on the US Rap chart.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Trippie_Redd_2019_%28cropped%29.jpg/440px-Trippie_Redd_2019_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Trippie_Redd_2019_%28cropped%29.jpg/440px-Trippie_Redd_2019_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "Emo Rap",
      "Alternative Rap"
    ],
    "country": "USA",
    "monthlyListeners": 15000000,
    "totalStreams": 3000000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Love Scars",
      "Dark Knight Dummo",
      "Topanga",
      "Wish",
      "Who Needs Love"
    ],
    "riaaCertifications": {
      "platinum": 4,
      "gold": 3,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/6Xgp2XMz1fhVYe7i6yNAax",
      "instagram": "https://www.instagram.com/trippieredd",
      "twitter": "https://twitter.com/trippieredd",
      "youtube": "https://www.youtube.com/channel/UCstw-41J8syXgdJ8xWvaizA",
      "website": "https://trippieredd.com",
      "apple": "https://music.apple.com/us/artist/trippie-redd/1195759714"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-58",
        "name": "Official Website",
        "url": "https://trippieredd.com"
      },
      {
        "id": "sp-spot-58",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/6Xgp2XMz1fhVYe7i6yNAax"
      },
      {
        "id": "sp-app-58",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/trippie-redd/1195759714"
      },
      {
        "id": "sp-yt-58",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UCstw-41J8syXgdJ8xWvaizA"
      }
    ]
  },
  {
    "id": "59",
    "name": "Kodak Black",
    "slug": "kodak-black",
    "tagline": "Project Baby — Pompano Beach's raw voice",
    "bio": "Bill Kahan Kapri, born June 11, 1997, in Pompano Beach, Florida. His hit Tunnel Vision (2017) reached number six on the Hot 100. Zeze (2018) became a platinum hit.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Kodak_Black_2017_%28cropped%29.jpg/440px-Kodak_Black_2017_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Kodak_Black_2017_%28cropped%29.jpg/440px-Kodak_Black_2017_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "Trap",
      "Southern Rap"
    ],
    "country": "USA",
    "monthlyListeners": 14000000,
    "totalStreams": 3000000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "ZEZE",
      "Tunnel Vision",
      "Super Gremlin",
      "Roll in Peace",
      "No Flockin"
    ],
    "riaaCertifications": {
      "platinum": 6,
      "gold": 4,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/46SHBwWsqBkxI7EeeBEQG7",
      "instagram": "https://instagram.com/kodakblack",
      "twitter": "https://twitter.com/KodakBlack1k"
    },
    "streamingPlatforms": []
  },
  {
    "id": "60",
    "name": "Lil Tjay",
    "slug": "lil-tjay",
    "tagline": "True 2 Myself — Bronx melodic survivor",
    "bio": "Tione Jayden Merritt, born April 30, 2001, in The Bronx, New York. He miraculously survived being shot seven times in June 2022 and made a remarkable comeback with music shortly after.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Lil_Tjay_2021.jpg/440px-Lil_Tjay_2021.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Lil_Tjay_2021.jpg/440px-Lil_Tjay_2021.jpg",
    "genres": [
      "Hip-Hop",
      "Melodic Rap",
      "Trap"
    ],
    "country": "USA",
    "monthlyListeners": 10000000,
    "totalStreams": 2000000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Pop Out",
      "Ruthless",
      "F.N.",
      "In My Head",
      "Forever"
    ],
    "riaaCertifications": {
      "platinum": 4,
      "gold": 3,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/4tFECH7T6aMTCDqnxVlbvH",
      "instagram": "https://instagram.com/liltjay",
      "twitter": "https://twitter.com/liltjay"
    },
    "streamingPlatforms": []
  },
  {
    "id": "61",
    "name": "A Boogie wit da Hoodie",
    "slug": "a-boogie-wit-da-hoodie",
    "tagline": "Highbridge the Label — Bronx melody maker",
    "bio": "Artist Julius Dubose, born December 6, 1995, in Highbridge, the Bronx. His 2018 album Hoodie SZN debuted at number one on the Billboard 200, making him one of the few Bronx rappers to achieve that feat.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/A_Boogie_Wit_da_Hoodie_2018.jpg/440px-A_Boogie_Wit_da_Hoodie_2018.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/A_Boogie_Wit_da_Hoodie_2018.jpg/440px-A_Boogie_Wit_da_Hoodie_2018.jpg",
    "genres": [
      "Hip-Hop",
      "Melodic Rap",
      "R&B"
    ],
    "country": "USA",
    "monthlyListeners": 12000000,
    "totalStreams": 2500000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Look Back at It",
      "Drowning",
      "Numbers",
      "Timeless",
      "Trap She Wrote"
    ],
    "riaaCertifications": {
      "platinum": 5,
      "gold": 4,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/31W5EY0aAly4Qieq6OFu6I",
      "instagram": "https://instagram.com/aboogiewitdahoodie",
      "twitter": "https://twitter.com/ArtistHBTL"
    },
    "streamingPlatforms": []
  },
  {
    "id": "62",
    "name": "Fetty Wap",
    "slug": "fetty-wap",
    "tagline": "Remy Boyz — Paterson one-eyed sensation",
    "bio": "Willie Junior Maxwell II, born June 7, 1991, in Paterson, New Jersey. His debut album (2015) produced multiple hits including Trap Queen, 679, and My Way, all charting simultaneously in the top five of the Billboard Hot 100.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Fetty_Wap_2015_%28cropped%29.jpg/440px-Fetty_Wap_2015_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Fetty_Wap_2015_%28cropped%29.jpg/440px-Fetty_Wap_2015_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "Trap",
      "Pop Rap"
    ],
    "country": "USA",
    "monthlyListeners": 10000000,
    "totalStreams": 3000000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Trap Queen",
      "679",
      "My Way",
      "Again",
      "RGF Island"
    ],
    "riaaCertifications": {
      "platinum": 10,
      "gold": 6,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/6PXS4YHDkKvl1wkIl4V8DL",
      "instagram": "https://www.instagram.com/fettywap1738",
      "twitter": "https://twitter.com/fettywap",
      "youtube": "https://www.youtube.com/channel/UC_eQfAQjj6mYj92l3SBmIdg",
      "apple": "https://music.apple.com/us/artist/fetty-wap/872900424",
      "website": "https://fettywap.com/"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-62",
        "name": "Official Website",
        "url": "https://fettywap.com/"
      },
      {
        "id": "sp-spot-62",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/6PXS4YHDkKvl1wkIl4V8DL"
      },
      {
        "id": "sp-app-62",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/fetty-wap/872900424"
      },
      {
        "id": "sp-yt-62",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UC_eQfAQjj6mYj92l3SBmIdg"
      }
    ]
  },
  {
    "id": "63",
    "name": "Cam'ron",
    "slug": "camron",
    "tagline": "Killa Cam — Diplomat Records Leader",
    "bio": "Cameron Ezike Giles, better known by his stage name Cam'ron, is an American rapper and record producer from Harlem, New York. Beginning his career in Children of the Corn, he founded The Diplomats (Dipset) and released classics like 'Come Home with Me' and 'Purple Haze'.",
    "avatarUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    "heroUrl": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1920&q=80",
    "genres": [
      "Hip-Hop"
    ],
    "country": "United States",
    "countryFlag": "🇺🇸",
    "isVerified": true,
    "isFeatured": false,
    "labelStatus": "VERIFIED",
    "monthlyListeners": 3100000,
    "totalStreams": 800000000,
    "grammyWins": 0,
    "topSongs": [
      "Oh Boy",
      "Hey Ma",
      "Down and Out",
      "Killa Cam",
      "Touch It or Not"
    ],
    "riaaCertifications": {
      "platinum": 1,
      "gold": 2,
      "diamond": 0
    },
    "latestReleaseTitle": "Purple Haze 2",
    "latestReleaseDate": "2019-12-20",
    "socials": {
      "spotify": "https://open.spotify.com/artist/7iMvwE8qANp3aIfAGKEAwS",
      "youtube": "https://www.youtube.com/channel/UCA6ZkT-oyly9r6aK23HVkHw",
      "instagram": "https://www.instagram.com/mr_camron",
      "twitter": "https://twitter.com/Mr_Camron",
      "website": "http://www.myjiggie.com/",
      "apple": "https://music.apple.com/us/artist/camron/45084"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-63",
        "name": "Official Website",
        "url": "http://www.myjiggie.com/"
      },
      {
        "id": "sp-spot-63",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/7iMvwE8qANp3aIfAGKEAwS"
      },
      {
        "id": "sp-app-63",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/camron/45084"
      },
      {
        "id": "sp-yt-63",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UCA6ZkT-oyly9r6aK23HVkHw"
      }
    ]
  },
  {
    "id": "64",
    "name": "Coi Leray",
    "slug": "coi-leray",
    "tagline": "Big Leray Energy — New Jersey pop-rap powerhouse",
    "bio": "Brittany Collins, born May 1, 1997, in Boston, Massachusetts. Her breakthrough single No More Parties (2021) debuted at number five on the Hot 100. She collaborated with Nicki Minaj on Blick Blick.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Coi_Leray_2022.jpg/440px-Coi_Leray_2022.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Coi_Leray_2022.jpg/440px-Coi_Leray_2022.jpg",
    "genres": [
      "Hip-Hop",
      "Pop Rap",
      "Trap"
    ],
    "country": "USA",
    "monthlyListeners": 10000000,
    "totalStreams": 2000000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "No More Parties",
      "Blick Blick",
      "Players",
      "Twinnem",
      "FUTU"
    ],
    "riaaCertifications": {
      "platinum": 3,
      "gold": 2,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/6AMd49uBDJfhf30Ak2QR5s",
      "instagram": "https://www.instagram.com/coileray",
      "twitter": "https://twitter.com/coi_leray",
      "youtube": "https://www.youtube.com/channel/UCiHc6oRZnXXZHZlaxbNkfQg",
      "apple": "https://music.apple.com/us/artist/coi-leray/1358539712",
      "website": "https://www.coileray.com/"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-64",
        "name": "Official Website",
        "url": "https://www.coileray.com/"
      },
      {
        "id": "sp-spot-64",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/6AMd49uBDJfhf30Ak2QR5s"
      },
      {
        "id": "sp-app-64",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/coi-leray/1358539712"
      },
      {
        "id": "sp-yt-64",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UCiHc6oRZnXXZHZlaxbNkfQg"
      }
    ]
  },
  {
    "id": "65",
    "name": "Key Glock",
    "slug": "key-glock",
    "tagline": "Yellow Tape — Young Dolph's heir in Memphis",
    "bio": "Markeyvius Cathey, born January 3, 1997, in South Memphis, Tennessee. Signed to Paper Route Empire. His solo albums Yellow Tape (2020) and Yellow Tape 2 (2021) both debuted in the top ten.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Key_Glock_2021.jpg/440px-Key_Glock_2021.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Key_Glock_2021.jpg/440px-Key_Glock_2021.jpg",
    "genres": [
      "Hip-Hop",
      "Trap",
      "Southern Rap"
    ],
    "country": "USA",
    "monthlyListeners": 8000000,
    "totalStreams": 1500000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Dum and Dummer",
      "Mr. Glock",
      "Yellow Tape",
      "F Up the Pot",
      "Speed"
    ],
    "riaaCertifications": {
      "platinum": 2,
      "gold": 2,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/0f9MRpnqScMqw2Lmn5tnlR",
      "instagram": "https://instagram.com/keyglock",
      "twitter": "https://twitter.com/KeyGlock"
    },
    "streamingPlatforms": []
  },
  {
    "id": "66",
    "name": "Redman",
    "slug": "redman",
    "tagline": "Doc Gilla — Newark Hip-Hop Innovator & Def Squad Pioneer",
    "bio": "Reginald Noble, better known by his stage name Redman, is an American rapper, DJ, and actor from Newark, New Jersey. He rose to fame in the early 1990s as an artist on the Def Jam label and a member of the Def Squad. Widely celebrated for his witty punchlines, exuberant charisma, and legendary collaborations with Method Man as Red & Meth, Redman is universally regarded as one of hip-hop's most technically gifted and influential MCs.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Redman_2011.jpg/800px-Redman_2011.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Redman_2011.jpg/800px-Redman_2011.jpg",
    "genres": [
      "Hip-Hop",
      "East Coast Rap",
      "Hardcore Rap"
    ],
    "country": "United States",
    "countryFlag": "🇺🇸",
    "isVerified": true,
    "isFeatured": false,
    "labelStatus": "VERIFIED",
    "monthlyListeners": 3500000,
    "totalStreams": 980000000,
    "grammyWins": 0,
    "topSongs": [
      "Da Rockwilder",
      "How High",
      "Tonight's Da Night",
      "Time 4 Sum Aksion",
      "Can't Wait"
    ],
    "riaaCertifications": {
      "platinum": 3,
      "gold": 4,
      "diamond": 0
    },
    "latestReleaseTitle": "Muddy Waters Too",
    "latestReleaseDate": "2024-04-19",
    "socials": {
      "spotify": "https://open.spotify.com/artist/7xTKLpo7UCzXSnlH7fOIoM",
      "youtube": "https://www.youtube.com/@redmanofficial",
      "instagram": "https://www.instagram.com/redmangilla",
      "twitter": "https://twitter.com/therealredman",
      "website": "http://www.funkdoc.com/",
      "apple": "https://music.apple.com/us/artist/redman/49881"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-66",
        "name": "Official Website",
        "url": "http://www.funkdoc.com/"
      },
      {
        "id": "sp-spot-66",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/7xTKLpo7UCzXSnlH7fOIoM"
      },
      {
        "id": "sp-app-66",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/redman/49881"
      },
      {
        "id": "sp-yt-66",
        "name": "YouTube",
        "url": "https://www.youtube.com/@redmanofficial"
      }
    ]
  },
  {
    "id": "67",
    "name": "Vince Staples",
    "slug": "vince-staples",
    "tagline": "Big Fish Theory — Long Beach sharp intellectual",
    "bio": "Vince Staples, born July 2, 1993, in Long Beach, California. His debut Summertime 06 (2015) was critically acclaimed. His album Big Fish Theory (2017) incorporated electronic production in an innovative way.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Vince_Staples_2018_%28cropped%29.jpg/440px-Vince_Staples_2018_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Vince_Staples_2018_%28cropped%29.jpg/440px-Vince_Staples_2018_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "West Coast Rap",
      "Alternative Rap"
    ],
    "country": "USA",
    "monthlyListeners": 5000000,
    "totalStreams": 1000000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Norf Norf",
      "Big Fish",
      "Lift Me Up",
      "Bag Bak",
      "Summertime"
    ],
    "riaaCertifications": {
      "platinum": 1,
      "gold": 1,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/62nHuSAODmXNdVBVdRNuBK",
      "instagram": "https://instagram.com/vincestaples",
      "twitter": "https://twitter.com/vincestaples"
    },
    "streamingPlatforms": []
  },
  {
    "id": "68",
    "name": "Logic",
    "slug": "logic",
    "tagline": "Young Sinatra — Gaithersburg wordsmith",
    "bio": "Sir Robert Bryson Hall II, born January 22, 1990, in Gaithersburg, Maryland. His single 1-800-273-8255 (2017) became a cultural phenomenon and topped charts worldwide, named after the National Suicide Prevention Lifeline.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Logic_rapper_2019_%28cropped%29.jpg/440px-Logic_rapper_2019_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Logic_rapper_2019_%28cropped%29.jpg/440px-Logic_rapper_2019_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "Conscious Rap",
      "East Coast Rap"
    ],
    "country": "USA",
    "monthlyListeners": 10000000,
    "totalStreams": 2500000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "1-800-273-8255",
      "Homicide",
      "Everybody",
      "Nikki",
      "Fade Away"
    ],
    "riaaCertifications": {
      "platinum": 5,
      "gold": 4,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/4xRYI6VqpkE3UwrDrAZL8L",
      "instagram": "https://www.instagram.com/logic",
      "twitter": "https://twitter.com/Logic301",
      "youtube": "https://www.youtube.com/channel/UC4EDjfs78AhVgpBqE3WFGJg",
      "website": "https://logicmerch.com",
      "apple": "https://music.apple.com/us/artist/logic/436573887"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-68",
        "name": "Official Website",
        "url": "https://logicmerch.com"
      },
      {
        "id": "sp-spot-68",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/4xRYI6VqpkE3UwrDrAZL8L"
      },
      {
        "id": "sp-app-68",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/logic/436573887"
      },
      {
        "id": "sp-yt-68",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UC4EDjfs78AhVgpBqE3WFGJg"
      }
    ]
  },
  {
    "id": "69",
    "name": "G-Eazy",
    "slug": "g-eazy",
    "tagline": "The Beautiful and Damned — Bay Area suave rapper",
    "bio": "Gerald Earl Gillum, born May 24, 1989, in Oakland, California. His 2017 album The Beautiful and Damned debuted at number three and produced the hits Him and I with Halsey and No Limit with A$AP Rocky and Cardi B.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/G-Eazy_2018_%28cropped%29.jpg/440px-G-Eazy_2018_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/G-Eazy_2018_%28cropped%29.jpg/440px-G-Eazy_2018_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "Pop Rap",
      "West Coast Rap"
    ],
    "country": "USA",
    "monthlyListeners": 8000000,
    "totalStreams": 2000000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Me Myself and I",
      "No Limit",
      "Him and I",
      "Tumblr Girls",
      "Far Alone"
    ],
    "riaaCertifications": {
      "platinum": 5,
      "gold": 4,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/02kJSzxNuaWGqwubyUba0Z",
      "instagram": "https://www.instagram.com/g_eazy",
      "twitter": "https://twitter.com/G_Eazy",
      "youtube": "https://www.youtube.com/channel/UCBkNpeyvBO2TdPGVC_PsPUA",
      "website": "https://g-eazy.com",
      "apple": "https://music.apple.com/us/artist/g-eazy/315181817"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-69",
        "name": "Official Website",
        "url": "https://g-eazy.com"
      },
      {
        "id": "sp-spot-69",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/02kJSzxNuaWGqwubyUba0Z"
      },
      {
        "id": "sp-app-69",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/g-eazy/315181817"
      },
      {
        "id": "sp-yt-69",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UCBkNpeyvBO2TdPGVC_PsPUA"
      }
    ]
  },
  {
    "id": "70",
    "name": "Big Sean",
    "slug": "big-sean",
    "tagline": "Detroit 2 — GOOD Music's verbose voice",
    "bio": "Sean Michael Leonard Anderson, born March 25, 1988, raised in Detroit, Michigan. Signed to Kanye West's GOOD Music. His album I Decided (2017) debuted at number one.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Big_Sean_2018_%28cropped%29.jpg/440px-Big_Sean_2018_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Big_Sean_2018_%28cropped%29.jpg/440px-Big_Sean_2018_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "Pop Rap"
    ],
    "country": "USA",
    "monthlyListeners": 10000000,
    "totalStreams": 2500000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Blessings",
      "One Man Can Change the World",
      "Bounce Back",
      "IDFWU",
      "Beware"
    ],
    "riaaCertifications": {
      "platinum": 5,
      "gold": 4,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/0c173mlxpT3dSFRgMO8XPh",
      "instagram": "https://instagram.com/bigsean",
      "twitter": "https://twitter.com/BigSean"
    },
    "streamingPlatforms": []
  },
  {
    "id": "71",
    "name": "2 Chainz",
    "slug": "2-chainz",
    "tagline": "TRU REALigion — ATL certified charismatic boss",
    "bio": "Tauheed Epps, born September 12, 1977, in College Park, Georgia. His debut solo album Based on a T.R.U. Story (2012) debuted at number one. Known for his unmatched ability to create catchphrases.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/2_Chainz_2013_%28cropped%29.jpg/440px-2_Chainz_2013_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/2_Chainz_2013_%28cropped%29.jpg/440px-2_Chainz_2013_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "Trap",
      "Southern Rap"
    ],
    "country": "USA",
    "monthlyListeners": 8000000,
    "totalStreams": 2000000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "No Lie",
      "Birthday Song",
      "I'm Different",
      "Watch Out",
      "Mercy"
    ],
    "riaaCertifications": {
      "platinum": 5,
      "gold": 4,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/17lzZA2AlOHwCwFALHttmp",
      "instagram": "https://www.instagram.com/2chainz",
      "twitter": "https://twitter.com/2chainz",
      "youtube": "https://www.youtube.com/channel/UCcZzRX_ZDV-Sg04Ir-upxPA",
      "website": "http://www.2chainz.com/",
      "apple": "https://music.apple.com/us/artist/2-chainz/435300447"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-71",
        "name": "Official Website",
        "url": "http://www.2chainz.com/"
      },
      {
        "id": "sp-spot-71",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/17lzZA2AlOHwCwFALHttmp"
      },
      {
        "id": "sp-app-71",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/2-chainz/435300447"
      },
      {
        "id": "sp-yt-71",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UCcZzRX_ZDV-Sg04Ir-upxPA"
      }
    ]
  },
  {
    "id": "72",
    "name": "Denzel Curry",
    "slug": "denzel-curry",
    "tagline": "ZUU — Carol City wild aggressive lyricist",
    "bio": "Denzel Rae Donald Curry, born February 16, 1995, in Carol City, Miami, Florida. His 2018 album TA13OO was a critically acclaimed three-act concept album exploring taboo subjects.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Denzel_Curry_2019_%28cropped%29.jpg/440px-Denzel_Curry_2019_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Denzel_Curry_2019_%28cropped%29.jpg/440px-Denzel_Curry_2019_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "Alternative Rap",
      "Trap"
    ],
    "country": "USA",
    "monthlyListeners": 6000000,
    "totalStreams": 1200000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Bulls on Parade",
      "Clout Cobain",
      "RICKY",
      "Walkin",
      "Ultimate"
    ],
    "riaaCertifications": {
      "platinum": 1,
      "gold": 1,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/6fxyWrfmjcbj5d12gXeiNV",
      "instagram": "https://instagram.com/denzelcurry",
      "twitter": "https://twitter.com/denzelcurry"
    },
    "streamingPlatforms": []
  },
  {
    "id": "73",
    "name": "Freddie Gibbs",
    "slug": "freddie-gibbs",
    "tagline": "Gangsta Gibbs — Gary Indiana finest MC",
    "bio": "Frederick Jamel Tipton, born June 14, 1982, in Gary, Indiana. His 2020 album Alfredo with The Alchemist won the Grammy Award for Best Rap Album.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Freddie_Gibbs_2019.jpg/440px-Freddie_Gibbs_2019.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Freddie_Gibbs_2019.jpg/440px-Freddie_Gibbs_2019.jpg",
    "genres": [
      "Hip-Hop",
      "Gangsta Rap",
      "East Coast Rap"
    ],
    "country": "USA",
    "monthlyListeners": 5000000,
    "totalStreams": 1000000000,
    "grammyWins": 1,
    "isVerified": true,
    "labelStatus": "OPEN",
    "topSongs": [
      "Scottie Beam",
      "Crime Pays",
      "Bandana",
      "Cataracts",
      "Skinny Suge"
    ],
    "riaaCertifications": {
      "platinum": 1,
      "gold": 1,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/0Y4inQK6OespitzD6ijMwb",
      "instagram": "https://www.instagram.com/freddiegibbs",
      "twitter": "https://twitter.com/FreddieGibbs",
      "youtube": "https://www.youtube.com/channel/UCKAtbNtZNyqBWH1FG1Kvmnw",
      "website": "https://www.esgnrecords.com/",
      "apple": "https://music.apple.com/us/artist/freddie-gibbs/302166615"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-73",
        "name": "Official Website",
        "url": "https://www.esgnrecords.com/"
      },
      {
        "id": "sp-spot-73",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/0Y4inQK6OespitzD6ijMwb"
      },
      {
        "id": "sp-app-73",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/freddie-gibbs/302166615"
      },
      {
        "id": "sp-yt-73",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UCKAtbNtZNyqBWH1FG1Kvmnw"
      }
    ]
  },
  {
    "id": "74",
    "name": "Cordae",
    "slug": "cordae",
    "tagline": "The Lost Boy — Maryland conscious new voice",
    "bio": "Cordae Amari Dunston, born August 26, 1997, raised in Suitland, Maryland. His debut The Lost Boy (2019) received a Grammy nomination. He was named to Forbes 30 Under 30 list.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Cordae_2019_%28cropped%29.jpg/440px-Cordae_2019_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Cordae_2019_%28cropped%29.jpg/440px-Cordae_2019_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "Conscious Rap",
      "East Coast Rap"
    ],
    "country": "USA",
    "monthlyListeners": 4000000,
    "totalStreams": 800000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "The Homies",
      "Have Mercy",
      "Thanksgiving",
      "Bad Idea",
      "Chronicles"
    ],
    "riaaCertifications": {
      "platinum": 1,
      "gold": 1,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/0huGjMyP507tBCARyzSkrv",
      "instagram": "https://www.instagram.com/cordae",
      "twitter": "https://twitter.com/cordae",
      "youtube": "https://www.youtube.com/channel/UCPgLVIq1Zr82PD7-f9mxLQQ",
      "apple": "https://music.apple.com/us/artist/cordae/1384072011"
    },
    "streamingPlatforms": [
      {
        "id": "sp-spot-74",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/0huGjMyP507tBCARyzSkrv"
      },
      {
        "id": "sp-app-74",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/cordae/1384072011"
      },
      {
        "id": "sp-yt-74",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UCPgLVIq1Zr82PD7-f9mxLQQ"
      }
    ]
  },
  {
    "id": "75",
    "name": "JID",
    "slug": "jid",
    "tagline": "DiCaprio 2 — Atlanta next lyrical great",
    "bio": "Destin Choice Route, born October 31, 1989, in Atlanta, Georgia. Signed to J. Cole's Dreamville Records. His 2022 album The Forever Story debuted in the top five and was nominated for multiple Grammy Awards.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/JID_2022_%28cropped%29.jpg/440px-JID_2022_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/JID_2022_%28cropped%29.jpg/440px-JID_2022_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "East Coast Rap",
      "Conscious Rap"
    ],
    "country": "USA",
    "monthlyListeners": 8000000,
    "totalStreams": 1500000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "151 Rum",
      "SURROUND SOUND",
      "Bruddanem",
      "Off Deez",
      "Kody Blu 31"
    ],
    "riaaCertifications": {
      "platinum": 1,
      "gold": 1,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/6U3ybJ9UHNKEdsH7ktGBZ7",
      "instagram": "https://instagram.com/jid",
      "twitter": "https://twitter.com/JID"
    },
    "streamingPlatforms": []
  },
  {
    "id": "76",
    "name": "Isaiah Rashad",
    "slug": "isaiah-rashad",
    "tagline": "The Sun's Tirade — Chattanooga's TDE gem",
    "bio": "Isaiah Rashad, born May 16, 1991, in Chattanooga, Tennessee. Signed to Top Dawg Entertainment alongside Kendrick Lamar and SZA. His return album The House Is Burning (2021) was one of the most anticipated rap releases of that year.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Isaiah_Rashad_2017.jpg/440px-Isaiah_Rashad_2017.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Isaiah_Rashad_2017.jpg/440px-Isaiah_Rashad_2017.jpg",
    "genres": [
      "Hip-Hop",
      "Alternative Rap",
      "Southern Rap"
    ],
    "country": "USA",
    "monthlyListeners": 4000000,
    "totalStreams": 800000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Lay Wit Ya",
      "Wat's Wrong",
      "Rope",
      "From the Garden",
      "Headshots"
    ],
    "riaaCertifications": {
      "platinum": 1,
      "gold": 1,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/6aaMZ3fcfLv4tEbmY7bjRM",
      "instagram": "https://www.instagram.com/isaiahrashad",
      "twitter": "https://twitter.com/isaiahrashad",
      "apple": "https://music.apple.com/us/artist/isaiah-rashad/605391263",
      "website": "http://txdxe.com/"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-76",
        "name": "Official Website",
        "url": "http://txdxe.com/"
      },
      {
        "id": "sp-spot-76",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/6aaMZ3fcfLv4tEbmY7bjRM"
      },
      {
        "id": "sp-app-76",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/isaiah-rashad/605391263"
      }
    ]
  },
  {
    "id": "77",
    "name": "Blueface",
    "slug": "blueface",
    "tagline": "Blueface Baby — Compton unorthodox rapper",
    "bio": "Jonathan Michael Porter, born January 20, 1997, in Los Angeles, California. His single Thotiana reached number 18 on the Billboard Hot 100 and was certified multi-platinum.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Blueface_2019_%28cropped%29.jpg/440px-Blueface_2019_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Blueface_2019_%28cropped%29.jpg/440px-Blueface_2019_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "West Coast Rap",
      "Trap"
    ],
    "country": "USA",
    "monthlyListeners": 5000000,
    "totalStreams": 1200000000,
    "grammyWins": 0,
    "isVerified": false,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Thotiana",
      "Bleed It",
      "Deadlocs",
      "Close Up",
      "Studio"
    ],
    "riaaCertifications": {
      "platinum": 3,
      "gold": 2,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/3Fl1V19tmjt57oBdxXKAjJ",
      "instagram": "https://www.instagram.com/bluefacebleedem",
      "twitter": "https://twitter.com/bluefacebleedem",
      "youtube": "https://www.youtube.com/channel/UCZwJNsS8DxGT8iTtOVbYUNg",
      "apple": "https://music.apple.com/us/artist/blueface/126007084"
    },
    "streamingPlatforms": [
      {
        "id": "sp-spot-77",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/3Fl1V19tmjt57oBdxXKAjJ"
      },
      {
        "id": "sp-app-77",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/blueface/126007084"
      },
      {
        "id": "sp-yt-77",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UCZwJNsS8DxGT8iTtOVbYUNg"
      }
    ]
  },
  {
    "id": "78",
    "name": "Flo Milli",
    "slug": "flo-milli",
    "tagline": "Mobile Alabama rap star",
    "bio": "Tamia Monique Carter, born January 9, 2000, in Mobile, Alabama. She went viral in 2019 with her track In the Party. Her debut mixtape Ho Why Is You Here? (2020) was critically acclaimed.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Flo_Milli_2021.jpg/440px-Flo_Milli_2021.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Flo_Milli_2021.jpg/440px-Flo_Milli_2021.jpg",
    "genres": [
      "Hip-Hop",
      "Trap",
      "Southern Rap"
    ],
    "country": "USA",
    "monthlyListeners": 6000000,
    "totalStreams": 1200000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Conceited",
      "In the Party",
      "Roaring 20s",
      "Not Friendly",
      "Weak"
    ],
    "riaaCertifications": {
      "platinum": 2,
      "gold": 2,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/08PvCOlef4xdOr20jFSTPd",
      "instagram": "https://www.instagram.com/flomillishit",
      "twitter": "https://twitter.com/_flomilli",
      "youtube": "https://www.youtube.com/channel/UCylw9yLlhFVX_vIdjc6DjGQ",
      "apple": "https://music.apple.com/us/artist/flo-milli/1263242099",
      "website": "https://www.flomilli.com/"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-78",
        "name": "Official Website",
        "url": "https://www.flomilli.com/"
      },
      {
        "id": "sp-spot-78",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/08PvCOlef4xdOr20jFSTPd"
      },
      {
        "id": "sp-app-78",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/flo-milli/1263242099"
      },
      {
        "id": "sp-yt-78",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UCylw9yLlhFVX_vIdjc6DjGQ"
      }
    ]
  },
  {
    "id": "79",
    "name": "Nav",
    "slug": "nav",
    "tagline": "Reckless — Toronto XO melodic rapper",
    "bio": "Navraj Singh Goraya, born November 3, 1989, in Toronto, Canada. A member of The Weeknd's XO music collective. He has produced beats for Drake, Travis Scott, and Metro Boomin.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Nav_rapper_2019.jpg/440px-Nav_rapper_2019.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Nav_rapper_2019.jpg/440px-Nav_rapper_2019.jpg",
    "genres": [
      "Hip-Hop",
      "Trap",
      "Melodic Rap"
    ],
    "country": "Canada",
    "monthlyListeners": 8000000,
    "totalStreams": 1500000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Turks",
      "Some Way",
      "Elevator",
      "Bounce",
      "Freshman List"
    ],
    "riaaCertifications": {
      "platinum": 3,
      "gold": 2,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/7rkW85dBwwrJtlHRDkJDAC",
      "instagram": "https://www.instagram.com/nav",
      "twitter": "https://twitter.com/beatsbynav",
      "youtube": "https://www.youtube.com/channel/UCuI48V3qSHZvZimYgFNJYJg",
      "apple": "https://music.apple.com/us/artist/nav/1200089113",
      "website": "http://navmusic.com"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-79",
        "name": "Official Website",
        "url": "http://navmusic.com"
      },
      {
        "id": "sp-spot-79",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/7rkW85dBwwrJtlHRDkJDAC"
      },
      {
        "id": "sp-app-79",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/nav/1200089113"
      },
      {
        "id": "sp-yt-79",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UCuI48V3qSHZvZimYgFNJYJg"
      }
    ]
  },
  {
    "id": "80",
    "name": "Lil Pump",
    "slug": "lil-pump",
    "tagline": "ESSKEETIT GOOBA — viral SoundCloud king",
    "bio": "Gazzy Garcia, born August 17, 2000, in Miami, Florida. His single Gucci Gang reached number three on the Billboard Hot 100. He signed a major deal with Warner Records and appeared on Kanye West's Ye album.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Lil_Pump_2018_%28cropped%29.jpg/440px-Lil_Pump_2018_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Lil_Pump_2018_%28cropped%29.jpg/440px-Lil_Pump_2018_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "SoundCloud Rap",
      "Trap"
    ],
    "country": "USA",
    "monthlyListeners": 5000000,
    "totalStreams": 2000000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Gucci Gang",
      "ESSKEETIT",
      "I Love It",
      "Drug Addicts",
      "Boss"
    ],
    "riaaCertifications": {
      "platinum": 5,
      "gold": 3,
      "diamond": 1
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/3wyVrVrFCkukjdVIdirGVY",
      "instagram": "https://instagram.com/lilpump",
      "twitter": "https://twitter.com/lilpump"
    },
    "streamingPlatforms": []
  },
  {
    "id": "81",
    "name": "Lil Yachty",
    "slug": "lil-yachty",
    "tagline": "Lil Boat — Atlanta's colorful rap teen",
    "bio": "Miles Parks McCollum, born August 23, 1997, in Atlanta, Georgia. Known as the founder of the Sailing Team. His experimental album Let's Start Here (2023) broke new ground for his career.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Polo_G_2021.jpg/440px-Polo_G_2021.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Polo_G_2021.jpg/440px-Polo_G_2021.jpg",
    "genres": [
      "Hip-Hop",
      "Trap",
      "Alternative Rap"
    ],
    "country": "USA",
    "monthlyListeners": 8000000,
    "totalStreams": 2000000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Minnesota",
      "Broccoli",
      "iSpy",
      "Poland",
      "drive ME crazy"
    ],
    "riaaCertifications": {
      "platinum": 4,
      "gold": 3,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/67hxUCqHcUlFbGHH0VljPb",
      "instagram": "https://instagram.com/lilyachty",
      "twitter": "https://twitter.com/lilyachty"
    },
    "streamingPlatforms": []
  },
  {
    "id": "82",
    "name": "Brockhampton",
    "slug": "brockhampton",
    "tagline": "All-American Bad Boys — The internet boyband",
    "bio": "BROCKHAMPTON is an American boy band and rap collective formed in San Marcos, Texas in 2015 by Kevin Abstract. Their three Saturation albums (2017) established them as one of the most innovative groups in hip-hop. Their debut major label album Iridescence (2018) debuted at number one.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/BROCKHAMPTON_2018.jpg/440px-BROCKHAMPTON_2018.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/BROCKHAMPTON_2018.jpg/440px-BROCKHAMPTON_2018.jpg",
    "genres": [
      "Hip-Hop",
      "Alternative Rap",
      "Experimental Rap"
    ],
    "country": "USA",
    "monthlyListeners": 8000000,
    "totalStreams": 2000000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "SUGAR",
      "BOOGIE",
      "HEAT",
      "QUEER",
      "BLEACH"
    ],
    "riaaCertifications": {
      "platinum": 2,
      "gold": 2,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/1P2iCEhBHFDCHo1W8NBNKX",
      "instagram": "https://instagram.com/brockhampton",
      "twitter": "https://twitter.com/brckhmptn"
    },
    "streamingPlatforms": []
  },
  {
    "id": "83",
    "name": "Tierra Whack",
    "slug": "tierra-whack",
    "tagline": "Whack World — Philly most creative rap mind",
    "bio": "Tierra Whack, born March 11, 1995, in Philadelphia, Pennsylvania. Her debut Whack World (2018) — a 15-minute concept album with one song per minute — was universally acclaimed by critics as one of the most creative rap projects of the decade.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Tierra_Whack_2019_%28cropped%29.jpg/440px-Tierra_Whack_2019_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Tierra_Whack_2019_%28cropped%29.jpg/440px-Tierra_Whack_2019_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "Alternative Rap",
      "Experimental Rap"
    ],
    "country": "USA",
    "monthlyListeners": 4000000,
    "totalStreams": 800000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Unemployed",
      "Cable Guy",
      "Mumbo Jumbo",
      "Only Child",
      "Pretty Ugly"
    ],
    "riaaCertifications": {
      "platinum": 1,
      "gold": 1,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/4lPl9gqgox3JDiaJ1yklKh",
      "instagram": "https://www.instagram.com/tierrawhack",
      "twitter": "https://twitter.com/TierraWhack",
      "youtube": "https://www.youtube.com/channel/UC7v_YlS5RVfKPe8sWfN406A",
      "apple": "https://music.apple.com/us/artist/tierra-whack/1209032442"
    },
    "streamingPlatforms": [
      {
        "id": "sp-spot-83",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/4lPl9gqgox3JDiaJ1yklKh"
      },
      {
        "id": "sp-app-83",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/tierra-whack/1209032442"
      },
      {
        "id": "sp-yt-83",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UC7v_YlS5RVfKPe8sWfN406A"
      }
    ]
  },
  {
    "id": "84",
    "name": "NLE Choppa",
    "slug": "nle-choppa",
    "tagline": "No Love Entertainment — Memphis teen phenom",
    "bio": "Bryson Lashun Potts, born November 1, 2002, in Memphis, Tennessee. He exploded onto the scene at 16 with the viral single Shotta Flow (2019), which was certified platinum.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/NLE_Choppa_2022.jpg/440px-NLE_Choppa_2022.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/NLE_Choppa_2022.jpg/440px-NLE_Choppa_2022.jpg",
    "genres": [
      "Hip-Hop",
      "Trap",
      "Southern Rap"
    ],
    "country": "USA",
    "monthlyListeners": 8000000,
    "totalStreams": 1800000000,
    "grammyWins": 0,
    "isVerified": false,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Shotta Flow",
      "No Chorus Pt. 22",
      "Walk Em Down",
      "Camelot",
      "Shotta Flow 5"
    ],
    "riaaCertifications": {
      "platinum": 3,
      "gold": 2,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/5RP3Os6nFBDKGT0MoQdFZD",
      "instagram": "https://instagram.com/nlechoppa",
      "twitter": "https://twitter.com/NLEChoppa"
    },
    "streamingPlatforms": []
  },
  {
    "id": "85",
    "name": "Rich The Kid",
    "slug": "rich-the-kid",
    "tagline": "Rich Forever — ATL luxury trap star",
    "bio": "Dimitri Roger, born July 9, 1992, in Queens, New York and raised in Atlanta, Georgia. His 2018 debut The World Is Yours produced the viral hit Plug Walk. He founded the Rich Forever Music label.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Rich_the_Kid_2018.jpg/440px-Rich_the_Kid_2018.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Rich_the_Kid_2018.jpg/440px-Rich_the_Kid_2018.jpg",
    "genres": [
      "Hip-Hop",
      "Trap"
    ],
    "country": "USA",
    "monthlyListeners": 7000000,
    "totalStreams": 1500000000,
    "grammyWins": 0,
    "isVerified": false,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Plug Walk",
      "Dead Friends",
      "New Freezer",
      "Splashin",
      "Every Season"
    ],
    "riaaCertifications": {
      "platinum": 3,
      "gold": 2,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/1pPmIToKXyGdsCF6LmqLmI",
      "instagram": "https://www.instagram.com/richthekid",
      "twitter": "https://twitter.com/richthekid",
      "youtube": "https://www.youtube.com/channel/UCvTEOPrdg8f_mufsqH3VGQw",
      "apple": "https://music.apple.com/us/artist/rich-the-kid/561444659",
      "website": "http://www.richforevermusic.com"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-85",
        "name": "Official Website",
        "url": "http://www.richforevermusic.com"
      },
      {
        "id": "sp-spot-85",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/1pPmIToKXyGdsCF6LmqLmI"
      },
      {
        "id": "sp-app-85",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/rich-the-kid/561444659"
      },
      {
        "id": "sp-yt-85",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UCvTEOPrdg8f_mufsqH3VGQw"
      }
    ]
  },
  {
    "id": "86",
    "name": "Lil Tecca",
    "slug": "lil-tecca",
    "tagline": "We Love You Tecca — Queens melodic rap phenom",
    "bio": "Tyler-Justin Anthony Sharpe, born August 26, 2002, in Jamaica, Queens, New York. He gained overnight fame at 16 with his 2019 single Ransom, which reached number four on the Billboard Hot 100.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Lil_Tecca_2022.jpg/440px-Lil_Tecca_2022.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Lil_Tecca_2022.jpg/440px-Lil_Tecca_2022.jpg",
    "genres": [
      "Hip-Hop",
      "Melodic Rap"
    ],
    "country": "USA",
    "monthlyListeners": 12000000,
    "totalStreams": 2500000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Ransom",
      "Did It Again",
      "Out of Love",
      "Dolly",
      "500lbs"
    ],
    "riaaCertifications": {
      "platinum": 4,
      "gold": 3,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/4PDpGtF16XpqvXxsHFgoe4",
      "instagram": "https://instagram.com/lil_tecca",
      "twitter": "https://twitter.com/lil_tecca"
    },
    "streamingPlatforms": []
  },
  {
    "id": "87",
    "name": "Soulja Boy",
    "slug": "soulja-boy",
    "tagline": "Big Draco — The original viral rap king",
    "bio": "DeAndre Cortez Way, born July 28, 1990, raised in Atlanta, Georgia. His debut single Crank That (Soulja Boy) (2007) spent seven weeks at number one. He pioneered the use of YouTube and MySpace to promote music, establishing the template for the modern music industry.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Soulja_Boy_2018_%28cropped%29.jpg/440px-Soulja_Boy_2018_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Soulja_Boy_2018_%28cropped%29.jpg/440px-Soulja_Boy_2018_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "Trap"
    ],
    "country": "USA",
    "monthlyListeners": 8000000,
    "totalStreams": 2000000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "OPEN",
    "topSongs": [
      "Crank That Soulja Boy",
      "Kiss Me Thru the Phone",
      "Turn My Swag On",
      "Pretty Boy Swag",
      "BAPE"
    ],
    "riaaCertifications": {
      "platinum": 6,
      "gold": 4,
      "diamond": 1
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/6GMYJwaziB4ekv1Y6wCDWS",
      "instagram": "https://www.instagram.com/souljaboy",
      "twitter": "https://twitter.com/souljaboy",
      "youtube": "https://www.youtube.com/@SouljaBoy",
      "website": "http://www.thedeandreway.com",
      "apple": "https://music.apple.com/us/artist/soulja-boy-tell-em/262580790"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-87",
        "name": "Official Website",
        "url": "http://www.thedeandreway.com"
      },
      {
        "id": "sp-spot-87",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/6GMYJwaziB4ekv1Y6wCDWS"
      },
      {
        "id": "sp-app-87",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/soulja-boy-tell-em/262580790"
      },
      {
        "id": "sp-yt-87",
        "name": "YouTube",
        "url": "https://www.youtube.com/@SouljaBoy"
      }
    ]
  },
  {
    "id": "88",
    "name": "Migos",
    "slug": "migos",
    "tagline": "Culture — Atlanta's triplet flow trio",
    "bio": "Migos is an American hip hop trio from Lawrenceville, Georgia, composed of Quavo, Offset, and the late Takeoff. Their triplet flow technique revolutionized modern rap. Albums Culture (2017) and Culture II (2018) both debuted at number one. Their hit Bad and Boujee spent three weeks at number one.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Quavo_2019_%28cropped%29.jpg/440px-Quavo_2019_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Quavo_2019_%28cropped%29.jpg/440px-Quavo_2019_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "Trap"
    ],
    "country": "USA",
    "monthlyListeners": 15000000,
    "totalStreams": 4000000000,
    "grammyWins": 0,
    "isVerified": true,
    "isFeatured": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Bad and Boujee",
      "T-Shirt",
      "Motorsport",
      "Walk It Talk It",
      "Flooded"
    ],
    "riaaCertifications": {
      "platinum": 12,
      "gold": 8,
      "diamond": 1
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/6oMuImdp5ZcFhWP0ESe6mG",
      "instagram": "https://www.instagram.com/migos",
      "twitter": "https://twitter.com/Migos",
      "youtube": "https://www.youtube.com/channel/UC9YcTIQuhwgoOQqYMKYqW9A",
      "apple": "https://music.apple.com/us/artist/migos/569925101",
      "website": "http://migosofficial.com/"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-88",
        "name": "Official Website",
        "url": "http://migosofficial.com/"
      },
      {
        "id": "sp-spot-88",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/6oMuImdp5ZcFhWP0ESe6mG"
      },
      {
        "id": "sp-app-88",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/migos/569925101"
      },
      {
        "id": "sp-yt-88",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UC9YcTIQuhwgoOQqYMKYqW9A"
      }
    ]
  },
  {
    "id": "89",
    "name": "Offset",
    "slug": "offset",
    "tagline": "Father of 4 — Migos style icon",
    "bio": "Kiari Kendrell Cephus, born December 14, 1991, in Lawrenceville, Georgia. A member of Migos known for his precise, rapid-fire delivery and adventurous fashion sense. His solo album Father of 4 (2019) debuted in the top five.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Offset_2019_%28cropped%29.jpg/440px-Offset_2019_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Offset_2019_%28cropped%29.jpg/440px-Offset_2019_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "Trap"
    ],
    "country": "USA",
    "monthlyListeners": 10000000,
    "totalStreams": 2500000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Bad and Boujee",
      "Clout",
      "Red Room",
      "Coming In Hot",
      "Quarter Milli"
    ],
    "riaaCertifications": {
      "platinum": 8,
      "gold": 5,
      "diamond": 1
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/4DdkRBBYG6Yk9Ka8tdJ9BW",
      "instagram": "https://www.instagram.com/offsetyrn",
      "twitter": "https://twitter.com/OffsetYRN",
      "youtube": "https://www.youtube.com/channel/UCLRm9H9a-2bAna0E-r5n8pg",
      "website": "https://offsetofficial.com",
      "apple": "https://music.apple.com/us/artist/offset/930129219"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-89",
        "name": "Official Website",
        "url": "https://offsetofficial.com"
      },
      {
        "id": "sp-spot-89",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/4DdkRBBYG6Yk9Ka8tdJ9BW"
      },
      {
        "id": "sp-app-89",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/offset/930129219"
      },
      {
        "id": "sp-yt-89",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UCLRm9H9a-2bAna0E-r5n8pg"
      }
    ]
  },
  {
    "id": "90",
    "name": "Yung Gravy",
    "slug": "yung-gravy",
    "tagline": "Mr. Clean — Minnesota viral rap entertainer",
    "bio": "Matthew Raymond Hauri, born March 19, 1996, in Rochester, Minnesota. He rose to fame through SoundCloud with tracks like Mr. Clean (2016). His consistent viral success on TikTok has made him one of the most entertaining self-aware figures in rap.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Yung_Gravy_2022.jpg/440px-Yung_Gravy_2022.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Yung_Gravy_2022.jpg/440px-Yung_Gravy_2022.jpg",
    "genres": [
      "Hip-Hop",
      "Pop Rap",
      "Alternative Rap"
    ],
    "country": "USA",
    "monthlyListeners": 8000000,
    "totalStreams": 1800000000,
    "grammyWins": 0,
    "isVerified": false,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Mr. Clean",
      "1 Thot 2 Thot",
      "Gravy Train",
      "Betty Get Money",
      "Oops!!"
    ],
    "riaaCertifications": {
      "platinum": 2,
      "gold": 2,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/2YOYua8FpudSEiB9s88IgQ",
      "instagram": "https://www.instagram.com/yunggravy",
      "twitter": "https://twitter.com/yunggravy",
      "youtube": "https://www.youtube.com/channel/UCLQPinZNWKlLBF7C_m2YP3g",
      "apple": "https://music.apple.com/us/artist/yung-gravy/1165036761",
      "website": "https://creamium.net/"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-90",
        "name": "Official Website",
        "url": "https://creamium.net/"
      },
      {
        "id": "sp-spot-90",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/2YOYua8FpudSEiB9s88IgQ"
      },
      {
        "id": "sp-app-90",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/yung-gravy/1165036761"
      },
      {
        "id": "sp-yt-90",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UCLQPinZNWKlLBF7C_m2YP3g"
      }
    ]
  },
  {
    "id": "91",
    "name": "Larry June",
    "slug": "larry-june",
    "tagline": "Orange Season — San Francisco health-conscious rapper",
    "bio": "Larry June, born in San Francisco, California. His collaborative album The Great Escape (2023) with The Alchemist received widespread critical acclaim. Known for promoting eating well, working out, and building wealth through his music.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Vince_Staples_2018_%28cropped%29.jpg/440px-Vince_Staples_2018_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Vince_Staples_2018_%28cropped%29.jpg/440px-Vince_Staples_2018_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "West Coast Rap",
      "Alternative Rap"
    ],
    "country": "USA",
    "monthlyListeners": 2000000,
    "totalStreams": 400000000,
    "grammyWins": 0,
    "isVerified": false,
    "labelStatus": "OPEN",
    "topSongs": [
      "Whole Foods",
      "Smoothies in the Morning",
      "San Francisco Rush",
      "Let It Breath",
      "March"
    ],
    "riaaCertifications": {
      "platinum": 0,
      "gold": 0,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/1grN0519h2zYqpRtYbDZAl",
      "instagram": "https://www.instagram.com/larryjunetfm",
      "twitter": "https://twitter.com/larryjunetfm",
      "youtube": "https://www.youtube.com/channel/UCMAWWX5HmFvC06IKmY0PiGQ",
      "website": "https://larry-june.com/",
      "apple": "https://music.apple.com/us/artist/larry-june/891636233"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-91",
        "name": "Official Website",
        "url": "https://larry-june.com/"
      },
      {
        "id": "sp-spot-91",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/1grN0519h2zYqpRtYbDZAl"
      },
      {
        "id": "sp-app-91",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/larry-june/891636233"
      },
      {
        "id": "sp-yt-91",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UCMAWWX5HmFvC06IKmY0PiGQ"
      }
    ]
  },
  {
    "id": "92",
    "name": "Lil Keed",
    "slug": "lil-keed",
    "tagline": "Long Live Mexico — Young Thug protege",
    "bio": "Raqhid Render, born March 16, 1998, in Atlanta, Georgia. A member of Young Thug's YSL Records. He tragically passed away on May 13, 2022. His posthumous album Long Live Mexico was released in his honor.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Lil_Keed_2019.jpg/440px-Lil_Keed_2019.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Lil_Keed_2019.jpg/440px-Lil_Keed_2019.jpg",
    "genres": [
      "Hip-Hop",
      "Trap",
      "Melodic Rap"
    ],
    "country": "USA",
    "monthlyListeners": 3000000,
    "totalStreams": 700000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "ALUMNI",
    "topSongs": [
      "Nameless",
      "Fetish",
      "Average Joe",
      "Proud of Me",
      "Hightimes"
    ],
    "riaaCertifications": {
      "platinum": 1,
      "gold": 1,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/3uJx5SnOM59Li7lCxA3b29",
      "instagram": "https://www.instagram.com/lilkeed",
      "youtube": "https://www.youtube.com/channel/UC84I-lVXft-Q1gmuiUQNlUw",
      "twitter": "https://twitter.com/1Lilkeed",
      "apple": "https://music.apple.com/us/artist/lil-keed/1274243279",
      "website": "https://www.keedtalktoem.com/"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-92",
        "name": "Official Website",
        "url": "https://www.keedtalktoem.com/"
      },
      {
        "id": "sp-spot-92",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/3uJx5SnOM59Li7lCxA3b29"
      },
      {
        "id": "sp-app-92",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/lil-keed/1274243279"
      },
      {
        "id": "sp-yt-92",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UC84I-lVXft-Q1gmuiUQNlUw"
      }
    ]
  },
  {
    "id": "93",
    "name": "Rod Wave",
    "slug": "rod-wave",
    "tagline": "Pray 4 Love — Florida emotional rap wave",
    "bio": "Rodarius Marcell Green, born August 27, 1999, in St. Petersburg, Florida. His 2021 album SoulFly debuted at number one on the Billboard 200, establishing him as one of the most powerful emotional voices in rap.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Rod_Wave_2022.jpg/440px-Rod_Wave_2022.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Rod_Wave_2022.jpg/440px-Rod_Wave_2022.jpg",
    "genres": [
      "Hip-Hop",
      "Melodic Rap",
      "R&B"
    ],
    "country": "USA",
    "monthlyListeners": 18000000,
    "totalStreams": 3500000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Heart on Ice",
      "Tombstone",
      "Richer",
      "Pray 4 Love",
      "Cold December"
    ],
    "riaaCertifications": {
      "platinum": 6,
      "gold": 4,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/45TgXXqMDdF8BkjA83OM7z",
      "instagram": "https://www.instagram.com/rodwave",
      "twitter": "https://twitter.com/rodwave",
      "youtube": "https://www.youtube.com/channel/UCenjunBhBhvKjfDAESnoppw",
      "website": "https://officialrodwave.com",
      "apple": "https://music.apple.com/us/artist/rod-wave/1188439369"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-93",
        "name": "Official Website",
        "url": "https://officialrodwave.com"
      },
      {
        "id": "sp-spot-93",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/45TgXXqMDdF8BkjA83OM7z"
      },
      {
        "id": "sp-app-93",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/rod-wave/1188439369"
      },
      {
        "id": "sp-yt-93",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UCenjunBhBhvKjfDAESnoppw"
      }
    ]
  },
  {
    "id": "94",
    "name": "Sleepy Hallow",
    "slug": "sleepy-hallow",
    "tagline": "Still Sleep? — Brooklyn drill shooter",
    "bio": "Tyler Dobbins, born September 25, 2000, in Crown Heights, Brooklyn, New York. His 2021 single Still Sleep? with Sleepy Hallow went viral. He is a prominent figure in Brooklyn drill and Sheff G's group.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Pop_Smoke_2019.jpg/440px-Pop_Smoke_2019.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Pop_Smoke_2019.jpg/440px-Pop_Smoke_2019.jpg",
    "genres": [
      "Hip-Hop",
      "Drill"
    ],
    "country": "USA",
    "monthlyListeners": 5000000,
    "totalStreams": 1000000000,
    "grammyWins": 0,
    "isVerified": false,
    "labelStatus": "SIGNED",
    "topSongs": [
      "2055",
      "Deep End Freestyle",
      "Tip Toe",
      "Still Sleep?",
      "Comp"
    ],
    "riaaCertifications": {
      "platinum": 2,
      "gold": 1,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/6EPlBSH2RSiettczlz7ihV",
      "instagram": "https://www.instagram.com/_sleepyhallow_",
      "twitter": "https://twitter.com/SleepyHallow83",
      "youtube": "https://www.youtube.com/channel/UCch8r_8Io6XK-d5QGkkGZLA",
      "website": "https://www.stillsleep.com/"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-94",
        "name": "Official Website",
        "url": "https://www.stillsleep.com/"
      },
      {
        "id": "sp-spot-94",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/6EPlBSH2RSiettczlz7ihV"
      },
      {
        "id": "sp-yt-94",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UCch8r_8Io6XK-d5QGkkGZLA"
      }
    ]
  },
  {
    "id": "95",
    "name": "Tee Grizzley",
    "slug": "tee-grizzley",
    "tagline": "Detroit's Storyteller & Street Lyricist",
    "bio": "Terry Sanchez Wallace Jr., known professionally as Tee Grizzley, is an American rapper from Detroit, Michigan. He broke out with his viral platinum hit 'First Day Out' and has since become one of Detroit hip-hop's foundational voices.",
    "avatarUrl": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=800&q=80",
    "heroUrl": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1920&q=80",
    "genres": [
      "Hip-Hop"
    ],
    "country": "United States",
    "countryFlag": "🇺🇸",
    "isVerified": true,
    "isFeatured": false,
    "labelStatus": "SIGNED",
    "monthlyListeners": 8900000,
    "totalStreams": 3400000000,
    "grammyWins": 0,
    "topSongs": [
      "First Day Out",
      "From the D to the A",
      "Locked Up",
      "Robbery",
      "Colors"
    ],
    "riaaCertifications": {
      "platinum": 4,
      "gold": 6,
      "diamond": 0
    },
    "latestReleaseTitle": "Tee's Coney Island",
    "latestReleaseDate": "2023-11-03",
    "socials": {
      "spotify": "https://open.spotify.com/artist/6AUl0ykLLpvTktob97x9hO",
      "youtube": "https://www.youtube.com/channel/UCz015ho6P0Ooo7IZFyQU7fw",
      "instagram": "https://www.instagram.com/teegrizzley",
      "twitter": "https://twitter.com/Tee_Grizzley",
      "website": "https://teegrizzley.com",
      "apple": "https://music.apple.com/us/artist/tee-grizzley/1169824859"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-95",
        "name": "Official Website",
        "url": "https://teegrizzley.com"
      },
      {
        "id": "sp-spot-95",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/6AUl0ykLLpvTktob97x9hO"
      },
      {
        "id": "sp-app-95",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/tee-grizzley/1169824859"
      },
      {
        "id": "sp-yt-95",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UCz015ho6P0Ooo7IZFyQU7fw"
      }
    ]
  },
  {
    "id": "96",
    "name": "BIA",
    "slug": "bia",
    "tagline": "Whole Lotta Money — Boston Latina rap queen",
    "bio": "Bianca Landrau, born February 29, 1988, in Boston, Massachusetts. She rose to fame with her WHOLE LOTTA MONEY remix featuring Nicki Minaj. She is one of the few prominent Latina rappers in mainstream hip-hop.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Cardi_B_2019_%28cropped%29.jpg/440px-Cardi_B_2019_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Cardi_B_2019_%28cropped%29.jpg/440px-Cardi_B_2019_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "Trap"
    ],
    "country": "USA",
    "monthlyListeners": 4000000,
    "totalStreams": 800000000,
    "grammyWins": 0,
    "isVerified": false,
    "labelStatus": "SIGNED",
    "topSongs": [
      "WHOLE LOTTA MONEY",
      "WHOLE LOTTA MONEY (feat. Nicki Minaj)",
      "Besito",
      "FALLBACK",
      "Six Sixteen"
    ],
    "riaaCertifications": {
      "platinum": 2,
      "gold": 1,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/6veh5zbFpm31XsPdjBgPER",
      "instagram": "https://www.instagram.com/bia",
      "twitter": "https://twitter.com/BIABIA",
      "youtube": "https://www.youtube.com/channel/UCzliE133pF8KhDiNKnIJ_dA",
      "apple": "https://music.apple.com/us/artist/bia/1112309486",
      "website": "https://www.officialbia.com/"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-96",
        "name": "Official Website",
        "url": "https://www.officialbia.com/"
      },
      {
        "id": "sp-spot-96",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/6veh5zbFpm31XsPdjBgPER"
      },
      {
        "id": "sp-app-96",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/bia/1112309486"
      },
      {
        "id": "sp-yt-96",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UCzliE133pF8KhDiNKnIJ_dA"
      }
    ]
  },
  {
    "id": "97",
    "name": "Stunna Girl",
    "slug": "stunna-girl",
    "tagline": "Sacramento realest female rap voice",
    "bio": "Suzanna Aundrea Harpool, born November 11, 1997, in Sacramento, California. Her 2019 song Runway went viral on social media and introduced her to a national audience. She signed to Republic Records.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Latto_2022_%28cropped%29.jpg/440px-Latto_2022_%28cropped%29.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Latto_2022_%28cropped%29.jpg/440px-Latto_2022_%28cropped%29.jpg",
    "genres": [
      "Hip-Hop",
      "Trap",
      "West Coast Rap"
    ],
    "country": "USA",
    "monthlyListeners": 2000000,
    "totalStreams": 400000000,
    "grammyWins": 0,
    "isVerified": false,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Runway",
      "Like That",
      "No Competition",
      "Best Feature",
      "Rich"
    ],
    "riaaCertifications": {
      "platinum": 1,
      "gold": 0,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/4eEkR7IDAXyGngHvnJZpdV",
      "instagram": "https://www.instagram.com/stunnagirl",
      "youtube": "https://www.youtube.com/channel/UC1sYs-TMZs4KFChMIIxtiZQ",
      "apple": "https://music.apple.com/us/artist/stunna-girl/1321595123"
    },
    "streamingPlatforms": [
      {
        "id": "sp-spot-97",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/4eEkR7IDAXyGngHvnJZpdV"
      },
      {
        "id": "sp-app-97",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/stunna-girl/1321595123"
      },
      {
        "id": "sp-yt-97",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UC1sYs-TMZs4KFChMIIxtiZQ"
      }
    ]
  },
  {
    "id": "98",
    "name": "Smokepurpp",
    "slug": "smokepurpp",
    "tagline": "Florida Man — Miami SoundCloud pioneer",
    "bio": "Omar Jeffery Pineiro, born May 15, 1997, in Miami, Florida. He was a pioneering figure in the SoundCloud rap movement of the mid-2010s alongside Lil Pump and XXXTentacion. His major label debut Deadstar (2018) was a commercial success.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Smokepurpp_2018.jpg/440px-Smokepurpp_2018.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Smokepurpp_2018.jpg/440px-Smokepurpp_2018.jpg",
    "genres": [
      "Hip-Hop",
      "SoundCloud Rap",
      "Trap"
    ],
    "country": "USA",
    "monthlyListeners": 3000000,
    "totalStreams": 700000000,
    "grammyWins": 0,
    "isVerified": false,
    "labelStatus": "OPEN",
    "topSongs": [
      "Audi",
      "123",
      "Do Not Disturb",
      "Nephew",
      "34"
    ],
    "riaaCertifications": {
      "platinum": 1,
      "gold": 1,
      "diamond": 0
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/21dooacK2WGBB5amYvKyfM",
      "instagram": "https://www.instagram.com/smokepurpp",
      "twitter": "https://twitter.com/smokepurpp",
      "youtube": "https://www.youtube.com/channel/UCVg18zoqoJL_9RwO3JXWBmA",
      "apple": "https://music.apple.com/us/artist/smokepurpp/1122104172"
    },
    "streamingPlatforms": [
      {
        "id": "sp-spot-98",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/21dooacK2WGBB5amYvKyfM"
      },
      {
        "id": "sp-app-98",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/smokepurpp/1122104172"
      },
      {
        "id": "sp-yt-98",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UCVg18zoqoJL_9RwO3JXWBmA"
      }
    ]
  },
  {
    "id": "99",
    "name": "Internet Money",
    "slug": "internet-money",
    "tagline": "Trillion dollar label — Taz Taylor's production empire",
    "bio": "Internet Money is a record label and production collective founded by Taz Taylor. The label has produced and released music featuring Juice WRLD, Lil Tecca, Gunna, and Wiz Khalifa. Their debut album B4 The Storm (2020) debuted at number three.",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Lil_Tecca_2022.jpg/440px-Lil_Tecca_2022.jpg",
    "heroUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Lil_Tecca_2022.jpg/440px-Lil_Tecca_2022.jpg",
    "genres": [
      "Hip-Hop",
      "Trap"
    ],
    "country": "USA",
    "monthlyListeners": 6000000,
    "totalStreams": 1500000000,
    "grammyWins": 0,
    "isVerified": true,
    "labelStatus": "SIGNED",
    "topSongs": [
      "Lemonade",
      "Thrusting",
      "His & Hers",
      "Blastoff",
      "Somebody"
    ],
    "riaaCertifications": {
      "platinum": 5,
      "gold": 3,
      "diamond": 1
    },
    "socials": {
      "spotify": "https://open.spotify.com/artist/6MPCFvOQv5cIGfw3jODMF0",
      "youtube": "https://www.youtube.com/@InternetMoneyRecords",
      "instagram": "https://www.instagram.com/internetmoneyrecords",
      "twitter": "https://twitter.com/InternetMoney",
      "website": "https://internetmoneyrecords.com",
      "apple": "https://music.apple.com/us/artist/internet-money/1435212579"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-99",
        "name": "Official Website",
        "url": "https://internetmoneyrecords.com"
      },
      {
        "id": "sp-spot-99",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/6MPCFvOQv5cIGfw3jODMF0"
      },
      {
        "id": "sp-app-99",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/internet-money/1435212579"
      },
      {
        "id": "sp-yt-99",
        "name": "YouTube",
        "url": "https://www.youtube.com/@InternetMoneyRecords"
      }
    ]
  },
  {
    "id": "100",
    "name": "Gunna",
    "slug": "gunna",
    "tagline": "Drip Season — Atlanta Melodic Titan",
    "bio": "Sergio Giavanni Kitchens, known professionally as Gunna, is an American rapper from College Park, Georgia. Known for his effortless flow and melodic cadence, he has topped the Billboard 200 multiple times with albums like 'Wunna' and 'DS4Ever'.",
    "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    "heroUrl": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1920&q=80",
    "genres": [
      "Hip-Hop"
    ],
    "country": "United States",
    "countryFlag": "🇺🇸",
    "isVerified": true,
    "isFeatured": false,
    "labelStatus": "SIGNED",
    "monthlyListeners": 32000000,
    "totalStreams": 12000000000,
    "grammyWins": 0,
    "topSongs": [
      "fukumean",
      "Drip Too Hard",
      "pushin P",
      "Dollaz on My Head",
      "Top Off"
    ],
    "riaaCertifications": {
      "platinum": 18,
      "gold": 12,
      "diamond": 1
    },
    "latestReleaseTitle": "One of Wun",
    "latestReleaseDate": "2024-05-10",
    "socials": {
      "spotify": "https://open.spotify.com/artist/2hlmm7s2ICUX0LVIhVFlZQ",
      "youtube": "https://www.youtube.com/channel/UCAkIMkEaa9sZmjcy7mfd5lQ",
      "instagram": "https://www.instagram.com/gunna",
      "twitter": "https://twitter.com/1GunnaGunna",
      "website": "https://gunnamusic.com",
      "apple": "https://music.apple.com/us/artist/gunna/1236248981"
    },
    "streamingPlatforms": [
      {
        "id": "sp-web-100",
        "name": "Official Website",
        "url": "https://gunnamusic.com"
      },
      {
        "id": "sp-spot-100",
        "name": "Spotify",
        "url": "https://open.spotify.com/artist/2hlmm7s2ICUX0LVIhVFlZQ"
      },
      {
        "id": "sp-app-100",
        "name": "Apple Music",
        "url": "https://music.apple.com/us/artist/gunna/1236248981"
      },
      {
        "id": "sp-yt-100",
        "name": "YouTube",
        "url": "https://www.youtube.com/channel/UCAkIMkEaa9sZmjcy7mfd5lQ"
      }
    ]
  }
];

const allMockArtists = [...artists, ...artistsPart2];
export default allMockArtists;
