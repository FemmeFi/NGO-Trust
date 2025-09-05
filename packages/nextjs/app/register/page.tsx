// packages/nextjs/app/register/page.tsx
"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth/useDeployedContractInfo";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    president: "",
    ensName: "",
    avatar: ""
  });

  const { address, isConnected } = useAccount();
  const router = useRouter();
  
  const { data: contractInfo } = useDeployedContractInfo("NGORegistry");
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) return;

    writeContract({
      address: contractInfo?.address,
      abi: contractInfo?.abi,
      functionName: "registerNGO",
      args: [
        formData.name,
        formData.description,
        formData.website,
        formData.location,
        formData.president,
        formData.ensName,
        formData.avatar
      ],
    });
  };

  if (isConfirmed) {
    router.push(`/ngo/${address}`);
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Register Your NGO</h1>
        <Link href="/" className="btn btn-outline">
          ← Back to Home
        </Link>
      </div>

      {!isConnected ? (
        <div className="card bg-base-100 shadow-xl p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="mb-6">Please connect your wallet to register your NGO</p>
          <w3m-connect-button />
        </div>
      ) : (
        <div className="card bg-base-100 shadow-xl p-6">
          <div className="mb-4">
            <h3 className="font-semibold">Connected Wallet</h3>
            <p className="text-sm text-gray-600">{address}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">NGO Name *</label>
                <input
                  type="text"
                  placeholder="Green Peace International"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div>
                <label className="label">ENS Name (optional)</label>
                <input
                  type="text"
                  placeholder="greenpeace.eth"
                  value={formData.ensName}
                  onChange={(e) => setFormData({...formData, ensName: e.target.value})}
                  className="input input-bordered w-full"
                />
              </div>
            </div>

            <div>
              <label className="label">Description *</label>
              <textarea
                placeholder="Describe your NGO's mission and activities..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="textarea textarea-bordered w-full"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Website</label>
                <input
                  type="url"
                  placeholder="https://your-ngo.org"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="label">Location *</label>
                <input
                  type="text"
                  placeholder="New York, USA"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="input input-bordered w-full"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">President/Lead *</label>
                <input
                  type="text"
                  placeholder="John Smith"
                  value={formData.president}
                  onChange={(e) => setFormData({...formData, president: e.target.value})}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div>
                <label className="label">Avatar URL (optional)</label>
                <input
                  type="url"
                  placeholder="https://example.com/avatar.png"
                  value={formData.avatar}
                  onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                  className="input input-bordered w-full"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full mt-6"
              disabled={isPending || isConfirming}
            >
              {isPending ? "Confirming..." : isConfirming ? "Registering..." : "Register NGO"}
            </button>

            {hash && (
              <div className="text-sm text-center">
                Transaction: {hash.substring(0, 10)}...
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}