import React from "react";
import Link from "next/link";
import { hardhat } from "viem/chains";
import { GlobeAltIcon, HeartIcon, MagnifyingGlassIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { SwitchTheme } from "~~/components/SwitchTheme";
import { NGOTrustLogo } from "~~/components/assets/NGOTrustLogo";
import { Faucet } from "~~/components/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

/**
 * Site footer
 */
export const Footer = () => {
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  return (
    <div className="min-h-0 py-8 px-1 mb-11 lg:mb-0">
      <div>
        <div className="fixed flex justify-end items-center w-full z-10 p-4 bottom-0 left-0 pointer-events-none">
          <div className="flex flex-col md:flex-row gap-2 pointer-events-auto">
            {isLocalNetwork && (
              <>
                <Faucet />
                <Link
                  href="/blockexplorer"
                  passHref
                  className="btn btn-primary btn-sm font-normal gap-1 bg-gradient-to-r from-blue-500 to-blue-600 border-none"
                >
                  <MagnifyingGlassIcon className="h-4 w-4" />
                  <span>Block Explorer</span>
                </Link>
              </>
            )}
          </div>
          <SwitchTheme className={`pointer-events-auto ${isLocalNetwork ? "self-end md:self-auto" : ""}`} />
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="w-full bg-gradient-to-r from-blue-50 to-white rounded-t-2xl border-t border-blue-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Logo and Description */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <NGOTrustLogo width={40} height={40} />
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    NGO TRUST
                  </h3>
                  <p className="text-sm text-gray-600">Transparent NGO Registry</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Building trust in the NGO sector through blockchain technology. Transparent, verifiable, and accountable
                non-profit organizations.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Search NGOs
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Register NGO
                  </Link>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Features</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-gray-600">
                  <ShieldCheckIcon className="h-4 w-4 text-blue-500" />
                  Verified Organizations
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <GlobeAltIcon className="h-4 w-4 text-blue-500" />
                  Global Registry
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <HeartIcon className="h-4 w-4 text-red-500" />
                  Transparent Donations
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-blue-100 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <p className="m-0">
                  Built with <HeartIcon className="inline-block h-4 w-4 text-red-500" /> for transparency
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <a
                  href="https://github.com/scaffold-eth/se-2"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Fork on GitHub
                </a>
                <span className="text-gray-300">·</span>
                <a
                  href="https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
