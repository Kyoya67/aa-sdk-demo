'use client'

import { useState } from 'react'
import { LocalAccountSigner, sepolia } from "@alchemy/aa-core"
import { createModularAccountAlchemyClient } from "@alchemy/aa-alchemy"
import { encodeFunctionData } from "viem"
import Example from "../../artifacts/Example.json"

const { abi } = Example["contracts"]["contracts/Example.sol:Example"]
const contractAddress = "0x1292586311d3f5580d292de789dd3a5c559be21c"

export default function Demo() {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<string>('')
    const [currentValue, setCurrentValue] = useState<string>('')
    const [walletAddress, setWalletAddress] = useState<string>('')

    const runDemo = async () => {
        try {
            setLoading(true)
            setResult('デモを開始します...\n')

            // Generate a random private key
            const privateKey = require("crypto").randomBytes(32).toString("hex")
            setResult(prev => prev + `新しいプライベートキーを生成しました\n`)

            // Create signer
            const signer = LocalAccountSigner.privateKeyToAccountSigner(`0x${privateKey}`)
            const address = await signer.getAddress()
            setWalletAddress(address)
            setResult(prev => prev + `署名者を作成しました\nアドレス: ${address}\n`)

            // Create client
            const client = await createModularAccountAlchemyClient({
                apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!,
                chain: sepolia,
                signer,
                gasManagerConfig: {
                    policyId: "21bea94d-cc80-45e9-838b-525ff67267ae",
                },
            })
            setResult(prev => prev + `クライアントを初期化しました\n`)

            // Create user operations
            const uos = [1, 2, 3].map((x) => ({
                target: contractAddress as `0x${string}`,
                data: encodeFunctionData({
                    abi,
                    functionName: "changeX",
                    args: [x],
                }),
            }))
            setResult(prev => prev + `ユーザーオペレーションを作成しました\n`)

            // Send user operations
            const result = await client.sendUserOperation({
                uo: uos,
            })
            setResult(prev => prev + `ユーザーオペレーションを送信しました\nハッシュ: ${result.hash}\n`)

            // Wait for transaction
            const txHash = await client.waitForUserOperationTransaction(result)
            setResult(prev => prev + `トランザクションハッシュ: ${txHash}\n`)

            // Read current value
            const x = await client.readContract({
                address: contractAddress as `0x${string}`,
                abi,
                functionName: "x",
            }) as bigint
            setCurrentValue(x.toString())
            setResult(prev => prev + `現在の値: ${x}\n`)

        } catch (error) {
            console.error('Error:', error)
            if (error instanceof Error) {
                setResult(prev => prev + `エラーが発生しました: ${error.message}\n`)
            } else {
                setResult(prev => prev + `エラーが発生しました: ${JSON.stringify(error)}\n`)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Account Abstraction Demo</h1>
            <div className="mb-4">
                <button
                    onClick={runDemo}
                    disabled={loading}
                    className={`bg-blue-500 text-white px-4 py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                >
                    {loading ? 'デモ実行中...' : 'デモを実行'}
                </button>
            </div>
            {walletAddress && (
                <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">ウォレットアドレス</h2>
                    <p className="text-sm font-mono bg-gray-100 p-2 rounded break-all">{walletAddress}</p>
                </div>
            )}
            <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">現在の値</h2>
                <p className="text-lg">{currentValue || '未取得'}</p>
            </div>
            <div>
                <h2 className="text-xl font-semibold mb-2">実行ログ</h2>
                <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
                    {result || 'デモを実行してください'}
                </pre>
            </div>
        </div>
    )
}