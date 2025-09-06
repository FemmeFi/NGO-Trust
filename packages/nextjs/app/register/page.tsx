// packages/nextjs/app/register/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Web3Button } from "@web3modal/react";
import { JsonRpcProvider } from "ethers";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth/useDeployedContractInfo";

// packages/nextjs/app/register/page.tsx

// packages/nextjs/app/register/page.tsx

// packages/nextjs/app/register/page.tsx

// packages/nextjs/app/register/page.tsx

// packages/nextjs/app/register/page.tsx

// packages/nextjs/app/register/page.tsx

// packages/nextjs/app/register/page.tsx

// packages/nextjs/app/register/page.tsx

// packages/nextjs/app/register/page.tsx

// packages/nextjs/app/register/page.tsx

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    president: "",
    ensName: "",
    avatar: "",
    walletAddress: "",
  });

  const [showENSModal, setShowENSModal] = useState(true);
  const [useENS, setUseENS] = useState(false);
  const [ensInput, setENSInput] = useState("");

  const { address, isConnected } = useAccount();
  const router = useRouter();

  const { data: contractInfo } = useDeployedContractInfo("NGORegistry" as any);
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // --- ENS avatar fetch ---
  const fetchAvatarFromENS = async (ensName: string) => {
    try {
      const provider = new JsonRpcProvider("https://sepolia.infura.io/v3/81ef477c6240455c8c56c5fd2a6ef8be");
      const resolver = await provider.getResolver(ensName);
      if (resolver) {
        const avatar = await resolver.getText("avatar");
        return avatar || null;
      }
      return null;
    } catch (err) {
      console.error("ENS fetch failed:", err);
      return null;
    }
  };

  // --- Resolve ENS to wallet address ---
  const fetchAddressFromENS = async (ensName: string) => {
    try {
      const provider = new JsonRpcProvider("https://sepolia.infura.io/v3/81ef477c6240455c8c56c5fd2a6ef8be");
      const resolvedAddress = await provider.resolveName(ensName);
      return resolvedAddress;
    } catch (err) {
      console.error("ENS resolve failed:", err);
      return null;
    }
  };

  const handleENSSubmit = async () => {
    if (!ensInput) return;

    const resolvedAddress = await fetchAddressFromENS(ensInput);
    if (!resolvedAddress) {
      alert("ENS name not found!");
      return;
    }

    const avatar = await fetchAvatarFromENS(ensInput);

    setFormData(prev => ({
      ...prev,
      ensName: ensInput,
      avatar: avatar || "",
      walletAddress: resolvedAddress,
    }));

    setShowENSModal(false);
  };

  const handleWalletChoice = () => {
    setUseENS(false);
    setShowENSModal(false);
  };

  // --- form submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // You still need a connected wallet to write to the blockchain
    if (!isConnected) {
      alert("Please connect your wallet to submit the form.");
      return;
    }

    if (!contractInfo?.address || !contractInfo?.abi) {
      console.error("Contract info missing");
      return;
    }

    try {
      await writeContract({
        address: contractInfo.address,
        abi: contractInfo.abi,
        functionName: "registerNGO",
        args: [
          formData.name,
          formData.description,
          formData.website,
          formData.location,
          formData.president,
          formData.ensName,
          formData.avatar,
        ],
      });
    } catch (err) {
      console.error("Contract call failed:", err);
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      router.push(`/ngo/${formData.walletAddress || address}`);
    }
  }, [isConfirmed, address, formData.walletAddress, router]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Register Your NGO</h1>
        <Link href="/" className="btn btn-outline">
          ← Back to Home
        </Link>
      </div>

      {!isConnected && !useENS ? (
        <div className="card bg-base-100 shadow-xl p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="mb-6">Please connect your wallet to register your NGO</p>
          <Web3Button />
        </div>
      ) : null}

      {/* ENS / Wallet choice modal */}
      {showENSModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md text-center">
            <h2 className="text-xl font-bold mb-4">Register With:</h2>
            <div className="flex flex-col gap-4">
              <button className="btn btn-primary" onClick={() => setUseENS(true)}>
                ENS Name
              </button>
              <button className="btn btn-secondary" onClick={handleWalletChoice}>
                Wallet Address
              </button>
            </div>

            {useENS && (
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Enter your ENS name"
                  value={ensInput}
                  onChange={e => setENSInput(e.target.value)}
                  className="input input-bordered w-full mb-2"
                />
                <button className="btn btn-primary w-full" onClick={handleENSSubmit}>
                  Fetch ENS Avatar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Form */}
      {!showENSModal && (
        <div className="card bg-base-100 shadow-xl p-6">
          <div className="mb-4">
            <h3 className="font-semibold">Connected Wallet</h3>
            <p className="text-sm text-gray-600">{formData.walletAddress || address}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">NGO Name *</label>
                <input
                  type="text"
                  placeholder="Green Peace International"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {!useENS && (
                <div>
                  <label className="label">ENS Name (optional)</label>
                  <input
                    type="text"
                    placeholder="greenpeace.eth"
                    value={formData.ensName}
                    onChange={e => setFormData({ ...formData, ensName: e.target.value })}
                    className="input input-bordered w-full"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="label">Description *</label>
              <textarea
                placeholder="Describe your NGO's mission and activities..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
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
                  onChange={e => setFormData({ ...formData, website: e.target.value })}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="label">Location *</label>
                <input
                  type="text"
                  placeholder="New York, USA"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
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
                  onChange={e => setFormData({ ...formData, president: e.target.value })}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div>
                <label className="label">Avatar *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="input input-bordered w-full"
                  required
                />
                {formData.avatar && (
                  <Image
                    src={formData.avatar}
                    alt="Avatar Preview"
                    width={96}
                    height={96}
                    className="mt-2 w-24 h-24 rounded-full object-cover"
                  />
                )}
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full mt-6" disabled={isPending || isConfirming}>
              {isPending ? "Confirming..." : isConfirming ? "Registering..." : "Register NGO"}
            </button>

            {hash && <div className="text-sm text-center">Transaction: {hash.substring(0, 10)}...</div>}
          </form>
        </div>
      )}
    </div>
  );
}
