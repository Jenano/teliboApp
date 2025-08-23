"use client";
import React, { useState, useEffect } from "react";
import Recenze from "./JednaRecenze";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";

type Review = {
  id?: string;
  body: string; // = text recenze
  author_name: string;
  source_text?: string | null;
  source_url?: string | null;
  author_image_url?: string | null;
  review_image_url?: string | null;
};

export default function RecenzeSlider({ reviews }: { reviews?: Review[] }) {
  // fallback původních dat (ponecháváme tvé texty)
  const fallbackData: Review[] = [
    {
      body: "Telibo si naše děti okamžitě oblíbily. Hravou formou se naučily nová slovíčka a baví je to každý den.",
      author_name: "Jana Horáková",
      source_text: "Google recenze",
      source_url: "https://www.google.com",
      author_image_url: "/userReview.png",
      review_image_url: "/review1.png",
    },
    {
      body: "Díky Telibu je učení angličtiny konečně zábava. Děti ani nevnímají, že se něco učí – prostě si hrají!",
      author_name: "Tomáš Koudelka",
      source_text: "Google recenze",
      source_url: "https://www.google.com",
      author_image_url: "/userReview.png",
      review_image_url: "/review2.png",
    },
    {
      body: "Každé ráno se syn ptá, jestli si může zase pustit Telibo. A já mám jistotu, že se u toho něco naučí.",
      author_name: "Veronika Němcová",
      source_text: "Google recenze",
      source_url: "https://www.google.com",
      author_image_url: "/userReview.png",
      review_image_url: "/review3.png",
    },
    {
      body: "Neumím dobře anglicky, ale Telibo pomáhá dětem i bez mé asistence. Navíc jsou videa krásně zpracovaná.",
      author_name: "Martin Doležal",
      source_text: "Google recenze",
      source_url: "https://www.google.com",
      author_image_url: "/userReview.png",
      review_image_url: "/review4.png",
    },
    {
      body: "V rámci školky jsme hledali interaktivní nástroj pro výuku angličtiny – a Telibo nás úplně nadchlo!",
      author_name: "Eva Soukupová",
      source_text: "Google recenze",
      source_url: "https://www.google.com",
      author_image_url: "/userReview.png",
      review_image_url: "/review5.png",
    },
  ];

  const recenzeData: Review[] =
    reviews && reviews.length > 0 ? reviews : fallbackData;

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === recenzeData.length - 1 ? 0 : prev + 1
      );
    }, 20000);
    return () => clearInterval(interval);
  }, [recenzeData.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? recenzeData.length - 1 : prev - 1));
  };
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === recenzeData.length - 1 ? 0 : prev + 1));
  };

  // adaptér: mapuj DB pole -> props JednaRecenze
  const current = recenzeData[currentIndex];
  const mapped = {
    text: current.body,
    authorName: current.author_name,
    puvodRecenze: {
      text: current.source_text ?? "",
      url: current.source_url ?? "",
    },
    authorImage: current.author_image_url ?? "/userReview.png",
    reviewImage: current.review_image_url ?? "/review1.png",
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
        <Recenze {...mapped} />
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
