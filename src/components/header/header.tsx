"use client";
import { useAppSelector } from "@/store/hooks";
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react";

interface HeaderTheme {
  dark?: boolean;
}

export const Header = ({ dark } : HeaderTheme ) => {
  const { user } = useAppSelector((s) => s.auth);
  const [sticky, setSticky] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
  };
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
  });

  return (
    <header
      className={`header left-0 top-0 z-40 flex w-full items-center ${
        sticky
          ? "fixed z-[9998] bg-white shadow-sticky backdrop-blur-sm transition duration-300 ease-in"
          : `absolute ${ dark || sticky ? "bg-transparent" : "bg-gradient-to-t from-transparent from-0% to-dark-blue to-100%" }`
      }`}
    >
    
      <div className="container md:px-0 px-4 mx-auto">
        <div className="relative -mx-4 flex items-center justify-between">
          <div className="w-60 max-w-full px-4 xl:mr-12">
            <Link href={`${process.env.NEXT_PUBLIC_SUNCORE_URL}`} 
              className={`header-logo block w-full ${
                sticky ? "py-5 lg:py-2" : "py-8"
              } `}>
             { dark || sticky ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_CDN_URL}/images/logo/logo.svg`}
                alt="Suncore Logo Black"
                width={300}
                height={300}
                className="w-full"
              />
             ) : (
              <Image
                src={`${process.env.NEXT_PUBLIC_CDN_URL}/images/logo/logo-white.svg`}
                alt="Suncore Logo White"
                width={300}
                height={300}
                priority={true}
                className="w-full"
              /> ) }
            </Link>
          </div>
          <div className="flex w-full items-center justify-between px-4">
            <div className="ml-auto">
              <button
               onClick={navbarToggleHandler}
                id="navbarToggler"
                aria-label="Mobile Menu"
                className="absolute bg-black right-4 top-1/2 block translate-y-[-50%] rounded-full px-2 py-4 ring-primary focus:ring-2"
              >
                <span
                  className={`bg-white relative my-0.5 block h-0.5 w-[30px] transition-all duration-300 ${
                    navbarOpen ? " top-[3px] rotate-45" : " "
                  }`}
                />
                <span
                  className={`bg-white relative my-0.5 block h-0.5 w-[30px] transition-all duration-300 ${
                    navbarOpen ? "opacity-0 " : " "
                  }`}
                />
                <span
                  className={`bg-white relative my-0.5 block h-0.5 w-[30px] transition-all duration-300 ${
                    navbarOpen ? " top-[-5px] -rotate-45" : " "
                  }`}
                />
              </button>
              { user ? (
                <nav
                  id="navbarCollapse"
                  className={`navbar absolute right-0 z-30 w-[250px] rounded border-[.5px] border-body-color/50 bg-white px-6 py-4 duration-300 ${
                    navbarOpen
                      ? "visibility top-full opacity-100"
                      : "invisible top-[120%] opacity-0"
                  }`}
                >
                  <ul className="block lg:flex lg:space-x-12">
                    <li className="group relative">
                      <Link
                        href="#"
                        className={`flex py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 text-dark hover:text-primary dark:text-white/70 dark:hover:text-white`}>
                        {user.email}
                      </Link>
                      <Link
                        href="/auth/logout"
                        className={`flex py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 text-dark hover:text-primary dark:text-white/70 dark:hover:text-white`}>
                        Logout
                      </Link>
                    </li>
                  </ul>
                </nav>
              ) : (<></>)}
              
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}