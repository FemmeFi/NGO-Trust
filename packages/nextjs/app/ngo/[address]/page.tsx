"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { JsonRpcProvider } from "ethers";
import { useReadContract } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth/useDeployedContractInfo";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

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

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
  isError: string;
}

export default function NGOPage() {
  const params = useParams();
  const { targetNetwork } = useTargetNetwork();
  const [ngo, setNgo] = useState<NGO | null>(null);

  const [followers, setFollowers] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionsError, setTransactionsError] = useState<string | null>(null);
  const [ensNames, setEnsNames] = useState<Record<string, string>>({});

  const { data: contractInfo } = useDeployedContractInfo("NGORegistry" as any);

  const { data: allNGOs } = useReadContract({
    address: contractInfo?.address,
    abi: contractInfo?.abi,
    functionName: "getAllNGOs",
  });

  // --- Reverse ENS resolution function ---
  const resolveAddressToENS = useCallback(
    async (address: string): Promise<string | null> => {
      try {
        // Validate address before attempting ENS resolution
        if (!address || address.trim() === "" || !address.startsWith("0x") || address.length !== 42) {
          console.log("Skipping ENS resolution for invalid address:", address);
          return null;
        }

        // Use the target network's RPC URL for ENS resolution
        const rpcUrl = targetNetwork.rpcUrls.default.http[0];
        const provider = new JsonRpcProvider(rpcUrl);
        const ensName = await provider.lookupAddress(address);
        return ensName;
      } catch (err) {
        console.error("ENS reverse lookup failed:", err);
        return null;
      }
    },
    [targetNetwork.rpcUrls.default.http],
  );

  // Set the NGO based on address
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

  // Fetch followers & following from EFP API
  useEffect(() => {
    if (!ngo) return;

    const addressOrENS = ngo.ensName || ngo.walletAddress;

    const fetchFollowers = async () => {
      try {
        const res = await fetch(`https://api.ethfollow.xyz/api/v1/users/${addressOrENS}/followers`);
        const data = await res.json();
        setFollowers(data.followers?.map((f: any) => f.ens || f.address) || []);
      } catch (err) {
        console.error("Failed to fetch followers:", err);
      }
    };

    const fetchFollowing = async () => {
      try {
        const res = await fetch(`https://api.ethfollow.xyz/api/v1/users/${addressOrENS}/following`);
        const data = await res.json();
        setFollowing(data.following?.map((f: any) => f.ens || f.address) || []);
      } catch (err) {
        console.error("Failed to fetch following:", err);
      }
    };

    fetchFollowers();
    fetchFollowing();
  }, [ngo]);

  useEffect(() => {
    if (!ngo) return;

    const fetchTransactions = async () => {
      setTransactionsLoading(true);
      setTransactionsError(null);

      try {
        const walletAddress = ngo.walletAddress;
        console.log("Fetching transactions for address:", walletAddress);

        // Use our API route to avoid CORS issues
        const res = await fetch(`/api/transactions/${walletAddress}`);

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();
        console.log("API Response:", data);

        if (data.success) {
          const fetchedTransactions = data.transactions || [];
          setTransactions(fetchedTransactions);
          console.log("Transactions fetched successfully:", data.count, "transactions");

          // Debug: Log first few transactions to see their structure
          if (fetchedTransactions.length > 0) {
            console.log("Sample transaction data:", fetchedTransactions.slice(0, 2));
          }

          // Resolve ENS names for unique addresses in transactions
          const uniqueAddresses = new Set<string>();
          fetchedTransactions.forEach((tx: Transaction) => {
            // Only add valid addresses to the set
            if (tx.from && tx.from.trim() !== "" && tx.from.startsWith("0x") && tx.from.length === 42) {
              uniqueAddresses.add(tx.from.toLowerCase());
            }
            if (tx.to && tx.to.trim() !== "" && tx.to.startsWith("0x") && tx.to.length === 42) {
              uniqueAddresses.add(tx.to.toLowerCase());
            }
          });

          // Resolve ENS names for all unique addresses using the current network
          console.log("Resolving ENS names for", uniqueAddresses.size, "unique addresses");
          const ensPromises = Array.from(uniqueAddresses).map(async address => {
            const ensName = await resolveAddressToENS(address);
            return { address, ensName };
          });

          const ensResults = await Promise.all(ensPromises);
          const ensMap: Record<string, string> = {};
          ensResults.forEach(({ address, ensName }) => {
            if (ensName) {
              ensMap[address.toLowerCase()] = ensName;
            }
          });

          setEnsNames(ensMap);
        } else {
          setTransactions([]);
          // Don't show error for "No transactions found" - this is normal
          if (data.error && data.error !== "No transactions found") {
            setTransactionsError(data.error);
            console.warn("API returned error:", data.error);
          } else {
            console.log("No transactions found for this address");
          }
        }
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
        setTransactions([]);
        setTransactionsError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setTransactionsLoading(false);
      }
    };

    fetchTransactions();
  }, [ngo, resolveAddressToENS]);

  if (!ngo) {
    return (
      <div className="container mx-auto p-4 text-center py-12">
        <p className="text-gray-500 text-lg">NGO not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* NGO Info Section */}
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

      {/* NGO Details */}
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
            <strong>Registered:</strong> {new Date(Number(ngo.registrationDate) * 1000).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Followers & Following */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Following</h2>
          {following.length ? (
            <ul className="list-disc list-inside">
              {following.map((f, idx) => (
                <li key={idx}>{f}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No following data available.</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Followers</h2>
          {followers.length ? (
            <ul className="list-disc list-inside">
              {followers.map((f, idx) => (
                <li key={idx}>{f}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No followers data available.</p>
          )}
        </div>
      </div>

      {/* Transaction History */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>

        {transactionsLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="mt-2 text-gray-600">Loading transactions...</span>
            <span className="text-sm text-gray-400 mt-1">
              This may take a few seconds for addresses with many transactions
            </span>
          </div>
        ) : transactionsError ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading transactions</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{transactionsError}</p>
                  <p className="mt-1">Please check the console for more details.</p>
                </div>
              </div>
            </div>
          </div>
        ) : transactions.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Hash
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    From
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {transactions.slice(0, 10).map(tx => (
                  <tr key={tx.hash}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-gray-100">
                      <a
                        href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        title={tx.hash}
                      >
                        {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
                      </a>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                      title={tx.from}
                    >
                      {ensNames[tx.from.toLowerCase()] ? (
                        <div>
                          <div className="font-semibold text-blue-600 dark:text-blue-400">
                            {ensNames[tx.from.toLowerCase()]}
                          </div>
                          <div className="font-mono text-xs text-gray-500 dark:text-gray-400">
                            {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
                          </div>
                        </div>
                      ) : (
                        <span className="font-mono text-gray-900 dark:text-gray-100">
                          {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100" title={tx.to}>
                      {ensNames[tx.to.toLowerCase()] ? (
                        <div>
                          <div className="font-semibold text-blue-600 dark:text-blue-400">
                            {ensNames[tx.to.toLowerCase()]}
                          </div>
                          <div className="font-mono text-xs text-gray-500 dark:text-gray-400">
                            {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                          </div>
                        </div>
                      ) : (
                        <span className="font-mono text-gray-900 dark:text-gray-100">
                          {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {(parseInt(tx.value) / 1e18).toFixed(4)} ETH
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {new Date(parseInt(tx.timeStamp) * 1000).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {tx.isError === "0" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          Failed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {transactions.length > 10 && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                Showing first 10 transactions. View all on{" "}
                <a
                  href={`https://sepolia.etherscan.io/address/${ngo.walletAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Etherscan
                </a>
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No transaction data available.</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              This address may not have any transactions on Sepolia testnet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
