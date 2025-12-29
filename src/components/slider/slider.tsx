// src/components/Slider.jsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

const slidesData = [
  {
    image: "/images/products/prod_slide1.png",
    title: "High-performance Bitcoin miner (S21EX  or S23 w/Hydro)",
    content: "At the core of each bundle is a high-performance Bitcoin miner engineered for top-tier results:",
    items: [
      "Hashrate: 860 TH/s or 1.18 PH/s",
      "Power consumption: 11,180 W or	11120 watt"
    ]
  },
  {
    image: "/images/products/prod_slide2.png",
    title: "Battery energy storage system (BESS)",
    content: "To keep your miners running efficiently around the clock, each bundle integrates an advanced storage solution",
    items: [
      "Stores excess solar energy during peak daylight hours",
      "PDelivers reliable power when sunlight is low or demand is high",
      "Reduces dependence on the grid, protecting against outages and rate spike"
    ]
  },
  {
    image: "/images/products/prod_slide3.png",
    title: "Integrated solar energy and infrastructure",
    content: "Each bundle comes equipped with the renewable energy backbone to power your miners sustainably:",
    items: [
      "550-watt solar panels designed for maximum energy capture",
      "Ground mounts for secure, efficient installation",
      "Energy infrastructure and storage to ensure consistent uptime and reduced grid reliance"
    ]
  },
  {
    image: "/images/products/prod_slide4.png",
    title: "Land and site infrastructure",
    content: "Your site is built around solar from the ground up.",
    items: [
      "We source and grade the land, engineer durable ground mounts, and install the solar and power infrastructure required for seamless deployment."
    ]
  },
  {
    image: "/images/products/prod_slide5.png",
    title: "Built-in security, monitoring and insurance coverage",
    content: "Protecting your investment is as important as powering it.",
    items: [
      "Each site includes professional security systems, 24/7 performance monitoring  and comprehensive insurance — all designed to safeguard operations and ensure long-term continuity."
    ]
  },
  {
    image: "/images/products/prod_slide6.png",
    title: "Proprietary enterprise-grade technology",
    content: "Our systems are built on proprietary, enterprise-grade technology designed to maximize uptime and efficiency.",
    items: [
      "From optimized cooling and power distribution to intelligent software that manages performance, every component is engineered for continuous, reliable output."
    ]
  },
];

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalSlides = slidesData.length;
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const scrollToSlide = (index: number) => {
    if (sliderRef.current) {
      const container = sliderRef.current;
      const slideWidth = (container.children[0] as HTMLElement)?.offsetWidth || 0;
      const containerWidth = container.offsetWidth;
      const padding = containerWidth * 0.2; 

      container.scrollTo({
        left: index * slideWidth - padding,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToSlide(currentSlide);
  }, [currentSlide]); 

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const slideWidthPercentage = 60;
  const peekWidthPercentage = 100 - slideWidthPercentage;

  return (
    <div 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="w-full mx-auto px-10 relative">
      <div
        ref={sliderRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar">
        {slidesData.map((slide, index) => (
          <div
            key={index}
            className="flex-none snap-center px-2"
            style={{ width: `${slideWidthPercentage}%` }}
          >
            <div
              className={`flex flex-col lg:flex-row bg-light-blue shadow-md overflow-hidden transition-all duration-300 ease-in-out h-[100%]
              ${index === currentSlide ? '' : 'opacity-70 '}`}
            >
              <div className="bg-ice-blue lg:w-[50%] w-full relative">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_CDN_URL}${slide.image}`}
                    alt="Slide Image"
                    width={531}
                    height={500}
                    loading='lazy'
                    className="object-cover w-full h-full"
                  />
              </div>

              <div className="p-4 md:p-8 lg:p-14 lg:flex-1 lg:w-[50%]">
                <h2 className="md:text-2xl text-xl text-dark mb-4 font-medium">{slide.title}</h2>
                <p className="md:text-lg text-sm text-dark mb-4">{slide.content}</p>
                <ul className="space-y-2 md:text-lg text-sm text-dark list-disc pl-5">
                  {slide.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* NAVIGATION CONTROLS */}
      <div className="flex items-center justify-between mt-8 container px-10">
        <button
          onClick={prevSlide}
          className="text-dark font-semibold hover:text-blue transition duration-150"
        >
          Prev
        </button>

        <div className="flex-grow mx-4 relative h-2 bg-gray rounded-full">
          <div
            className="absolute top-0 left-0 h-full bg-dark-gray rounded-full transition-all duration-500 ease-in-out"
            style={{
              width: `${((currentSlide + 1) / totalSlides) * 100}%`
            }}
          />
        </div>

        <button
          onClick={nextSlide}
          className="text-dark font-semibold hover:text-blue transition duration-150"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Slider;