import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ImageGalleryProps {
  images: string[];
  alt?: string;
}

export default function ImageGallery({ images, alt = 'Product image' }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-muted flex items-center justify-center rounded-lg">
        <p className="text-muted-foreground">بدون تصویر</p>
      </div>
    );
  }

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div 
        className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer group"
        onClick={() => setIsOpen(true)}
        data-testid="image-gallery-main"
      >
        <img
          src={images[selectedIndex]}
          alt={`${alt} - ${selectedIndex + 1}`}
          loading="eager"
          className="w-full h-full object-contain"
        />
        
        {/* Navigation Arrows (visible on hover) */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              data-testid="button-previous-image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              data-testid="button-next-image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2" data-testid="image-gallery-thumbnails">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                index === selectedIndex
                  ? 'border-primary scale-105'
                  : 'border-transparent hover:border-muted-foreground/50'
              }`}
              data-testid={`thumbnail-${index}`}
            >
              <img
                src={image}
                alt={`${alt} thumbnail ${index + 1}`}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl w-full p-0 bg-black/95" data-testid="image-modal">
          <div className="relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded-full z-10"
              data-testid="button-close-modal"
            >
              <X className="h-6 w-6" />
            </button>

            <img
              src={images[selectedIndex]}
              alt={`${alt} fullscreen - ${selectedIndex + 1}`}
              loading="eager"
              className="w-full h-auto max-h-[90vh] object-contain"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full"
                  data-testid="button-modal-previous"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full"
                  data-testid="button-modal-next"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
                  {selectedIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
