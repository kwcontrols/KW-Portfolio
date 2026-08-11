"use client";

import { useEffect, useState } from "react";

// Replace these temporary image URLs with paths to your own photos in /public.
// Example: { src: "/hiking-photo.jpg", alt: "Hiking in the mountains" }
// const SLIDESHOW_IMAGES = [
//   { src: "https://picsum.photos/id/1018/1200/800", alt: "Mountain landscape placeholder" },
//   { src: "https://picsum.photos/id/1015/1200/800", alt: "River and mountains placeholder" },
//   { src: "https://picsum.photos/id/1036/1200/800", alt: "Forest landscape placeholder" },
//   { src: "https://picsum.photos/id/1043/1200/800", alt: "Outdoor landscape placeholder" },
//   { src: "https://picsum.photos/id/1050/1200/800", alt: "Coastal landscape placeholder" },
// ];

const SLIDESHOW_IMAGES = [
  {
    src: "/photos/photo-1.jpg",
    alt: "Photo 1",
  },
  {
    src: "/photos/photo-2.jpg",
    alt: "Photo 2",
  },
  {
    src: "/photos/photo-3.jpg",
    alt: "Photo 3",
  },
  {
    src: "/photos/photo-4.jpg",
    alt: "Photo 4",
  },
  {
    src: "/photos/photo-5.png",
    alt: "Photo 5",
  },
];

export function PhotoSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentSlide((slide) => (slide + 1) % SLIDESHOW_IMAGES.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, []);

  const showPrevious = () => {
    setCurrentSlide((slide) =>
      slide === 0 ? SLIDESHOW_IMAGES.length - 1 : slide - 1,
    );
  };

  const showNext = () => {
    setCurrentSlide((slide) => (slide + 1) % SLIDESHOW_IMAGES.length);
  };

  return (
    <div className="photo-slideshow" aria-label="Personal photo slideshow">
      <div className="slideshow-frame">
        <img
          key={SLIDESHOW_IMAGES[currentSlide].src}
          className="slideshow-image"
          src={SLIDESHOW_IMAGES[currentSlide].src}
          alt={SLIDESHOW_IMAGES[currentSlide].alt}
        />
        <button
          className="slideshow-control slideshow-previous"
          type="button"
          onClick={showPrevious}
          aria-label="Show previous photo"
        >
          ‹
        </button>
        <button
          className="slideshow-control slideshow-next"
          type="button"
          onClick={showNext}
          aria-label="Show next photo"
        >
          ›
        </button>
      </div>
      <div className="slideshow-dots" aria-label="Choose a photo">
        {SLIDESHOW_IMAGES.map((image, index) => (
          <button
            key={image.src}
            className={index === currentSlide ? "is-active" : ""}
            type="button"
            onClick={() => setCurrentSlide(index)}
            aria-label={`Show photo ${index + 1}`}
            aria-current={index === currentSlide ? "true" : undefined}
          />
        ))}
      </div>
    </div>
  );
}
