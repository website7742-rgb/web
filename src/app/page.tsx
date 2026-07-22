'use client';

import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  const featuredVideo = {
    title: "EXCLUSIVE: DRAKE RESPONDS TO KENDRICK LAMAR'S DISS TRACK LIVE ON STAGE IN SHOCKING RANT!",
    views: "5,241,902 Views",
    posted: "2 HOURS AGO",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Drake_at_the_2016_Toronto_International_Film_Festival.jpg/330px-Drake_at_the_2016_Toronto_International_Film_Festival.jpg"
  };

  const todaysVideos = [
    { id: 1, title: "LIL BABY SPOTTED HANDING OUT STACKS OF CASH IN ATLANTA HOOD!", views: "1.2M Views", posted: "4 HRS AGO", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Lil_Baby_at_the_2019_BET_Awards_%28cropped%29.png/330px-Lil_Baby_at_the_2019_BET_Awards_%28cropped%29.png" },
    { id: 2, title: "TRAVIS SCOTT MOSH PIT GOES CRAZY DURING UTOPIA TOUR IN ROME!", views: "3.4M Views", posted: "6 HRS AGO", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/TravisScott-byPhilipRomano.jpg/330px-TravisScott-byPhilipRomano.jpg" },
    { id: 3, title: "FIGHT BREAKS OUT AT ROLLING LOUD MIAMI VIP SECTION!", views: "890K Views", posted: "7 HRS AGO", imageUrl: "https://images.unsplash.com/photo-1541562232579-51fca3bb4b8b?auto=format&fit=crop&w=800&q=80" },
    { id: 4, isAd: true },
    { id: 5, title: "GUNNA DROPS NEW MUSIC VIDEO FOR 'FUKUMEAN' AND IT'S A MOVIE!", views: "2.1M Views", posted: "9 HRS AGO", imageUrl: "https://images.unsplash.com/photo-1493225457124-a1a2a2952c4a?auto=format&fit=crop&w=800&q=80" },
    { id: 6, title: "KAI CENAT BREAKS TWITCH RECORD WITH KEVIN HART & DRUSKI!", views: "4.5M Views", posted: "11 HRS AGO", imageUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80" },
    { id: 7, title: "PLAYBOI CARTI MYSTERIOUS INSTAGRAM POST HAS FANS GOING WILD", views: "1.9M Views", posted: "12 HRS AGO", imageUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=800&q=80" },
    { id: 8, title: "NBA YOUNGBOY RELEASES 4TH ALBUM THIS YEAR FROM HOUSE ARREST", views: "3.1M Views", posted: "14 HRS AGO", imageUrl: "https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?auto=format&fit=crop&w=800&q=80" },
  ];

  const yesterdaysVideos = [
    { id: 9, title: "CARDI B THROWS MICROPHONE AT FAN IN LAS VEGAS AFTER GETTING SPLASHED!", views: "10.5M Views", posted: "JULY 20", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Cardi_B_in_2019_%28cropped%29.jpg/330px-Cardi_B_in_2019_%28cropped%29.jpg" },
    { id: 10, title: "J COLE SEEN RIDING HIS BIKE THROUGH NYC UNBOTHERED", views: "4.2M Views", posted: "JULY 20", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/HOTSPOTATL_-_21_Savage_%26_J.Cole_Light_Birthday_Bash_ATL_2023_On_FIRE_%28xu6HKf40MX0_-_2m38s%29_%28cropped%29.jpg/330px-HOTSPOTATL_-_21_Savage_%26_J.Cole_Light_Birthday_Bash_ATL_2023_On_FIRE_%28xu6HKf40MX0_-_2m38s%29_%28cropped%29.jpg" },
    { id: 11, isAd: true },
    { id: 12, title: "QUAVO & OFFSET REUNITE AT THE BET AWARDS FOR TAKEOFF TRIBUTE", views: "8.9M Views", posted: "JULY 20", imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80" },
  ];

  const renderVideoCard = (item: any) => {
    if (item.isAd) {
      return (
        <div key={`ad-${item.id}`} className="bg-[#111] border border-[#333] flex flex-col items-center justify-center p-4 text-center h-full min-h-[200px]">
          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-2">Advertisement</span>
          <span className="text-xl font-bold text-white uppercase bg-red-600 px-4 py-2 hover:bg-red-700 cursor-pointer transition-colors">
            SHOP NOW
          </span>
        </div>
      );
    }
    return (
      <Link href={`/video/${item.id}`} key={item.id} className="group block space-y-2">
        <div className="relative aspect-video w-full bg-zinc-900 overflow-hidden border border-[#222]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            className="w-full h-full object-cover filter group-hover:brightness-75 transition-all duration-200" 
          />
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
             <div className="w-12 h-12 bg-red-600/90 flex items-center justify-center rounded-sm">
                <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
             </div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-red-600 text-sm sm:text-base leading-tight uppercase line-clamp-3 group-hover:underline decoration-red-600">
            {item.title}
          </h3>
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-zinc-500 font-bold uppercase">
            <span>{item.views}</span>
            <span>•</span>
            <span>{item.posted}</span>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans w-full pb-20 pt-16 sm:pt-24">
      <div className="max-w-[1200px] mx-auto px-2 sm:px-4 space-y-8">
        
        {/* TOP FEATURED VIDEO */}
        <section className="w-full border-2 border-red-600 p-1 bg-[#0a0a0a]">
           <Link href="/video/featured" className="group block relative">
             <div className="relative w-full aspect-video sm:aspect-[21/9] overflow-hidden bg-zinc-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={featuredVideo.imageUrl} 
                  alt={featuredVideo.title} 
                  className="w-full h-full object-cover filter brightness-90 group-hover:brightness-75 transition-all duration-200" 
                />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-600/90 flex items-center justify-center rounded-sm border-2 border-white shadow-2xl">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                   </div>
                </div>
             </div>
             <div className="p-4 sm:p-6 bg-[#111]">
                <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-red-600 uppercase leading-[1.1] hover:underline decoration-red-600 mb-2">
                  {featuredVideo.title}
                </h1>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-zinc-500 font-bold uppercase">
                  <span>{featuredVideo.views}</span>
                  <span>|</span>
                  <span>{featuredVideo.posted}</span>
                </div>
             </div>
           </Link>
        </section>

        {/* TODAY'S VIDEOS HEADER */}
        <div className="bg-[#111] border-l-4 border-red-600 px-4 py-3 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-tight">
            TODAY'S <span className="text-red-600">VIDEOS</span>
          </h2>
        </div>

        {/* TODAY'S VIDEOS GRID */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {todaysVideos.map(renderVideoCard)}
        </section>

        {/* DATE DIVIDER */}
        <div className="w-full bg-[#111] py-2 border-y border-[#333] text-center my-8">
           <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
              WEDNESDAY, JULY 21, 2026
           </span>
        </div>

        {/* YESTERDAY'S VIDEOS GRID */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {yesterdaysVideos.map(renderVideoCard)}
        </section>

        <div className="w-full flex justify-center pt-8">
           <button className="bg-red-600 text-white font-extrabold uppercase px-12 py-4 hover:bg-red-700 transition-colors">
              LOAD MORE VIDEOS
           </button>
        </div>
      </div>
    </div>
  );
}
