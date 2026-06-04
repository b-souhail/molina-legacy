"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselSlide {
  id: number;
  image: string;
  title: string;
  subtitle?: string;
  link: string;
  linkText: string;
}

const CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    id: 1,
    image: "/image.png",
    title: "Découvrez Notre Collection",
    subtitle: "Pièces exclusives et intemporelles",
    link: "/collections",
    linkText: "Explorer",
  },
  {
    id: 2,
    image: "/molina-footer_NL-bg.jpg",
    title: "Nouvelle Arrivée",
    subtitle: "Les dernières pièces de la saison",
    link: "/nouveautes",
    linkText: "Voir Plus",
  },
  {
    id: 3,
    image: "/molina-footer_legal.png",
    title: "Collection Homme",
    subtitle: "Élégance et sophistication",
    link: "/homme",
    linkText: "Parcourir",
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? CAROUSEL_SLIDES.length - 1 : prev - 1
    );
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-(--cream)">
      {/* Carousel Container */}
      <div className="relative w-full h-full">
        {/* Slides */}
        {CAROUSEL_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background Image */}
            <div className="relative w-full h-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                className="object-cover"
              />
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 md:px-8">
              <div className="text-center max-w-2xl">
                {/* Decorative Top Line */}
                <div className="mb-8 flex items-center justify-center gap-4">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--gold)]" />
                  <span className="text-xs uppercase tracking-[0.3em] text-(--gold) font-bold">
                    Molina Legacy
                  </span>
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--gold)]" />
                </div>

                {/* Main Title */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading text-(--cream) mb-4 tracking-tight leading-tight">
                  {slide.title}
                </h1>

                {/* Subtitle */}
                {slide.subtitle && (
                  <p className="text-lg md:text-xl text-(--cream)/80 mb-10 font-light tracking-wide">
                    {slide.subtitle}
                  </p>
                )}

                {/* CTA Button */}
                <Link href={slide.link}>
                  <button className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden">
                    {/* Border */}
                    <div className="absolute inset-0 border border-(--gold) rounded-[2px]" />

                    {/* Hover Background */}
                    <div className="absolute inset-0 bg-(--gold) transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-[2px]" />

                    {/* Text */}
                    <span className="relative text-xs uppercase tracking-[0.2em] text-(--gold) group-hover:text-(--forest) transition-colors duration-500 font-bold">
                      {slide.linkText}
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 z-20 group"
        aria-label="Previous slide"
      >
        <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 border border-(--gold)/60 rounded-[2px] group-hover:border-(--gold) group-hover:bg-(--gold)/10 transition-all duration-300">
          <ChevronLeft
            size={24}
            className="text-(--gold) group-hover:text-(--cream) transition-colors duration-300"
            strokeWidth={1.5}
          />
        </div>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-20 group"
        aria-label="Next slide"
      >
        <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 border border-(--gold)/60 rounded-[2px] group-hover:border-(--gold) group-hover:bg-(--gold)/10 transition-all duration-300">
          <ChevronRight
            size={24}
            className="text-(--gold) group-hover:text-(--cream) transition-colors duration-300"
            strokeWidth={1.5}
          />
        </div>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {CAROUSEL_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-500 rounded-full ${
              index === currentSlide
                ? "w-8 h-2 bg-(--gold)"
                : "w-2 h-2 bg-(--gold)/40 hover:bg-(--gold)/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Bottom Decorative Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-40" />
    </section>
  );
}
