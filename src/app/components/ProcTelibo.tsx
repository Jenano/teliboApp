"use client";

import React, { useState, useEffect } from "react";
import { PlayCircleIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import CountUp from "react-countup";
import Link from "next/link";

function ProcTelibo() {
  const [showVideo, setShowVideo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const storiesCount = 11;
  const learningHours = 9;
  const exercisesCount = 100;

  return (
    <section id="proctelibo" className="bg-white py-35 ">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center">
        {/* Left Side: Heart img */}
        <div className="md:w-1/2 mb-8 md:mb-0 flex justify-center">
          <img
            src="/procTeliboHeart.svg"
            alt="Srdce znázorňující zábavu a učení"
            className="w-full p-3"
          />
        </div>

        {/* Right Side: Heading, Panda img, and Content */}
        <div className="md:w-1/2 md:pl-8">
          {/* Heading with Panda img */}
          <div className="flex items-center mb-4">
            <h2 className="text-3xl md:text-4xl font-bold font-['Fredoka'] text-black">
              Proč TeliBo?
            </h2>
            <img src="/koala.svg" alt="koala" className="h-25 w-25 mr-2" />
          </div>

          {/* Main Description */}
          <p className="text-gray-700 text-lg mb-6 p-3">
            TeliBo je navržen tak, aby děti angličtina opravdu bavila.
            Prostřednictvím oblíbených bajek si děti přirozeně osvojují nejen
            nová slovíčka, ale zároveň se u nich formují základy morálky.
          </p>

          {/* Stats / Info Row */}
          <div className="bg-[#2CC4B9] rounded-2xl py-3 px-2 flex flex-col md:flex-row items-center justify-around text-white mb-6">
            {/* 1st Stat */}
            <div className="text-center mb-4 md:mb-0">
              <h3 className="text-2xl font-bold font-['Fredoka'] leading-10 tracking-wide">
                <CountUp
                  end={storiesCount}
                  duration={3}
                  suffix="+"
                  enableScrollSpy
                  scrollSpyOnce
                />
              </h3>
              <p className="text-lg font-bold font-['Fredoka'] tracking-wide">
                Bajek k objevení
              </p>
            </div>

            {/* Vertical Divider (only visible on md+ screens) */}
            <div className="hidden md:block w-px h-12 bg-white"></div>

            {/* 2nd Stat */}
            <div className="text-center mb-4 md:mb-0">
              <h3 className="text-2xl font-bold font-['Fredoka'] leading-10 tracking-wide">
                <CountUp
                  end={learningHours}
                  duration={2}
                  suffix="h+"
                  enableScrollSpy
                  scrollSpyOnce
                />
              </h3>
              <p className="text-lg font-bold font-['Fredoka'] tracking-wide">
                Hodin hravého vzdělávání
              </p>
            </div>

            {/* Vertical Divider (only visible on md+ screens) */}
            <div className="hidden md:block w-px h-12 bg-white"></div>

            {/* 3rd Stat */}
            <div className="text-center">
              <h3 className="text-2xl font-bold font-['Fredoka'] leading-10 tracking-wide">
                <CountUp
                  end={exercisesCount}
                  duration={4}
                  suffix="+"
                  enableScrollSpy
                  scrollSpyOnce
                />
              </h3>
              <p className="text-lg font-bold font-['Fredoka'] tracking-wide">
                Interaktivních cvičení
              </p>
            </div>
          </div>

          {/* Replaced Bullet Points */}
          <ul className="mb-6 space-y-2">
            <li className="flex items-center text-gray-700">
              <ChevronRightIcon className="w-5 h-5 text-[#2CC4B9] mr-2" />
              Výuka, která děti baví a motivuje
            </li>
            <li className="flex items-center text-gray-700">
              <ChevronRightIcon className="w-5 h-5 text-[#2CC4B9] mr-2" />
              Příběhy s hodnotami, které si děti odnesou do života
            </li>
          </ul>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
            <Link
              href="/prihlaseni"
              className="inline-block bg-[#F6B949] hover:bg-[#E5A743] text-white font-semibold px-7 py-3 font-['Fredoka'] rounded-full shadow-md transition-colors"
            >
              Začít číst!
            </Link>
            <button
              onClick={() => setShowVideo(true)}
              className="rounded-full border border-solid flex items-center text-[#2CC4B9] hover:bg-[#2CC4B9] hover:text-white font-semibold hover:underline px-2 py-2"
            >
              <PlayCircleIcon className="size-8" />
              Přehrát Video
            </button>
          </div>
          {showVideo &&
            (isMobile ? (
              <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
                <div className="relative w-full h-full">
                  <iframe
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                    title="Ukázkové video TeliBo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                  <button
                    onClick={() => setShowVideo(false)}
                    className="absolute top-4 right-4 text-white text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>
            ) : (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
                <div className="relative bg-white w-full max-w-3xl aspect-video rounded-lg overflow-hidden shadow-lg">
                  <iframe
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                    title="Ukázkové video TeliBo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                  <button
                    onClick={() => setShowVideo(false)}
                    className="absolute top-2 right-2 z-50 bg-white rounded-full w-8 h-8 flex items-center justify-center text-black text-xl shadow-md hover:bg-gray-200 transition"
                    aria-label="Zavřít video"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

export default ProcTelibo;
