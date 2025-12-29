import { Input, Link, Navbar, NavbarBrand, NavbarContent } from "@nextui-org/react";
import { SupportIcon } from "../icons/navbar/support-icon";
import { SearchIcon } from "../icons/searchicon";
import { NotificationsDropdown } from "./notifications-dropdown";
import { UserDropdown } from "./user-dropdown";
import Image from "next/image";
import { useSidebarContext } from "../layout/layout-context";

export const NavbarWrapper = () => {
  const { setCollapsed } = useSidebarContext();
  return (
    <div
    // className="fixed top-0 z-[9998] w-full bg-white" //will revert to this after moving ops dash to admin app
    className="fixed top-0 w-full bg-background"
    >
      <Navbar
        className="w-full mb-8"
        classNames={{
          wrapper: "w-full max-w-full",
        }}
      >
        <NavbarContent className="w-full">
          <div className="h-full flex items-center md:hidden">
            <div
              className="flex flex-col justify-around w-6 h-6 bg-transparent border-none cursor-pointer padding-0 z-[202] focus:outline-none [&_div]:w-6 [&_div]:h-px [&_div]:bg-default-900 [&_div]:rounded-xl  [&_div]:transition-all  [&_div]:relative  [&_div]:origin-[1px]"
              onClick={setCollapsed}>
              <div />
              <div />
            </div>
          </div>
          <NavbarBrand className="flex-1">
            <Link href={`${process.env.NEXT_PUBLIC_SUNCORE_URL}`} 
              className="relative w-28 h-10 sm:w-40 sm:h-12">
              <Image
                src={`${process.env.NEXT_PUBLIC_CDN_URL}/images/logo/logo.svg`}
                alt="Suncore Logo Black"
                fill
                className="object-contain block dark:hidden"
              />
              <Image
                src={`${process.env.NEXT_PUBLIC_CDN_URL}/images/logo/logo-white.svg`}
                alt="Suncore Logo White"
                fill
                className="object-contain hidden dark:block"
              />
            </Link>
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent className="w-full max-md:hidden">
          <Input
            startContent={<SearchIcon />}
            isClearable
            className="w-full"
            classNames={{
              input: "w-full",
              mainWrapper: "w-full",
            }}
            placeholder="Search..."
          />
        </NavbarContent>
        <NavbarContent
          justify="end"
          className="w-fit data-[justify=end]:flex-grow-0"
        >
          {/* <div className="flex items-center gap-2 max-md:hidden">
            <FeedbackIcon />
            <span>Feedback?</span>
          </div> */}

          <NotificationsDropdown />

          <div className="max-md:hidden">
            <SupportIcon />
          </div>
          <NavbarContent>
            <UserDropdown />
          </NavbarContent>
        </NavbarContent>
      </Navbar>
      <div className="mx-8 py-4 bg-background">
        <p className="md:text-5xl text-3xl text-default-900 font-normal mb-8 font-caslon md:text-left text-center">Your account dashboard</p>
        <hr className="border-primary my-4 w-full" />
      </div>
    </div>
  );
};
