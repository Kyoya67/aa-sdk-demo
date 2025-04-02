import { Hex, createWalletClient, http, publicActions } from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import Example from "../artifacts/Example.json";
import dotenv from "dotenv";

dotenv.config();

const { abi, bin } = Example["contracts"]["contracts/Example.sol:Example"];

const privateKey = `0x${process.env.PRIVATE_KEY}` as Hex;
const account = privateKeyToAccount(privateKey);

(async () => {
  const client = createWalletClient({
    account,
    chain: sepolia,
    transport: http(process.env.API_URL),
  }).extend(publicActions);

  const hash = await client.deployContract({
    abi,
    bytecode: `0x${bin}`,
  });

  console.log("Deployment transaction hash:", hash);
  console.log("Waiting for transaction to be mined...");

  const receipt = await client.waitForTransactionReceipt({ hash });
  console.log("Contract deployed at:", receipt.contractAddress);
})();
