# Alephium Blockflow Visualizer

This app was developed for the first [Alephium Hackathon](https://alephium.org/hackathon/).

It visualizes [Alephium's sharding algorithm Blockflow in 3D](https://medium.com/@alephium/an-introduction-to-blockflow-alephiums-sharding-algorithm-bbbf318c3402).


## Blockflow explained
Alephium employs a sharded blockchain architecture, dividing its state into groups for parallel processing across multiple chains to boost throughput. Its distinctive sharding algorithm, Blockflow, leverages a Directed Acyclic Graph (DAG) to enable significant user experience enhancements, facilitating efficient, secure, and single-step transactions between groups. Blockflow intricately manages the interconnection of blocks across all chains, promoting high transaction rates (potentially up to 10,000 TPS) without sacrificing ledger integrity. This approach, alongside similar strategies by platforms like Polkadot, Zilliqa, and Kadena, underscores the scalability benefits of sharding in blockchain by allowing parallel data processing, with Alephium's Blockflow algorithm particularly noted for its contribution to scaling transaction capacity and enhancing security and user experience.

Currently, Alephium's mainnet is structured into 16 distinct chains, organized across 4 groups. A 3D model visually represents this setup, with each chain's blocks color-coded for clear differentiation. Intragroup blocks are depicted larger than intergroup blocks. The connections, or dependencies, between newly mined blocks and their predecessors are illustrated with lines. This 3D model dynamically updates with block data in real-time, offering a live visualization of Alephium's blockchain activity.

Dependency example: A new block is mined on chain (3,1). Seven dependencies exist. Four dependencies from each other chain inside the group [(3,0) - (3,1) - (3,2) - (3,3)] and three dependencies from intragroup chains [(0,0) - (1,1) - (2,2)]


## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
