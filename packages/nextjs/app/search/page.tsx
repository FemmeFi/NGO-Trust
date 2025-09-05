// packages/nextjs/app/search/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth/useDeployedContractInfo";
import Link from "next/link";

interface NGO {
  name: string;
  description: string;
  website: string;
  location: string;
  president: string;
  ensName: string;
  avatar: string;
  walletAddress: string;
  isVerified: boolean;
  registrationDate: number;
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredNGOs, setFilteredNGOs] = useState<NGO[]>([]);
  
  const { data: contractInfo } = useDeployedContractInfo("NGORegistry" as any);
  const { data: allNGOs } = useReadContract({
    address: contractInfo?.address,
    abi: contractInfo?.abi,
    functionName: "getAllNGOs",
  });

  useEffect(() => {
    if (allNGOs) {
      const ngos = allNGOs as unknown as NGO[];
      if (!searchTerm) {
        setFilteredNGOs(ngos);
      } else {
        const filtered = ngos.filter(ngo =>
          ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (ngo.ensName && ngo.ensName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          ngo.walletAddress.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredNGOs(filtered);
      }
    }
  }, [allNGOs, searchTerm]);

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Search NGOs</h1>
        <p className="text-gray-600">
          Discover registered NGOs by name, ENS domain, or wallet address
        </p>
      </div>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by NGO name, ENS, or wallet address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full max-w-2xl mx-auto block"
        />
      </div>

      {filteredNGOs.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No NGOs found matching "{searchTerm}"</p>
          <p className="text-sm text-gray-400 mt-2">
            Try a different search term or check the spelling
          </p>
        </div>
      )}

      {filteredNGOs.length === 0 && !searchTerm && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No NGOs registered yet</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNGOs.map((ngo, index) => (
          <Link key={index} href={`/ngo/${ngo.walletAddress}`}>
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer">
              <div className="card-body">
                <h2 className="card-title">{ngo.name}</h2>
                <p className="text-sm text-gray-600 line-clamp-2">{ngo.description}</p>
                
                <div className="space-y-2 mt-4">
                  {ngo.ensName && (
                    <p className="text-sm">
                      <span className="font-semibold">ENS:</span> {ngo.ensName}
                    </p>
                  )}
                  <p className="text-sm">
                    <span className="font-semibold">Wallet:</span> {ngo.walletAddress.substring(0, 8)}...
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Location:</span> {ngo.location}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">President:</span> {ngo.president}
                  </p>
                </div>

                <div className="card-actions justify-end mt-4">
                  <span className="badge badge-success">View Details</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}