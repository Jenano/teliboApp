"use client";

import React from "react";

function UkazkaKnihy() {
  return (
    <section
      id="ukazkaknihy"
      className="bg-gradient-to-r from-[#EDFEFC] to-[#FEF6EC] py-30"
    >
      <div className="max-w-6xl mx-auto px-4 text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold font-['Fredoka'] text-black mb-4">
          Ukázka knihy
        </h2>

        {/* Subtext */}
        <p className="text-gray-700 text-lg max-w-2xl mx-auto mb-8">
          Vyzkoušejte ukázku z naší oblíbené knihy a poznejte, jak fungují
          interaktivní příběhy TeliBo v praxi!
        </p>

        {/* img */}
        <img
          src="/bookTeaser.png"
          alt="Ukázka knihy"
          className="w-full h-auto rounded-md mx-auto"
        />
      </div>
    </section>
  );
}

export default UkazkaKnihy;
