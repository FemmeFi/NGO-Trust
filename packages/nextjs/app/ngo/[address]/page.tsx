// packages/nextjs/app/ngo/[address]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useReadContract } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth/useDeployedContractInfo";

// packages/nextjs/app/ngo/[address]/page.tsx

// packages/nextjs/app/ngo/[address]/page.tsx

// packages/nextjs/app/ngo/[address]/page.tsx

// packages/nextjs/app/ngo/[address]/page.tsx

// packages/nextjs/app/ngo/[address]/page.tsx

// packages/nextjs/app/ngo/[address]/page.tsx

// packages/nextjs/app/ngo/[address]/page.tsx

// packages/nextjs/app/ngo/[address]/page.tsx

// packages/nextjs/app/ngo/[address]/page.tsx

// packages/nextjs/app/ngo/[address]/page.tsx

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

export default function NGOPage() {
  const params = useParams();
  const [ngo, setNgo] = useState<NGO | null>(null);
  const { data: contractInfo } = useDeployedContractInfo("NGORegistry" as any);

  const { data: allNGOs } = useReadContract({
    address: contractInfo?.address,
    abi: contractInfo?.abi,
    functionName: "getAllNGOs",
  });

  useEffect(() => {
    if (allNGOs && params.address) {
      const address = Array.isArray(params.address) ? params.address[0] : params.address;
      const ngos = allNGOs as unknown as NGO[];
      const matchedNgo = ngos.find(n => n.walletAddress.toLowerCase() === address.toLowerCase());
      setNgo(matchedNgo || null);
    } else {
      setNgo(null);
    }
  }, [allNGOs, params.address]);

  if (!ngo) {
    return (
      <div className="container mx-auto p-4 text-center py-12">
        <p className="text-gray-500 text-lg">NGO not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        {ngo.avatar ? (
          <Image src={ngo.avatar} alt={`${ngo.name} avatar`} width={120} height={120} className="rounded-full" />
        ) : (
          <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
            No Avatar
          </div>
        )}

        <div>
          <h1 className="text-3xl font-bold">{ngo.name}</h1>
          {ngo.isVerified && <span className="badge badge-success mt-2 inline-block">Verified</span>}
          <p className="text-gray-600 mt-2">{ngo.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p>
            <span className="font-semibold">ENS Name:</span> {ngo.ensName || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Wallet Address:</span> {ngo.walletAddress}
          </p>
          <p>
            <span className="font-semibold">Location:</span> {ngo.location}
          </p>
        </div>

        <div>
          <p>
            <span className="font-semibold">President/Lead:</span> {ngo.president}
          </p>
          <p>
            <span className="font-semibold">Website:</span>{" "}
            {ngo.website ? (
              <a href={ngo.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                {ngo.website}
              </a>
            ) : (
              "N/A"
            )}
          </p>
          <p>
            <span className="font-semibold">Registered:</span>{" "}
            {new Date(ngo.registrationDate * 1000).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
