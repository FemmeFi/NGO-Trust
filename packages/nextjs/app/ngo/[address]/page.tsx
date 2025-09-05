// packages/nextjs/app/ngo/[address]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
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

export default function NGODetailPage() {
  const params = useParams();
  const address = params.address as string;
  const [ngo, setNgo] = useState<NGO | null>(null);

  const { data: contractInfo } = useDeployedContractInfo("NGORegistry");
  const { data: ngoData } = useReadContract({
    address: contractInfo?.address,
    abi: contractInfo?.abi,
    functionName: "getNGOByAddress",
    args: [address],
  });

  useEffect(() => {
    if (ngoData) {
      setNgo(ngoData as unknown as NGO);
    }
  }, [ngoData]);

  if (!ngo) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4">Loading NGO information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Link href="/search" className="btn btn-outline">
          ← Back to Search
        </Link>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="card-title text-3xl mb-2">{ngo.name}</h1>
              {ngo.ensName && (
                <p className="text-lg text-ens mb-2">🌐 {ngo.ensName}</p>
              )}
              <p className="text-gray-600">{ngo.description}</p>
            </div>
            {ngo.isVerified && (
              <div className="badge badge-success gap-2">
                ✓ Verified
              </div>
            )}
          </div>

          <div className="divider"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Organization Details</h2>
              <div className="space-y-3">
                <p><strong>Website:</strong> {ngo.website || "Not provided"}</p>
                <p><strong>Location:</strong> {ngo.location}</p>
                <p><strong>President/Lead:</strong> {ngo.president}</p>
                <p><strong>Wallet Address:</strong> {ngo.walletAddress}</p>
                <p><strong>Registered:</strong> {new Date(ngo.registrationDate * 1000).toLocaleDateString()}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
              {ngo.avatar && (
                <div className="mb-4">
                  <img 
                    src={ngo.avatar} 
                    alt={ngo.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto"
                  />
                </div>
              )}
              <div className="badge badge-outline mr-2">NGO</div>
              <div className="badge badge-outline">Non-Profit</div>
            </div>
          </div>

          <div className="card-actions justify-end mt-6">
            <button className="btn btn-primary">Donate</button>
            <button className="btn btn-outline">Share</button>
          </div>
        </div>
      </div>
    </div>
  );
}