"use client";

import { useContext } from "react";
import { DepContext } from "../context/dep-provider";

/* eslint-disable max-len */
export function Header() {
  const { refs } = useContext(DepContext);

  function navigateToSection(section: 'form') {
    if (!refs) return;

    const element = refs[section]?.current;

    if (!element) return;

    element.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-4 px-6 fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">AI Mixologist</div>
        <nav>
          <button
            onClick={() => navigateToSection("form")}
            className="mx-2 hover:text-yellow-400 transition duration-300"
          >
            New Recipe
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
