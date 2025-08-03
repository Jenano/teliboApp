"use client";

import React, { useState } from "react";
import ViceBTN from "./ViceBTN";

function ZjisteteVice() {
  // Track which accordion item is open. Default: first accordion open.
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  // Toggles accordion item
  const handleToggle = (index: number) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <section id="zjistetevice" className="bg-white py-20 relative">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center">
        {/* Left Side: Heading & Accordion */}
        <div className="md:w-1/2">
          <h2 className="text-black font-['Fredoka'] leading-[56.47px] tracking-wider text-3xl md:text-4xl font-bold mb-6">
            Zjistěte více o TeliBo
          </h2>

          {/* Accordion Container */}
          <div className="space-y-6 min-h-[335px]">
            {/* 1st Accordion Item */}
            <ViceBTN
              buttonText="🇬🇧 Hravá platforma pro snadné učení angličtiny"
              expandedText="TeliBo je interaktivní vzdělávací platforma, která pomáhá dětem ve věku 6–9 let učit se angličtinu hravou formou. Spojuje tradiční čtení s audiovýslovností a interaktivními prvky, díky nimž si děti přirozeně rozšiřují slovní zásobu a zlepšují porozumění textu."
              isActive={activeIndex === 0}
              onToggle={() => handleToggle(0)}
            />

            {/* 2nd Accordion Item */}
            <ViceBTN
              buttonText="📖 Čtení, poslech a učení slovíček v jednom"
              expandedText="TeliBo je interaktivní aplikace, která zapojuje všechny smysly dítěte: umožňuje mu číst text, poslouchat jeho výslovnost a sledovat zvýrazněná slova, což podporuje efektivní a zábavné učení angličtiny."
              isActive={activeIndex === 1}
              onToggle={() => handleToggle(1)}
            />

            {/* 3rd Accordion Item */}
            <ViceBTN
              buttonText="🏆 Proč si TeliBo zamilují i Vaše děti?"
              expandedText="Telibo promění učení angličtiny v zábavné dobrodružství plné interaktivních příběhů a miniher. Děti získávají hvězdičky za správné odpovědi, což je motivuje k dalšímu objevování a učení. Naším cílem je, aby se děti učily přirozeně a s radostí."
              isActive={activeIndex === 2}
              onToggle={() => handleToggle(2)}
            />

            {/* 4th Accordion Item */}
            <ViceBTN
              buttonText="🔥 Denní streaky a motivační odznaky"
              expandedText="Za každý den, kdy se dítě zapojí do čtení nebo procvičování, získává streak – nepřerušenou sérii dnů. TeliBo odměňuje pravidelné učení. Děti získávají odznaky a udržují si denní streaky, které je motivují pokračovat každý den – podobně jako v oblíbených hrách."
              isActive={activeIndex === 3}
              onToggle={() => handleToggle(3)}
            />

            {/* 5th Accordion Item */}
            <ViceBTN
              buttonText="🗂️ Slovíčka pod kontrolou pro děti i rodiče"
              expandedText="Všechna nová slovíčka, která dítě během čtení objeví, se automaticky ukládají do jeho osobního seznamu. Tento seznam slouží jako přehled pro další opakování – ať už formou miniher nebo jednoduchých flashcards. Zároveň do něj mají přístup i rodiče, kteří tak vidí konkrétní pokrok dítěte a mohou ho efektivně podpořit. Díky tomu TeliBo propojuje samostatnost dítěte s aktivní rolí rodiče bez narušení hravého rytmu učení."
              isActive={activeIndex === 4}
              onToggle={() => handleToggle(4)}
            />
          </div>
        </div>

        {/* Right Side: Kid img */}
        <div className="md:w-1/2 mb-8 md:mb-0 flex justify-center">
          <img
            src="/zjisteteVice.png"
            alt="Ilustrace dítěte objevujícího TeliBo"
            className="w-full p-8"
          />
        </div>
      </div>
      <img
        src="/fox.svg"
        alt="Fox"
        className="absolute bottom-0 right-0 w-20 h-auto"
      />
    </section>
  );
}

export default ZjisteteVice;
