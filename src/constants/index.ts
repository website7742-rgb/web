import { VideoItem, AdItem } from '../types';
import mockArtists from './mock';

export const ARTISTS = mockArtists;

export const FALLBACK_DATA: VideoItem[] = [
  { id: 'f1',  title: "DRAKE RESPONDS TO KENDRICK DISS LIVE ON STAGE IN SHOCKING RANT!", views: "5.2M Views", posted: "2 HRS AGO",  imageUrl: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&dpr=1", videoLink: "https://worldstarhiphop.com" },
  { id: 'f2',  title: "LIL BABY SPOTTED HANDING OUT CASH IN ATLANTA HOOD!",               views: "1.2M Views", posted: "4 HRS AGO",  imageUrl: "https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&dpr=1", videoLink: "https://worldstarhiphop.com" },
  { id: 'f3',  title: "TRAVIS SCOTT MOSH PIT GOES CRAZY DURING UTOPIA TOUR IN ROME!",    views: "3.4M Views", posted: "6 HRS AGO",  imageUrl: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&dpr=1", videoLink: "https://worldstarhiphop.com" },
  { id: 'f4',  title: "FIGHT BREAKS OUT AT ROLLING LOUD MIAMI VIP SECTION!",              views: "890K Views", posted: "7 HRS AGO",  imageUrl: "https://images.pexels.com/photos/2111015/pexels-photo-2111015.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&dpr=1", videoLink: "https://worldstarhiphop.com" },
  { id: 'f5',  title: "GUNNA DROPS NEW MUSIC VIDEO FOR 'FUKUMEAN' AND IT'S A MOVIE!",    views: "2.1M Views", posted: "9 HRS AGO",  imageUrl: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&dpr=1", videoLink: "https://worldstarhiphop.com" },
  { id: 'f6',  title: "KAI CENAT BREAKS TWITCH RECORD WITH KEVIN HART!",                  views: "4.5M Views", posted: "11 HRS AGO", imageUrl: "https://images.pexels.com/photos/761963/pexels-photo-761963.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&dpr=1", videoLink: "https://worldstarhiphop.com" },
  { id: 'f7',  title: "PLAYBOI CARTI MYSTERIOUS INSTAGRAM POST HAS FANS GOING WILD",      views: "1.9M Views", posted: "12 HRS AGO", imageUrl: "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&dpr=1", videoLink: "https://worldstarhiphop.com" },
  { id: 'f8',  title: "NBA YOUNGBOY RELEASES 4TH ALBUM THIS YEAR FROM HOUSE ARREST",      views: "3.1M Views", posted: "14 HRS AGO", imageUrl: "https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&dpr=1", videoLink: "https://worldstarhiphop.com" },
  { id: 'f9',  title: "NEW MUSIC VIDEO: CHIEF KEEF RETURNS TO CHICAGO AFTER 12 YEARS!",   views: "6.2M Views", posted: "15 HRS AGO", imageUrl: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&dpr=1", videoLink: "https://worldstarhiphop.com" },
  { id: 'f10', title: "CRAZY: FAN CLIMBS STAGE AT YE (KANYE WEST) LISTENING PARTY",       views: "1.1M Views", posted: "15 HRS AGO", imageUrl: "https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&dpr=1", videoLink: "https://worldstarhiphop.com" },
  { id: 'f11', title: "FUTURE AND METRO BOOMIN ANNOUNCE JOINT TOUR DATES",                 views: "890K Views", posted: "16 HRS AGO", imageUrl: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&dpr=1", videoLink: "https://worldstarhiphop.com" },
  { id: 'f12', title: "POLICE SHUT DOWN SECRET A$AP ROCKY POP-UP SHOP IN NYC",            views: "4.5M Views", posted: "18 HRS AGO", imageUrl: "https://images.pexels.com/photos/2111015/pexels-photo-2111015.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&dpr=1", videoLink: "https://worldstarhiphop.com" },
  { id: 'f13', title: "LIL UZI VERT PREVIEWS NEW ROCK ALBUM SNIPPETS ON IG LIVE",         views: "2.3M Views", posted: "19 HRS AGO", imageUrl: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&dpr=1", videoLink: "https://worldstarhiphop.com" },
  { id: 'f14', title: "NEW MUSIC VIDEO: CENTRAL CEE - 'LONDON GRIT'",                     views: "5.1M Views", posted: "22 HRS AGO", imageUrl: "https://images.pexels.com/photos/761963/pexels-photo-761963.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&dpr=1", videoLink: "https://worldstarhiphop.com" },
  { id: 'f15', title: "RICK ROSS HOSTS MASSIVE CAR SHOW AT HIS ATLANTA MANSION",           views: "3.7M Views", posted: "23 HRS AGO", imageUrl: "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&dpr=1", videoLink: "https://worldstarhiphop.com" },
  { id: 'f16', title: "CARDI B THROWS MICROPHONE AT FAN IN LAS VEGAS!",                   views: "10.5M Views",posted: "JULY 22",    imageUrl: "https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&dpr=1", videoLink: "https://worldstarhiphop.com" },
  { id: 'f17', title: "J COLE SEEN RIDING HIS BIKE THROUGH NYC UNBOTHERED",               views: "4.2M Views", posted: "JULY 22",    imageUrl: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&dpr=1", videoLink: "https://worldstarhiphop.com" },
  { id: 'f18', title: "SNOOP DOGG SMOKING A BLUNT WHILE COMMENTATING AT OLYMPICS!",        views: "15.4M Views",posted: "JULY 22",    imageUrl: "https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&dpr=1", videoLink: "https://worldstarhiphop.com" },
  { id: 'f19', title: "MEGAN THEE STALLION TWERKING ON IG LIVE BREAKS THE INTERNET",       views: "12.3M Views",posted: "JULY 22",    imageUrl: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&dpr=1", videoLink: "https://worldstarhiphop.com" },
  { id: 'f20', title: "TYLER THE CREATOR SPOTTED SKATING IN PARIS DURING FASHION WEEK",   views: "4.8M Views", posted: "JULY 22",    imageUrl: "https://images.pexels.com/photos/2111015/pexels-photo-2111015.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&dpr=1", videoLink: "https://worldstarhiphop.com" },
];

export const AD_ITEMS: AdItem[] = [
  { id: 'ad1', isAd: true, adText: 'SPONSORED: CUBAN LINK CHAINS — 50% OFF TODAY!', cta: 'SHOP NOW' },
  { id: 'ad2', isAd: true, adText: 'ADVERTISEMENT: DESIGNER SNEAKERS MYSTERY BOX', cta: 'BUY NOW' },
  { id: 'ad3', isAd: true, adText: 'SPONSORED: HIGH YIELD SAVINGS ACCOUNT', cta: 'LEARN MORE' },
];
