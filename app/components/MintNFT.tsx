'use client';

import { useState, useEffect } from 'react';
import { LocalAccountSigner, sepolia } from "@alchemy/aa-core";
import { createModularAccountAlchemyClient } from "@alchemy/aa-alchemy";
import { encodeFunctionData } from "viem";
import { TripleHelixABI } from '../../types/contracts';

const CONTRACT_ADDRESS = '0xf8bc2f54746b3ca7792f4b8a76aeb723b40f1f7c';

export function MintNFT() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string>('');
    const [walletAddress, setWalletAddress] = useState<string>('');
    const [smartAccountAddress, setSmartAccountAddress] = useState<string>('');

    const generateNewWallet = async () => {
        // Generate a random private key
        const privateKey = `0x${require("crypto").randomBytes(32).toString("hex")}` as `0x${string}`;

        // Create signer
        const signer = LocalAccountSigner.privateKeyToAccountSigner(privateKey);
        const address = await signer.getAddress();
        setWalletAddress(address);

        // Create client to get smart account address
        const client = await createModularAccountAlchemyClient({
            apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!,
            chain: sepolia,
            signer,
            gasManagerConfig: {
                policyId: "21bea94d-cc80-45e9-838b-525ff67267ae",
            },
        });

        // Get and set smart account address
        const smartAccount = await client.getAddress();
        setSmartAccountAddress(smartAccount);
    };

    // Generate new wallet on component mount
    useEffect(() => {
        generateNewWallet();
    }, []);

    const handleMint = async () => {
        try {
            setLoading(true);
            setResult('NFTのミントを開始します...\n');

            // Generate a random private key
            const privateKey = `0x${require("crypto").randomBytes(32).toString("hex")}` as `0x${string}`;
            setResult(prev => prev + `新しいプライベートキーを生成しました\n`);

            // Create signer
            const signer = LocalAccountSigner.privateKeyToAccountSigner(privateKey);
            const address = await signer.getAddress();
            setWalletAddress(address);
            setResult(prev => prev + `署名者を作成しました\nアドレス: ${address}\n`);

            // Create client
            const client = await createModularAccountAlchemyClient({
                apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!,
                chain: sepolia,
                signer,
                gasManagerConfig: {
                    policyId: "21bea94d-cc80-45e9-838b-525ff67267ae",
                },
            });

            // Get smart account address
            const smartAccount = await client.getAddress();
            setSmartAccountAddress(smartAccount);
            setResult(prev => prev + `スマートアカウントを初期化しました\nアドレス: ${smartAccount}\n`);

            // Create user operation
            const uo = {
                target: CONTRACT_ADDRESS as `0x${string}`,
                data: encodeFunctionData({
                    abi: TripleHelixABI,
                    functionName: "nftMint",
                    args: [],
                }),
            };
            setResult(prev => prev + `ユーザーオペレーションを作成しました\n`);

            // Send user operation
            const result = await client.sendUserOperation({
                uo,
            });
            setResult(prev => prev + `ユーザーオペレーションを送信しました\nハッシュ: ${result.hash}\n`);

            // Wait for transaction
            const txHash = await client.waitForUserOperationTransaction(result);
            setResult(prev => prev + `トランザクションハッシュ: ${txHash}\n`);
            setResult(prev => prev + `NFTのミントが完了しました！\n`);

            // Generate new wallet for next mint
            await generateNewWallet();

        } catch (error) {
            console.error('Error:', error);
            if (error instanceof Error) {
                setResult(prev => prev + `エラーが発生しました: ${error.message}\n`);
            } else {
                setResult(prev => prev + `エラーが発生しました: ${JSON.stringify(error)}\n`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Mint Your NFT</h2>
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">次回のミント情報</h3>
                <div className="space-y-2">
                    <div>
                        <p className="text-sm font-medium text-gray-600">署名用アドレス:</p>
                        <p className="text-sm font-mono break-all">{walletAddress || '生成中...'}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600">NFT所有者となるスマートアカウント:</p>
                        <p className="text-sm font-mono break-all">{smartAccountAddress || '生成中...'}</p>
                        {smartAccountAddress && (
                            <div className="mt-1">
                                <a
                                    href={`https://testnets.opensea.io/${smartAccountAddress}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-indigo-600 hover:text-indigo-800"
                                >
                                    OpenSea で表示 ↗
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <button
                onClick={handleMint}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
                {loading ? 'Minting...' : 'Mint NFT'}
            </button>
            <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">実行ログ</h2>
                <pre className="text-sm bg-gray-100 p-4 rounded whitespace-pre-wrap overflow-x-auto">
                    {result || 'ミントボタンを押してください'}
                </pre>
            </div>
        </div>
    );
} 