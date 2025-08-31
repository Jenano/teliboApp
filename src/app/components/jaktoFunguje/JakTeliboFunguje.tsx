"use client";
import React, { useState, useEffect } from "react";
import FunkcionalitaBTN from "./FunkcionalitaBTN";

function JakTeliboFunguje() {
  // Define the data for the three cards
  const cards = [
    {
      heading: "Interaktivní čtení",
      text: "Děti čtou anglické příběhy se zvýrazněnými klíčovými slovy a zároveň je slyší se správnou výslovností.",
      image: "/go.svg",
      textLong:
        "Nechte své dítě naslouchat plynulému vyprávění profesionálního rodilého mluvčího, který promění každou stránku v živý zážitek. Zvýrazněná slova pak fungují jako barevné majáčky, které vedou pozornost a usnadňují zapamatování nových anglických výrazů.😊",
    },
    {
      heading: "Hravé učení slovíček",
      text: "Po každé dokončené stránce čeká zábavná výzva: 3–4 čerstvá slovíčka v rychlých hrách pro okamžité posílení paměti.",
      image: "/smartLearning.svg",
      textLong:
        "Po každé stránce skočí malý čtenář do rychlé minihry – vybírá správné páry slovíček, poslouchá rodilé výslovnosti a skládá slova do vět. Díky hravému střídání úloh se učení stává dobrodružstvím, zatímco klíčová slovíčka zůstanou v paměti napořád🧠.",
    },
    {
      heading: "Komplexní přehled pro rodiče",
      text: "Máte přehled o pokroku dítěte: kolik stránek denně i týdně přečetlo, kolik slov procvičilo a kolik času učení věnovalo.",
      image: "/stars.svg",
      textLong:
        "Rodičovský panel shrnuje veškerá data na jednom místě – přehledné grafy čtení, procvičování slov a časové osy učení. Sledujte streaky, odznaky i denní/­týdenní statistiky. Díky vizualizacím snadno odhalíte slovíčka, se kterými dítě bojuje a můžete je společně s ním procvičit🫶.",
    },
  ];

  // State variable for tracking the active card index
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    // Automatically update the active card every 3.5 seconds
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % cards.length);
    }, 3500);

    // Clear the interval when the component unmounts or isPaused changes
    return () => clearInterval(interval);
  }, [cards.length, isPaused]);

  return (
    <>
      {/* First Section with arc */}
      <section
        id="jaktofunguje"
        className="bg-gradient-to-r from-[#EDFEFC] to-[#FEF6EC] pt-12"
      >
        {/* White arc container */}
        <div className="bg-white rounded-t-[200px] mx-auto px-4 py-12 text-center shadow-sm">
          <h2 className="text-black text-4xl md:text-5xl font-bold font-['Fredoka'] leading-tight tracking-normal mb-4">
            Jak to funguje?
          </h2>
          <p className="text-gray-700 text-lg md:text-xl font-normal font-['Fredoka'] leading-relaxed tracking-normal max-w-2xl mx-auto">
            Telibo je interaktivní vzdělávací nástroj, který dětem v mladším
            školním věku umožňuje zábavně a efektivně rozvíjet angličtinu
            prostřednictvím čtení, poslechu a herních aktivit.
          </p>
        </div>
      </section>

      {/* New Section with 3 FunkcionalitaBTN cards */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card, index) => (
              <div key={index} className="h-full flex">
                <FunkcionalitaBTN
                  heading={card.heading}
                  text={card.text}
                  image={card.image}
                  isActive={index === activeIndex}
                  textLong={card.textLong}
                  onFlip={() => setIsPaused(true)}
                  onUnflip={() => setIsPaused(false)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default JakTeliboFunguje;
