import { useEffect, useRef, useState } from "react";
import { useGigs } from "../../hooks/useGigs";
import GigCard from "./GigCard";
import { useCategory } from "../../hooks/useCategory"; // <-- import hook

export default function GigsSlider() {
  const { gigs, fetchGigs } = useGigs();
  const { categories } = useCategory(); // <-- get categories
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch gigs on mount
  useEffect(() => {
    fetchGigs();
  }, [fetchGigs]);

  // Auto-scroll loop - ONE DIRECTION ONLY
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let animationFrame: number;
    const speed = 1; // pixels per frame

    const animate = () => {
      if (!isPaused && slider) {
        slider.scrollLeft += speed;

        const maxScroll = slider.scrollWidth / 2;
        if (slider.scrollLeft >= maxScroll) {
          slider.scrollLeft = 0;
        }
      }
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isPaused]);

  // Duplicate gigs for infinite loop
  const infiniteGigs = [...gigs, ...gigs];

  // Map category ID -> name
  const getCategoryName = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.name : "Unknown";
  };

  // Drag / swipe
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

  const handleDragStart = (clientX: number) => {
    if (!sliderRef.current) return;
    isDragging.current = true;
    startX.current = clientX;
    scrollStart.current = sliderRef.current.scrollLeft;
    setIsPaused(true);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging.current || !sliderRef.current) return;
    const walk = startX.current - clientX;
    sliderRef.current.scrollLeft = scrollStart.current + walk;
  };

  const handleDragEnd = () => {
    isDragging.current = false;
    setTimeout(() => setIsPaused(false), 100);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => handleDragStart(e.pageX);
  const handleMouseMove = (e: React.MouseEvent) => handleDragMove(e.pageX);
  const handleMouseUp = handleDragEnd;
  const handleMouseLeave = () => {
    if (isDragging.current) handleDragEnd();
    setIsPaused(false);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => handleDragMove(e.touches[0].clientX);
  const handleTouchEnd = handleDragEnd;

  // Arrow scroll
  const scrollByAmount = (amount: number) => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className="relative w-full py-4">
      {/* Left Arrow */}
      <button
        onClick={() => scrollByAmount(-300)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition"
      >
        &#8592;
      </button>

      {/* Right Arrow */}
      <button
        onClick={() => scrollByAmount(300)}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition"
      >
        &#8594;
      </button>

      {/* Slider */}
      <div
        ref={sliderRef}
        className="flex gap-4 whitespace-nowrap overflow-x-scroll scrollbar-hide select-none relative cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {infiniteGigs.map((gig, index) => (
          <div key={`${gig._id}-${index}`} className="shrink-0 w-72">
            {/* Pass category name instead of ID */}
            <GigCard gig={gig} categoryName={getCategoryName(gig.category)} />
          </div>
        ))}

        {/* Gradient fade left */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-12 bg-linear-to-r from-white to-transparent" />
        {/* Gradient fade right */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-linear-to-l from-white to-transparent" />
      </div>
    </div>
  );
}
