"use client";

import React, { useState } from "react";

interface FunkcionalitaBTNProps {
  heading: string;
  text: string;
  image: string;
  isActive?: boolean;
  textLong: string;
  onFlip?: () => void;
  onUnflip?: () => void;
}

function FunkcionalitaBTN({
  heading,
  text,
  image,
  isActive = false,
  textLong,
  onFlip,
  onUnflip,
}: FunkcionalitaBTNProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="relative w-full min-h-[380px]">
      <div
        className={`relative w-full h-full transition-transform duration-700 transform ${
          flipped ? "rotate-y-180" : ""
        }`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Přední strana */}
        <div
          className={`rounded-2xl p-6 text-center border-2 shadow-lg flex flex-col justify-between min-h-full overflow-hidden backface-hidden
        transition-colors duration-900 ease-in-out absolute inset-0 h-full
        ${
          isActive
            ? "bg-[#2CC4B9] text-white border-white border-solid"
            : "bg-white text-black border-[#F6B949] border-dotted"
        }
      `}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(0deg)" }}
        >
          {/* Icon Circle */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FEF6EC]">
            <img src={image} alt={heading} className="h-15 w-15" />
          </div>

          {/* Heading */}
          <h3
            className={`mb-2 text-xl font-semibold ${
              isActive ? "text-white" : "text-black"
            }`}
          >
            {heading}
          </h3>

          {/* Description */}
          <p
            className={`mb-4 text-base ${
              isActive ? "text-white" : "text-gray-700"
            }`}
          >
            {text}
          </p>

          {/* Action Button */}
          <button
            onClick={() => {
              setFlipped(true);
              if (onFlip) onFlip();
            }}
            className={`mt-auto rounded-full px-4 py-2 font-semibold 
          transition-colors duration-500 ease-in-out
          ${
            isActive
              ? "bg-[#2CC4B9] text-white border border-white hover:bg-[#1BB6A8]"
              : "bg-white text-black border border-[#F6B949] hover:bg-[#fef0dd]"
          }
        `}
          >
            Zjistit více
          </button>
        </div>

        {/* Zadní strana */}
        <div
          className={`rounded-2xl p-6 text-center border-2 shadow-lg flex flex-col justify-between min-h-full overflow-hidden backface-hidden
        transition-colors duration-900 ease-in-out absolute inset-0 h-full
        ${
          isActive
            ? "bg-[#2CC4B9] text-white border-white border-solid"
            : "bg-white text-black border-[#F6B949] border-dotted"
        }
      `}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <h3
            className={`mb-2 text-xl font-semibold ${
              isActive ? "text-white" : "text-black"
            }`}
          >
            {heading}
          </h3>
          <p
            className={`text-base ${isActive ? "text-white" : "text-gray-700"}`}
          >
            {textLong}
          </p>
          <button
            onClick={() => {
              setFlipped(false);
              if (onUnflip) onUnflip();
            }}
            className={`mt-auto rounded-full px-4 py-2 font-semibold 
            transition-colors duration-500 ease-in-out
            ${
              isActive
                ? "bg-white text-[#2CC4B9] border border-white hover:bg-gray-100"
                : "bg-white text-black border border-[#F6B949] hover:bg-[#fef0dd]"
            }
          `}
          >
            Zpět
          </button>
        </div>
      </div>
    </div>
  );
}

export default FunkcionalitaBTN;
