# NGO Transparency Platform

A decentralized website for registering, browsing, and interacting with NGOs on the blockchain. 

Access the website here: [NTP FemmeFi](https://ntp-femmefi.vercel.app/)

## Features

* **Register NGO:** Users can connect their wallet and register an NGO with basic details.
* **Browse NGOs:** Search and view detailed information about registered NGOs.
* **Wallet Integration:** Supports Ethereum wallets.
* **Smart Contract Interaction:** Uses Wagmi hooks to read/write to deployed contracts.
* **IPFS-ready Build:** Optional static export for IPFS deployment.
* **Responsive Design:** Works on desktop and mobile.

## Tech Stack

* **Frontend:** Next.js, TypeScript, TailwindCSS
* **Smart Contracts:** Solidity, Hardhat
* **Blockchain Integration:** Wagmi, Web3Modal, ethers.js
* **Deployment:** Vercel

## Project Structure

```
packages/
└── nextjs/             # Next.js frontend
    ├── app/            # App Router pages
    ├── components/     # UI components & reusable parts
    ├── hooks/          # Custom hooks
    ├── public/         # Static assets
    ├── next.config.ts  # Next.js configuration
    └── package.json
packages/
└── hardhat/            # Smart contracts
    ├── contracts/
    ├── scripts/
    └── package.json
```

## Clone This Repository

### Prerequisites

* Node.js v20+
* Yarn
* Hardhat
* Metamask or another Ethereum wallet

### Installation

1. Clone the repository:

```bash
git clone https://github.com/FemmeFi/NGO-Trust/tree/main
cd NGO-Trust
```

2. Install dependencies for both `nextjs` and `hardhat`:

```bash
cd packages/nextjs
yarn install

cd ../hardhat
yarn install
```


### Running Locally

#### Smart Contracts

```bash
cd packages/hardhat
yarn deploy 
```

#### Frontend

```bash
cd packages/nextjs
yarn dev             
```

* Open [http://localhost:3000](http://localhost:3000) in your browser.
* Connect your wallet and test registration/search.

### Deployment

1. Make sure your `NEXT_PUBLIC_*` environment variables are set in Vercel.
2. Push your branch to GitHub.
3. In Vercel:

   * Select your branch for deployment.
   * Vercel automatically builds and deploys.

## Development Workflow

* **Branches:**

  * `main` — stable production code
  * `deployment` — current deployment-ready scaffold
  * `backup-deployment` — a backup deployment



## Contributing

1. Fork the repository.
2. Create a branch for your feature: `git checkout -b feature-name`.
3. Make changes
4. Commit and push.
5. Open a Pull Request against the `main` branch.