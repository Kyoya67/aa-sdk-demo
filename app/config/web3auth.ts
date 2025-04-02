import { CHAIN_NAMESPACES } from '@web3auth/base'
import type { Web3AuthOptions } from '@web3auth/modal'
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: '0xaa36a7',
    rpcTarget: `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
    displayName: 'Sepolia',
    ticker: 'ETH',
    tickerName: 'ETH',
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: { chainConfig }
});

export const web3AuthConfig: Web3AuthOptions = {
    clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || '',
    web3AuthNetwork: "cyan",
    chainConfig,
    uiConfig: {
        appName: "MercariNFT-AA-Demo",
        mode: "dark",
        loginMethodsOrder: ["google"],
        theme: {
            primary: "#00A95C"
        }
    },
    enableLogging: true,
    privateKeyProvider,
}; 