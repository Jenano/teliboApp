"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

function Nav() {
  const [open, setOpen] = useState(false);
  const navItems = [
    { label: "Domů", href: "#" },
    { label: "Jak to funguje", href: "#jaktofunguje" },
    { label: "Proč TeliBo", href: "#proctelibo" },
    { label: "Ukázka knihy", href: "#ukazkaknihy" },
    { label: "Zjistěte více", href: "#zjistetevice" },
    { label: "Recenze", href: "#recenze" },
  ];

  return (
    <nav className="bg-white shadow-md fixed w-full z-20 top-0 left-0">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logoTelibo.png"
                alt="Telibo Logo"
                width={48}
                height={48}
              />
              <div className="flex flex-col leading-tight">
                <span className="-mb-1 text-2xl font-extrabold text-[#2CC4B9] font-['Fredoka']">
                  TeliBo
                </span>
                <span className="text-xs text-[#2CC4B9] font-['Fredoka'] w-32">
                  Angličtina pro malé objevitele
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex md:space-x-6 md:items-center ">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="mx-0 p-3 rounded hover:bg-gray-100 text-gray-700 hover:text-teal-500 font-['Fredoka'] font-bold"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Buttons */}
          <div className="hidden lg:flex md:items-center md:space-x-4">
            <>
              <Link
                href="/prihlaseni?mode=register"
                className="px-4 py-2 bg-[#fb923c] hover:bg-[#E5A743] text-white rounded-full shadow-md font-['Fredoka'] font-bold hover:shadow-lg"
              >
                Registrace
              </Link>
              <Link
                href="/prihlaseni?mode=login"
                className="px-4 py-2 border border-gray-300 hover:border-teal-500 text-gray-700 rounded-full font-['Fredoka'] font-bold shadow-md hover:shadow-lg"
              >
                Přihlášení
              </Link>
            </>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setOpen(!open)}
              aria-label="Otevřít menu"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {open ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded-md text-base text-gray-700 hover:text-teal-500 font-['Fredoka'] font-bold"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="px-5 pb-4 flex flex-col space-y-2">
            <Link
              href="/prihlaseni?mode=register"
              className="px-4 py-2 bg-[#fb923c] hover:bg-[#E5A743] text-white rounded-full shadow-md font-['Fredoka'] font-bold hover:shadow-lg"
            >
              Registrace
            </Link>
            <Link
              href="/prihlaseni?mode=login"
              className="px-4 py-2 border border-gray-300 hover:border-teal-500 text-gray-700 rounded-full font-['Fredoka'] font-bold shadow-md hover:shadow-lg"
            >
              Přihlášení
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Nav;
