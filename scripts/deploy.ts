import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

if (!process.env.PRIVATE_KEY || !process.env.API_URL) {
    throw new Error('Please set PRIVATE_KEY and API_URL in your .env file');
}

// Read the compiled contract
const contractJson = JSON.parse(fs.readFileSync('artifacts/TripleHelix.json', 'utf8'));
const triplehelixContract = contractJson.contracts['contracts/TripleHelix.sol:triplehelix'];

// Create wallet and public clients
const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);
const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(process.env.API_URL),
});

const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(process.env.API_URL),
});

async function main() {
    console.log('Deploying TripleHelix contract...');

    const hash = await walletClient.deployContract({
        abi: triplehelixContract.abi,
        bytecode: `0x${triplehelixContract.bin}`,
        args: [],
        account,
    });

    console.log('Transaction hash:', hash);

    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log('Contract deployed at:', receipt.contractAddress);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
}); 