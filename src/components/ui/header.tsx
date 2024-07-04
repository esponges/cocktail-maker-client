"use client";

import { useContext } from "react";
import { DepContext } from "../context/dep-provider";
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
      className={`bg-gradient-to-r from-purple-600 to-indigo-700 text-white 
      py-4 px-6 fixed top-0 left-0 right-0 z-10`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <div className="text-2xl font-bold">AI Mixologist</div>
        </Link>
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
