'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, Check, RotateCw, RefreshCw, Loader2, Move } from 'lucide-react';

interface ProfilePhotoCropModalProps {
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedFile: File) => Promise<void>;
}

export function ProfilePhotoCropModal({
  imageSrc,
  onClose,
  onCropComplete,
}: ProfilePhotoCropModalProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Mouse / Touch Drag Handlers
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - position.x, y: clientY - position.y });
  };

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setPosition({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Handle Zoom Wheel
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    setZoom((prev) => Math.min(Math.max(1, prev + delta), 3.5));
  };

  // Reset Adjustments
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  // Perform Circular Crop via HTML5 Canvas
  const handleApplyCrop = async () => {
    if (!imageRef.current) return;
    setIsSubmitting(true);

    try {
      const img = imageRef.current;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const cropSize = 512; // High-DPI Output Resolution
      canvas.width = cropSize;
      canvas.height = cropSize;

      if (!ctx) throw new Error('Canvas context unavailable');

      // Create circular clipping path
      ctx.beginPath();
      ctx.arc(cropSize / 2, cropSize / 2, cropSize / 2, 0, Math.PI * 2);
      ctx.clip();

      // Clear background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, cropSize, cropSize);

      // Compute display bounds & transformations
      const containerSize = 280; // Size of the circular aperture guide in UI
      const scaleRatio = cropSize / containerSize;

      const centerX = cropSize / 2;
      const centerY = cropSize / 2;

      ctx.save();
      ctx.translate(centerX + position.x * scaleRatio, centerY + position.y * scaleRatio);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);

      // Render image centered
      const drawWidth = img.naturalWidth * (containerSize / img.naturalHeight) * scaleRatio;
      const drawHeight = img.naturalHeight * (containerSize / img.naturalHeight) * scaleRatio;

      ctx.drawImage(
        img,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight
      );

      ctx.restore();

      // Convert Canvas to Blob -> File
      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            setIsSubmitting(false);
            return;
          }

          const file = new File([blob], `avatar_cropped_${Date.now()}.webp`, {
            type: 'image/webp',
          });

          await onCropComplete(file);
          setIsSubmitting(false);
        },
        'image/webp',
        0.92
      );
    } catch (err) {
      console.error('Cropping error:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-none shadow-2xl overflow-hidden flex flex-col font-mono text-white">

        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800/80 bg-neutral-900/50">
          <div className="flex items-center gap-2">
            <Move className="w-4 h-4 text-red-500" />
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-100">
              FRAME PROFILE PICTURE
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-zinc-400 hover:text-white transition-colors p-1 rounded-none cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CROP VIEWPORT WITH CIRCULAR DP OVERLAY */}
        <div
          ref={containerRef}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          className="relative w-full h-[320px] bg-neutral-900 flex items-center justify-center overflow-hidden select-none cursor-grab active:cursor-grabbing"
        >
          {/* Draggable Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Crop preview"
            draggable={false}
            className="max-h-full max-w-full object-contain pointer-events-none transition-transform ease-out duration-75"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
            }}
          />

          {/* Instagram / WhatsApp Style Circular Guide Mask */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Dark vignette overlay with circular cutout */}
            <div className="w-full h-full bg-black/60 shadow-[inset_0_0_0_9999px_rgba(0,0,0,0.65)] flex items-center justify-center">
              <div className="w-[280px] h-[280px] rounded-full border-2 border-red-500/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.65),0_0_20px_rgba(239,68,68,0.3)] transition-all" />
            </div>
          </div>

          <div className="absolute bottom-3 left-3 bg-black/70 px-2.5 py-1 text-[9px] text-zinc-400 uppercase tracking-widest border border-neutral-800 pointer-events-none">
            DRAG TO PAN · SCROLL TO ZOOM
          </div>
        </div>

        {/* CONTROLS BAR */}
        <div className="p-6 space-y-5 bg-neutral-950 border-t border-neutral-800/80">
          {/* Zoom Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><ZoomOut className="w-3.5 h-3.5 text-zinc-500" /> ZOOM</span>
              <span className="text-red-400">{zoom.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="1"
              max="3.5"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-red-600 bg-neutral-900 cursor-pointer h-1.5"
            />
          </div>

          {/* Action Tools */}
          <div className="flex items-center justify-between gap-3 text-xs">
            <button
              onClick={() => setRotation((r) => (r + 90) % 360)}
              type="button"
              className="flex-1 py-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-zinc-300 font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5 text-red-500" /> ROTATE
            </button>
            <button
              onClick={handleReset}
              type="button"
              className="flex-1 py-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-zinc-300 font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-zinc-400" /> RESET
            </button>
          </div>

          {/* MODAL FOOTER BUTTONS */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              type="button"
              className="flex-1 py-3 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-zinc-400 text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50 cursor-pointer"
            >
              CANCEL
            </button>
            <button
              onClick={handleApplyCrop}
              disabled={isSubmitting}
              type="button"
              className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>UPLOADING...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>CROP & SAVE</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
