'use client'

import { MintNFT } from './components/MintNFT';

export default function Home() {
    return (
        <main className="min-h-screen p-8">
            <h1 className="text-4xl font-bold text-center mb-8">TripleHelix NFT Minting</h1>
            <MintNFT />
        </main>
    )
}