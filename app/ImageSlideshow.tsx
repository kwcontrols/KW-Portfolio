"use client";

import { useEffect, useState } from "react";

export type SlideshowImage = {
  src: string;
  alt: string;
  displayMode?: "cover" | "contain";
};

export function ImageSlideshow({
  images,
  label,
}: {
  images: SlideshowImage[];
  label: string;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [interactionVersion, setInteractionVersion] = useState(0);
  const hasMultipleSlides = images.length > 1;
  const currentImage = images[currentSlide];
  const displayMode =
    currentImage.displayMode ??
    (currentImage.src.endsWith("/siemens-3.png") ? "contain" : "cover");

  useEffect(() => {
    if (!hasMultipleSlides) return;

    const timer = window.setTimeout(() => {
      setCurrentSlide((slide) => (slide + 1) % images.length);
    }, 4500);

    return () => window.clearTimeout(timer);
  }, [currentSlide, hasMultipleSlides, images.length, interactionVersion]);

  const showPrevious = () => {
    setCurrentSlide((slide) => (slide === 0 ? images.length - 1 : slide - 1));
    setInteractionVersion((version) => version + 1);
  };

  const showNext = () => {
    setCurrentSlide((slide) => (slide + 1) % images.length);
    setInteractionVersion((version) => version + 1);
  };

  const showSlide = (index: number) => {
    setCurrentSlide(index);
    setInteractionVersion((version) => version + 1);
  };

  return (
    <div className="image-slideshow" aria-label={label}>
      <div
        className={`image-slideshow-frame is-${displayMode}`}
        style={
          displayMode === "contain"
            ? { background: "var(--content-background)" }
            : undefined
        }
      >
        <img
          key={currentImage.src}
          className={`image-slideshow-image is-${displayMode}`}
          src={currentImage.src}
          alt={currentImage.alt}
        />
        {hasMultipleSlides && (
          <>
            <button
              className="image-slideshow-control image-slideshow-previous"
              type="button"
              onClick={showPrevious}
              aria-label="Show previous project photo"
            >
              ‹
            </button>
            <button
              className="image-slideshow-control image-slideshow-next"
              type="button"
              onClick={showNext}
              aria-label="Show next project photo"
            >
              ›
            </button>
          </>
        )}
      </div>
      {hasMultipleSlides && (
        <div className="image-slideshow-dots" aria-label="Choose a project photo">
          {images.map((image, index) => (
            <button
              key={image.src}
              className={index === currentSlide ? "is-active" : ""}
              type="button"
              onClick={() => showSlide(index)}
              aria-label={`Show project photo ${index + 1}`}
              aria-current={index === currentSlide ? "true" : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
