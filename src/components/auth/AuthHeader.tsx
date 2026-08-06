import React from 'react';

export default function AuthHeader() {
  return (
    <div className="flex flex-col items-center text-center space-y-2 mb-10">
      <h1 className="text-3xl font-black text-white tracking-widest uppercase">
        AETHERIA <span className="font-light">HQ</span>
      </h1>
      <p className="text-xs text-zinc-400 font-bold tracking-widest uppercase mt-1">
        AUTHORIZED PERSONNEL ONLY
      </p>
    </div>
  );
}
