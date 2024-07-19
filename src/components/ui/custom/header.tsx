"use client";

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { DepContext } from "../../context/dep-provider";
import { usePathname, useRouter } from "next/navigation";

export function Header() {
  const path = usePathname();
  const router = useRouter();

  const [isVisible, setIsVisible] = useState(true);

  const { refs } = useContext(DepContext);
  const headerRef = refs?.header;

  function navigateToSection(section: "form") {
    if (path !== "/") {
      router.push("/");
    }

    if (!refs) return;

    const element = refs[section]?.current;

    if (!element) return;

    element.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    if (!headerRef) return;

    const headerRefCurrent = headerRef.current;

    /* 
      TODO: this observer will only hide/show the header using the top placeholder
      make the header hide when scrolling down and show when scrolling up
    */
    const observer = new IntersectionObserver(
      ([entry]) => {
        // when the absolute placeholder gets in or out of view
        // this will toggle the state of the header
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
      }
    );

    if (headerRefCurrent) {
      observer.observe(headerRefCurrent);
    }

    return () => {
      if (headerRefCurrent) {
        observer.unobserve(headerRefCurrent);
      }
    };
  }, [headerRef]);

  return (
    <>
      <div
        className="absolute top-0 h-1"
        />
      <header
        ref={headerRef}
        className={`bg-gradient-to-r from-purple-700 to-indigo-800 text-white 
          py-4 fixed top-0 left-0 right-0 z-10 transition-transform duration-300 ${
            isVisible ? "translate-y-0" : "-translate-y-full"
          }`}
        role="banner"
      >
        <div className="mx-auto flex justify-between items-center mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
            <ul className="flex">
              <li>
                <Link
                  href="/account/cocktails"
                  className={`mx-2 px-3 py-2 hover:text-yellow-400 transition duration-300 rounded 
                  focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:text-yellow-400`}
                >
                  Previous
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
