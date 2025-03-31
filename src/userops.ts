import { LocalAccountSigner, sepolia } from "@alchemy/aa-core";
import Example from "../artifacts/Example.json";
import dotenv from "dotenv";
import { createModularAccountAlchemyClient } from "@alchemy/aa-alchemy";
import { encodeFunctionData } from "viem";

dotenv.config();

const { abi } = Example["contracts"]["contracts/Example.sol:Example"];

const privateKey = require("crypto").randomBytes(32).toString("hex");
// signer (userop) -> bundler eoa (transaction [userop,userop]) -> EP -> sca -> contract
const signer = LocalAccountSigner.privateKeyToAccountSigner(`0x${privateKey}`);

const contractAddress = "0x1292586311d3f5580d292de789dd3a5c559be21c";

(async () => {
  // modular account client
  const client = await createModularAccountAlchemyClient({
    apiKey: process.env.API_KEY,
    chain: sepolia,
    signer,
    gasManagerConfig: {
      policyId: process.env.POLICY_ID!,
    },
  });

  const uos = [1, 2, 3, 4, 5, 6, 7].map((x) => {
    return {
      target: contractAddress as `0x${string}`,
      data: encodeFunctionData({
        abi,
        functionName: "changeX",
        args: [x],
      }),
    }
  })

  const cd = encodeFunctionData({
    abi,
    functionName: "changeX",
    args: [98n],
  });

  const result = await client.sendUserOperation({
    uo: uos,
  });

  const txHash = await client.waitForUserOperationTransaction(result);
  console.log(txHash);

  const x = await client.readContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: "x",
  });
  console.log(x);
})();
