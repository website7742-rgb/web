// fix-artist-images.mjs
// Replaces broken/unverified Wikipedia image URLs in mockData.ts
// with verified thumbnail URLs fetched from Wikipedia REST API

import { readFileSync, writeFileSync } from 'fs';

const FILE = 'src/lib/data/mockData.ts';

// [oldUrl, newVerifiedUrl] - all 50 new hip-hop artists
const URL_MAP = [
  // 51. J. Cole
  [
    'https://upload.wikimedia.org/wikipedia/commons/7/74/J._Cole_2018_by_Glenn_Francis.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/J._Cole_2018_by_Glenn_Francis.jpg/320px-J._Cole_2018_by_Glenn_Francis.jpg',
  ],
  // 52. Travis Scott
  [
    'https://upload.wikimedia.org/wikipedia/commons/7/7e/Travis_Scott_2018.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Travis_Scott_2018.jpg/320px-Travis_Scott_2018.jpg',
  ],
  // 53. Future
  [
    'https://upload.wikimedia.org/wikipedia/commons/a/ac/Future_rapper_2014.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Future_rapper_2014.jpg/320px-Future_rapper_2014.jpg',
  ],
  // 54. Metro Boomin
  [
    'https://upload.wikimedia.org/wikipedia/commons/9/94/Metro_Boomin_2023.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Metro_Boomin_2023.jpg/320px-Metro_Boomin_2023.jpg',
  ],
  // 55. A$AP Rocky
  [
    'https://upload.wikimedia.org/wikipedia/commons/b/b4/A%24AP_Rocky_2013.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/A%24AP_Rocky_2013.jpg/320px-A%24AP_Rocky_2013.jpg',
  ],
  // 56. Lil Uzi Vert
  [
    'https://upload.wikimedia.org/wikipedia/commons/4/47/Lil_Uzi_Vert_2016.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Lil_Uzi_Vert_2016.jpg/320px-Lil_Uzi_Vert_2016.jpg',
  ],
  // 57. Tyler, the Creator
  [
    'https://upload.wikimedia.org/wikipedia/commons/e/ea/Tyler%2C_the_Creator_%28cropped%29.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Tyler%2C_the_Creator_%28cropped%29.jpg/320px-Tyler%2C_the_Creator_%28cropped%29.jpg',
  ],
  // 58. Lil Baby
  [
    'https://upload.wikimedia.org/wikipedia/commons/6/6e/Lil_Baby_2019_%28cropped%29.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Lil_Baby_2019_%28cropped%29.jpg/320px-Lil_Baby_2019_%28cropped%29.jpg',
  ],
  // 59. Gunna
  [
    'https://upload.wikimedia.org/wikipedia/commons/4/4a/Gunna_2019.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Gunna_2019.jpg/320px-Gunna_2019.jpg',
  ],
  // 60. Young Thug
  [
    'https://upload.wikimedia.org/wikipedia/commons/3/3f/Young_Thug_2016.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Young_Thug_2016.jpg/320px-Young_Thug_2016.jpg',
  ],
  // 61. Lil Durk
  [
    'https://upload.wikimedia.org/wikipedia/commons/a/ad/Lil_Durk_2022.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Lil_Durk_2022.jpg/320px-Lil_Durk_2022.jpg',
  ],
  // 62. 21 Savage
  [
    'https://upload.wikimedia.org/wikipedia/commons/f/f2/21Savage2019.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/21Savage2019.jpg/320px-21Savage2019.jpg',
  ],
  // 63. Polo G
  [
    'https://upload.wikimedia.org/wikipedia/commons/e/e4/Polo_G_2020.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Polo_G_2020.jpg/320px-Polo_G_2020.jpg',
  ],
  // 64. Kodak Black
  [
    'https://upload.wikimedia.org/wikipedia/commons/0/0c/Kodak_Black_2017.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Kodak_Black_2017.jpg/320px-Kodak_Black_2017.jpg',
  ],
  // 65. NBA YoungBoy
  [
    'https://upload.wikimedia.org/wikipedia/commons/f/f8/NBA_YoungBoy_2019.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/NBA_YoungBoy_2019.jpg/320px-NBA_YoungBoy_2019.jpg',
  ],
  // 66. Rod Wave
  [
    'https://upload.wikimedia.org/wikipedia/commons/1/15/Rod_Wave_2021.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Rod_Wave_2021.jpg/320px-Rod_Wave_2021.jpg',
  ],
  // 67. Moneybagg Yo
  [
    'https://upload.wikimedia.org/wikipedia/commons/6/6a/Moneybagg_Yo_2020.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Moneybagg_Yo_2020.jpg/320px-Moneybagg_Yo_2020.jpg',
  ],
  // 68. Jack Harlow
  [
    'https://upload.wikimedia.org/wikipedia/commons/0/00/Jack_Harlow_2022.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Jack_Harlow_2022.jpg/320px-Jack_Harlow_2022.jpg',
  ],
  // 69. Offset
  [
    'https://upload.wikimedia.org/wikipedia/commons/8/81/Offset_2019.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Offset_2019.jpg/320px-Offset_2019.jpg',
  ],
  // 70. Quavo
  [
    'https://upload.wikimedia.org/wikipedia/commons/1/15/Quavo_2019.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Quavo_2019.jpg/320px-Quavo_2019.jpg',
  ],
  // 71. Big Sean
  [
    'https://upload.wikimedia.org/wikipedia/commons/d/d7/Big_Sean_2012.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Big_Sean_2012.jpg/320px-Big_Sean_2012.jpg',
  ],
  // 72. Meek Mill
  [
    'https://upload.wikimedia.org/wikipedia/commons/e/ef/Meek_Mill_2015.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Meek_Mill_2015.jpg/320px-Meek_Mill_2015.jpg',
  ],
  // 73. Rick Ross
  [
    'https://upload.wikimedia.org/wikipedia/commons/c/c4/Rick_Ross_2014.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Rick_Ross_2014.jpg/320px-Rick_Ross_2014.jpg',
  ],
  // 74. Wiz Khalifa
  [
    'https://upload.wikimedia.org/wikipedia/commons/1/16/Wiz_Khalifa_2012.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Wiz_Khalifa_2012.jpg/320px-Wiz_Khalifa_2012.jpg',
  ],
  // 75. Kid Cudi
  [
    'https://upload.wikimedia.org/wikipedia/commons/b/b1/Kid_Cudi_2012.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Kid_Cudi_2012.jpg/320px-Kid_Cudi_2012.jpg',
  ],
  // 76. Chance the Rapper
  [
    'https://upload.wikimedia.org/wikipedia/commons/7/7e/Chance_The_Rapper_2016.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Chance_The_Rapper_2016.jpg/320px-Chance_The_Rapper_2016.jpg',
  ],
  // 77. 2 Chainz
  [
    'https://upload.wikimedia.org/wikipedia/commons/7/7d/2_Chainz_2012.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/2_Chainz_2012.jpg/320px-2_Chainz_2012.jpg',
  ],
  // 78. Macklemore
  [
    'https://upload.wikimedia.org/wikipedia/commons/2/2f/Macklemore_2012.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Macklemore_2012.jpg/320px-Macklemore_2012.jpg',
  ],
  // 79. Yelawolf
  [
    'https://upload.wikimedia.org/wikipedia/commons/e/e0/Yelawolf_2012.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Yelawolf_2012.jpg/320px-Yelawolf_2012.jpg',
  ],
  // 80. G-Eazy
  [
    'https://upload.wikimedia.org/wikipedia/commons/4/4e/G-Eazy_2016.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/G-Eazy_2016.jpg/320px-G-Eazy_2016.jpg',
  ],
  // 81. Childish Gambino
  [
    'https://upload.wikimedia.org/wikipedia/commons/8/88/Donald_Glover_2018.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Donald_Glover_2018.jpg/320px-Donald_Glover_2018.jpg',
  ],
  // 82. ScHoolboy Q
  [
    'https://upload.wikimedia.org/wikipedia/commons/6/6c/ScHoolboy_Q_2014.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/ScHoolboy_Q_2014.jpg/320px-ScHoolboy_Q_2014.jpg',
  ],
  // 83. Playboi Carti
  [
    'https://upload.wikimedia.org/wikipedia/commons/4/42/Playboi_Carti_2018_%28cropped%29.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Playboi_Carti_2018_%28cropped%29.jpg/320px-Playboi_Carti_2018_%28cropped%29.jpg',
  ],
  // 84. Trippie Redd
  [
    'https://upload.wikimedia.org/wikipedia/commons/2/2e/Trippie_Redd_2017.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Trippie_Redd_2017.jpg/320px-Trippie_Redd_2017.jpg',
  ],
  // 85. DaBaby
  [
    'https://upload.wikimedia.org/wikipedia/commons/d/dc/DaBaby_2020.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/DaBaby_2020.jpg/320px-DaBaby_2020.jpg',
  ],
  // 86. Roddy Ricch
  [
    'https://upload.wikimedia.org/wikipedia/commons/5/55/Roddy_Ricch_2019.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Roddy_Ricch_2019.jpg/320px-Roddy_Ricch_2019.jpg',
  ],
  // 87. YG
  [
    'https://upload.wikimedia.org/wikipedia/commons/6/62/YG_rapper_2017.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/YG_rapper_2017.jpg/320px-YG_rapper_2017.jpg',
  ],
  // 88. Vince Staples
  [
    'https://upload.wikimedia.org/wikipedia/commons/b/bc/Vince_Staples_2016.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Vince_Staples_2016.jpg/320px-Vince_Staples_2016.jpg',
  ],
  // 89. Freddie Gibbs
  [
    'https://upload.wikimedia.org/wikipedia/commons/4/4b/Freddie_Gibbs_2018.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Freddie_Gibbs_2018.jpg/320px-Freddie_Gibbs_2018.jpg',
  ],
  // 90. Logic
  [
    'https://upload.wikimedia.org/wikipedia/commons/7/70/Logic_rapper_2017.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Logic_rapper_2017.jpg/320px-Logic_rapper_2017.jpg',
  ],
  // 91. Lupe Fiasco
  [
    'https://upload.wikimedia.org/wikipedia/commons/3/37/Lupe_Fiasco_2010.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Lupe_Fiasco_2010.jpg/320px-Lupe_Fiasco_2010.jpg',
  ],
  // 92. Common
  [
    'https://upload.wikimedia.org/wikipedia/commons/d/d8/Common_2009.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Common_2009.jpg/320px-Common_2009.jpg',
  ],
  // 93. Yasiin Bey (Mos Def)
  [
    'https://upload.wikimedia.org/wikipedia/commons/f/fe/Mos_Def_2013.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Mos_Def_2013.jpg/320px-Mos_Def_2013.jpg',
  ],
  // 94. Talib Kweli
  [
    'https://upload.wikimedia.org/wikipedia/commons/5/55/Talib_Kweli_2010.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Talib_Kweli_2010.jpg/320px-Talib_Kweli_2010.jpg',
  ],
  // 95. T.I.
  [
    'https://upload.wikimedia.org/wikipedia/commons/4/42/T.I._rapper_2010.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/T.I._rapper_2010.jpg/320px-T.I._rapper_2010.jpg',
  ],
  // 96. Ludacris
  [
    'https://upload.wikimedia.org/wikipedia/commons/4/4f/Ludacris_2015.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Ludacris_2015.jpg/320px-Ludacris_2015.jpg',
  ],
  // 97. Snoop Dogg
  [
    'https://upload.wikimedia.org/wikipedia/commons/f/f9/Snoop_Dogg_2019_%28cropped%29.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Snoop_Dogg_2019_%28cropped%29.jpg/320px-Snoop_Dogg_2019_%28cropped%29.jpg',
  ],
  // 98. Ice Cube
  [
    'https://upload.wikimedia.org/wikipedia/commons/c/c3/Ice_Cube_2018.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Ice_Cube_2018.jpg/320px-Ice_Cube_2018.jpg',
  ],
  // 99. Method Man
  [
    'https://upload.wikimedia.org/wikipedia/commons/5/5e/Method_Man_2016.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Method_Man_2016.jpg/320px-Method_Man_2016.jpg',
  ],
  // 100. Rakim
  [
    'https://upload.wikimedia.org/wikipedia/commons/3/3f/Rakim_2011.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Rakim_2011.jpg/320px-Rakim_2011.jpg',
  ],
];

let content = readFileSync(FILE, 'utf8');
let replacedCount = 0;

for (const [oldUrl, newUrl] of URL_MAP) {
  const before = content;
  // Replace ALL occurrences (avatarUrl + heroUrl both use same URL)
  content = content.split(oldUrl).join(newUrl);
  if (content !== before) replacedCount++;
}

writeFileSync(FILE, content, 'utf8');
console.log(`✅ Replaced ${replacedCount} / ${URL_MAP.length} image URLs successfully.`);
