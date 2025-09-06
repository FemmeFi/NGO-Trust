"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { hardhat } from "viem/chains";
import { Bars3Icon, MagnifyingGlassIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { NGOTrustLogo } from "~~/components/assets/NGOTrustLogo";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick, useTargetNetwork } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Search NGOs",
    href: "/search",
    icon: <MagnifyingGlassIcon className="h-4 w-4" />,
  },
  {
    label: "Register NGO",
    href: "/register",
    icon: <UserGroupIcon className="h-4 w-4" />,
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                  : "text-gray-700 hover:text-blue-600"
              } hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 focus:!bg-gradient-to-r focus:!from-blue-50 focus:!to-blue-100 active:!text-blue-600 py-2 px-4 text-sm rounded-lg gap-2 grid grid-flow-col transition-all duration-200 font-medium`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;
  const pathname = usePathname();
  const showWalletConnect = pathname === "/register";

  const burgerMenuRef = useRef<HTMLDetailsElement>(null);
  useOutsideClick(burgerMenuRef, () => {
    burgerMenuRef?.current?.removeAttribute("open");
  });

  return (
    <div className="sticky lg:static top-0 navbar bg-gradient-to-r from-white to-blue-50 min-h-0 shrink-0 justify-between z-20 shadow-lg border-b border-blue-100 px-0 sm:px-2">
      <div className="navbar-start w-auto lg:w-1/2">
        <details className="dropdown" ref={burgerMenuRef}>
          <summary className="ml-1 btn btn-ghost lg:hidden hover:bg-transparent">
            <Bars3Icon className="h-1/2" />
          </summary>
          <ul
            className="menu menu-compact dropdown-content mt-3 p-2 shadow-lg bg-white rounded-xl w-52 border border-blue-100"
            onClick={() => {
              burgerMenuRef?.current?.removeAttribute("open");
            }}
          >
            <HeaderMenuLinks />
          </ul>
        </details>
        <Link href="/" passHref className="hidden lg:flex items-center gap-3 ml-4 mr-6 shrink-0 group">
          <NGOTrustLogo width={48} height={48} />
          <div className="flex flex-col">
            <span className="font-bold leading-tight text-2xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              NGO TRUST
            </span>
            <span className="text-xs text-gray-600 font-medium">Transparent NGO Registry</span>
          </div>
        </Link>
        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-1">
          <HeaderMenuLinks />
        </ul>
      </div>
      <div className="navbar-end grow mr-4">
        {showWalletConnect && <RainbowKitCustomConnectButton />}
        {isLocalNetwork && <FaucetButton />}
      </div>
    </div>
  );
};
