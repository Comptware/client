"use client";

import Link from "next/link";
import Image from "next/image";


export const CompanyLogo = () => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
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
      </div>
    </div>
  );
};
