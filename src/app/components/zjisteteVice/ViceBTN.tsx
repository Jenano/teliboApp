import React from "react";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

interface ViceBTNProps {
  buttonText: string;
  expandedText: string;
  isActive: boolean;
  onToggle: () => void;
}

function ViceBTN({
  buttonText,
  expandedText,
  isActive,
  onToggle,
}: ViceBTNProps) {
  return (
    <div>
      <button
        onClick={onToggle}
        className={`relative z-10 w-full text-left px-4 py-4 font-semibold rounded-xl transition-colors flex items-center justify-between ${
          isActive
            ? "bg-[#fb923c] text-white"
            : "bg-white text-black border border-gray-100"
        }`}
      >
        <span>{buttonText}</span>
        {isActive ? (
          <MinusIcon className="w-4 h-4" />
        ) : (
          <PlusIcon className="w-4 h-4" />
        )}
      </button>
      {isActive && (
        <div className="-mt-4 relative z-0 px-6 pb-4 pt-6 bg-white text-gray-800 font-['Fredoka'] rounded-lg border border-gray-200 shadow-md">
          <p className="leading-relaxed text-base">{expandedText}</p>
        </div>
      )}
    </div>
  );
}

export default ViceBTN;
