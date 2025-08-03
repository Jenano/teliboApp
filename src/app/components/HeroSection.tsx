"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

function HeroSection() {
  return (
    <div className="bg-gradient-to-r from-[#EDFEFC] to-[#FEF6EC]">
      <div className="flex flex-col lg:flex-row items-center justify-center max-w-[1947px] px-4 py-12 gap-12">
        <div className="max-w-3xl text-center lg:text-left py-12 px-4">
          {/* Small top label or subheading */}
          <p className="text-teal-500 text-3xl font-semibold font-['Fredoka'] leading-10 tracking-wide">
            Angličtina pro malé objevitele!
          </p>

          {/* Main heading */}
          <h1 className="mt-2 text-2xl md:text-4xl font-['Fredoka'] font-bold text-[#2F2F2F]">
            Hravé interaktivní příběhy v angličtině – učení snadno a zábavně!
          </h1>

          <p className="mt-4 text-gray-600 text-lg">
            S výslovností, klikacími slovíčky a hvězdičkami jako odměna.
          </p>

          {/* Call-to-action button */}
          <Link
            href="/prihlaseni"
            className="inline-block mt-6 bg-[#fb923c] hover:bg-[#E5A743] text-white font-semibold py-3 px-5 font-['Fredoka'] rounded-full shadow-md transition-colors"
          >
            Začít číst!
          </Link>
        </div>
        <div className="py-12 px-4">
          <Image
            src="/hero.svg"
            alt="Illustration"
            width={400}
            height={400}
            className="w-full max-w-md"
          />
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
