"use client";
import React, { useState, useEffect } from "react";
import Recenze from "./JednaRecenze";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";

export default function RecenzeSlider() {
  const recenzeData = [
    {
      text: "Telibo si naše děti okamžitě oblíbily. Hravou formou se naučily nová slovíčka a baví je to každý den.",
      authorName: "Jana Horáková",
      puvodRecenze: {
        text: "Google recenze",
        url: "https://www.google.com",
      },
      authorImage: "/womanReview.png",
      reviewImage: "/review1.png",
    },
    {
      text: "Díky Telibu je učení angličtiny konečně zábava. Děti ani nevnímají, že se něco učí – prostě si hrají!",
      authorName: "Tomáš Koudelka",
      puvodRecenze: {
        text: "Google recenze",
        url: "https://www.google.com",
      },
      authorImage: "/manReview.png",
      reviewImage: "/review2.png",
    },
    {
      text: "Každé ráno se syn ptá, jestli si může zase pustit Telibo. A já mám jistotu, že se u toho něco naučí.",
      authorName: "Veronika Němcová",
      puvodRecenze: {
        text: "Google recenze",
        url: "https://www.google.com",
      },
      authorImage: "/womanReview.png",
      reviewImage: "/review3.png",
    },
    {
      text: "Neumím dobře anglicky, ale Telibo pomáhá dětem i bez mé asistence. Navíc jsou videa krásně zpracovaná.",
      authorName: "Martin Doležal",
      puvodRecenze: {
        text: "Google recenze",
        url: "https://www.google.com",
      },
      authorImage: "/manReview.png",
      reviewImage: "/review4.png",
    },
    {
      text: "V rámci školky jsme hledali interaktivní nástroj pro výuku angličtiny – a Telibo nás úplně nadchlo!",
      authorName: "Eva Soukupová",
      puvodRecenze: {
        text: "Google recenze",
        url: "https://www.google.com",
      },
      authorImage: "/womanReview.png",
      reviewImage: "/review5.png",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === recenzeData.length - 1 ? 0 : prevIndex + 1
      );
    }, 20000); // 20 seconds

    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? recenzeData.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === recenzeData.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section
      id="recenze"
      className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 bg-[#2CC4B9] py-10"
    >
      <button
        onClick={handlePrev}
        aria-label="Předchozí recenze"
        className="text-2xl"
      >
        <ArrowLeftCircleIcon className="w-12 h-12 text-white hover:text-gray-300" />
      </button>
      <div className="w-full max-w-3xl h-[520px] overflow-hidden px-6 md:px-10 text-center">
        <Recenze {...recenzeData[currentIndex]} />
      </div>
      <button
        onClick={handleNext}
        aria-label="Další recenze"
        className="text-2xl"
      >
        <ArrowRightCircleIcon className="w-12 h-12 text-white hover:text-gray-300" />
      </button>
    </section>
  );
}
