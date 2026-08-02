'use client';

import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <Loader2 className="animate-spin text-white/90" size={48} />
    </div>
  );
}
