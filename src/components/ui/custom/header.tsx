"use client";

import { useContext } from "react";
import { DepContext } from "../../context/dep-provider";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export function Header() {
  const path = usePathname();
  const router = useRouter();
  const { refs } = useContext(DepContext);

  function navigateToSection(section: "form") {
    if (path === "/") {
      if (!refs) return;

      const element = refs[section]?.current;

      if (!element) return;

      element.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/");
    }
  }

  return (
    <header
      className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white py-4 px-6 fixed top-0 left-0 right-0 z-10"
      role="banner"
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link
          href="/"
          passHref
          aria-label="AI Mixologist Home"
          className="text-2xl font-bold hover:text-yellow-400 transition duration-300"
        >
          AI Mixologist
        </Link>
        <nav aria-label="Main navigation">
          <ul className="flex">
            <li>
              <button
                onClick={() => navigateToSection("form")}
                className={`mx-2 px-3 py-2 hover:text-yellow-400 transition duration-300 rounded 
                  focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:text-yellow-400`}
              >
                New Recipe
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
