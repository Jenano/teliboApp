"use client";

import React from "react";

interface RecenzeProps {
  text: string;
  authorName: string;
  puvodRecenze: {
    text: string;
    url: string;
  };
  authorImage: string;
  reviewImage: string;
}

function Recenze({
  text,
  authorName,
  puvodRecenze,
  authorImage,
  reviewImage,
}: RecenzeProps) {
  return (
    <div className="bg-[#2CC4B9] py-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-start">
        {/* Left Side: img */}
        <div className="md:w-1/2">
          <img
            src={reviewImage}
            alt="Review"
            className="w-full h-auto object-cover rounded-md opacity-70 blur-[1px]"
          />
          <p className="text-sm text-white mt-2 ml-3 italic opacity-50">
            *ilustrační obrázek
          </p>
        </div>

        {/* Right Side: Review Content */}
        <div className="md:w-1/2 md:pl-8 text-white mt-8 py-8 md:mt-0">
          <h2 className="text-3xl md:text-4xl font-bold font-['Fredoka'] mb-4">
            Recenze
          </h2>
          <p className="text-lg mb-6 py-10 leading-relaxed">{text}</p>

          {/* Author Info */}
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img
                src={authorImage}
                alt={authorName}
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              <div>
                <p className="font-semibold text-base">{authorName}</p>
                <p className="text-sm">
                  zdroj:{" "}
                  <a
                    href={puvodRecenze.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-[#F6B949]"
                  >
                    {puvodRecenze.text}
                  </a>
                </p>
              </div>
            </div>
            <img
              src="/uvozovky.png"
              alt="Quotes"
              className="h-6 ml-2 opacity-90"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Recenze;
