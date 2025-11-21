import React, { useState, useEffect, useRef, useCallback } from "react";

interface SliderProps {
  slidesToShow?: number;
  arrowsScroll?: number;
  children: React.ReactNode[];
  className?: string;
  autoplay?: boolean;
  autoplaySpeed?: number; // in ms
}

const Slider: React.FC<SliderProps> = ({
  slidesToShow = 1,
  arrowsScroll = 1,
  children,
  className,
  autoplay = true,
  autoplaySpeed = 3000,
}) => {
  const [current, setCurrent] = useState(0);
  const slides = React.Children.toArray(children);
  const total = slides.length;
  const intervalRef = useRef<number | null>(null);
  const startX = useRef<number | null>(null);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + arrowsScroll) % total);
  }, [arrowsScroll, total]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - arrowsScroll + total) % total);
  }, [arrowsScroll, total]);

  useEffect(() => {
    if (autoplay) {
      intervalRef.current = window.setInterval(next, autoplaySpeed);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [autoplay, autoplaySpeed, next]);

  const handleMouseEnter = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
  const handleMouseLeave = () => {
    if (autoplay) intervalRef.current = window.setInterval(next, autoplaySpeed);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (startX.current !== null) {
      const diff = startX.current - e.touches[0].clientX;
      if (diff > 50) {
        next();
        startX.current = null;
      } else if (diff < -50) {
        prev();
        startX.current = null;
      }
    }
  };

  return (
    <div
      className={`relative w-full ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <div className="overflow-hidden relative w-full">
        <div
          className="flex transition-transform duration-500"
          style={{
            transform: `translateX(-${(100 / slidesToShow) * current}%)`,
            width: `${(100 * total) / slidesToShow}%`,
          }}
        >
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className="shrink-0"
              style={{ width: `${100 / slidesToShow}%` }}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {total > 1 && (
        <>
          <button
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100 z-10"
            onClick={prev}
          >
            ◀
          </button>
          <button
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100 z-10"
            onClick={next}
          >
            ▶
          </button>
        </>
      )}

      <div className="flex justify-center mt-2 gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`w-2 h-2 rounded-full ${
              idx === current ? "bg-gray-800" : "bg-gray-300"
            }`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
