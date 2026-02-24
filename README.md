# TrustGraph Beta – Verifiable Knowledge explorer

TrustGraph is an experimental knowledge graph explorer built on the **Intuition Protocol**. It empowers users to search, build, and verify semantic relationships with on-chain trust signals (staking).

## 🚀 Key Features

- **Semantic Trust Graphs**: Explore atoms (entities) and triples (relationships) verified by on-chain stake.
- **AI-Ready Context**: Generate verifiable summaries of knowledge graphs for use in LLMs (RAG).
- **Testnet Verified**: Fully integrated with the **Intuition Testnet Beta** (Chain ID 13579).
- **Economic Proof of Truth**: Every claim is backed by a $TRUST stake weight, providing a signal of reliability.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + Shadcn UI
- **Blockchain Interface**: Wagmi 2.x + Viem + RainbowKit
- **Knowledge Core**: `@0xintuition/sdk` + GraphQL API
- **State/Query**: TanStack Query (React Query)

## 📦 Setup & Installation

1. **Clone & Install**:
   ```bash
   git clone <repository-url>
   cd trust-graph
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env.local` file with the following:
   ```env
   # RPC for Intuition Testnet
   NEXT_PUBLIC_TESTNET_RPC_URL=https://testnet.rpc.intuition.systems/http
   
   # GraphQL Endpoint for the Knowledge Graph
   NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://api.intuition.systems/graphql
   
   # (Optional) Token if required by API
   # NEXT_PUBLIC_GRAPHQL_TOKEN= 
   ```

3. **Development**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see your local app.

## 🚢 Deployment (Vercel)

1. **Push to GitHub**: Send your code to a new repository.
2. **Vercel Import**: Link the repository to Vercel.
3. **Add Environment Variables**: Copy the values from your `.env.local` to the Vercel project settings.
4. **Deploy**: Build and deploy the production bundle.

## 🧪 How to Test (Intuition Testnet)

1. **Connect Wallet**: Ensure your wallet (MetaMask/Rainbow) is connected to the **Intuition Testnet** (Chain ID: `13579`).
2. **Get Testnet $TRUST**: You will need testnet tokens to create or endorse triples. Check the Intuition portal or Discord for faucet details.
3. **Search Atoms**: Use the homepage search to find existing entities (e.g., "Intuition", "Bitcoin").
4. **Create Atoms**: If something doesn't exist, create it!
5. **Endorse Claims**: Click "Endorse" on a relationship to stake your $TRUST and verify the claim.
6. **AI Summary**: Navigate to an atom page and click **"Summarize for AI"** to see how TrustGraph grounds LLM prompts in verifiable data.

## 📝 Known Limitations (Beta)

- **Sparse Data**: As an MVP on testnet, many entities may not have relationships yet. Be a pioneer and start building the graph!
- **Experimental Protocol**: The Intuition SDK and GraphQL layer are in active development; breaking changes may occur.
- **Testnet-Only**: This version is hardcoded for Chain ID 13579. Mainnet support coming soon.

## 📬 Feedback & Support

We are in early Beta! If you find bugs or have feature requests:
- **Report via Google Form**: [Feedback Link](https://docs.google.com/forms/d/e/1FAIpQLSf7mtgMIpaF5PFAmstxpFoL9Fh5HB6ETD7cwnzl-kiowzI5WQ/viewform)
- **Documentation**: Visit [docs.intuition.systems](https://docs.intuition.systems)

---

Built for the **Intuition Protocol** | 2024 TrustGraph team
