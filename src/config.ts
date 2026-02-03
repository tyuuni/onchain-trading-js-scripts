import { ethers } from 'ethers';

export enum ChainNetwork {
    ETH_MAINNET,
    ETH_SEPOLIA,
    ARBITRUM_ONE_MAINNET,
    ARBITRUM_ONE_SEPOLIA,
    BSC_MAINNET,
    BSC_TESTNET,
}

const ENDPOINT_BY_NETWORK = {
    [ChainNetwork.ETH_MAINNET]: 'https://eth-mainnet.g.alchemy.com/v2',
    [ChainNetwork.ETH_SEPOLIA]: 'https://eth-sepolia.g.alchemy.com/v2',
    [ChainNetwork.ARBITRUM_ONE_MAINNET]: 'https://arb-mainnet.g.alchemy.com/v2',
    [ChainNetwork.ARBITRUM_ONE_SEPOLIA]: 'https://arb-sepolia.g.alchemy.com/v2',
    [ChainNetwork.BSC_MAINNET]: 'https://bnb-mainnet.g.alchemy.com/v2',
    [ChainNetwork.BSC_TESTNET]: 'https://bnb-testnet.g.alchemy.com/v2',
};

export enum Erc20Symbol {
    TQQQon,
    USDT,
    WBNB,
}

const ERC20_ADDRESS_BY_NAME_BY_NETWORK = {
    [ChainNetwork.BSC_MAINNET]: {
        [Erc20Symbol.TQQQon]: '0xe42CfB20e00912409B77A602B5BDcfF3c7aCC5F4', // proxy address
        [Erc20Symbol.USDT]: '0x55d398326f99059fF775485246999027B3197955',
        [Erc20Symbol.WBNB]: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    },
    [ChainNetwork.BSC_TESTNET]: {
        [Erc20Symbol.TQQQon]: '0xe541504417670FB76b612B41B4392d967a1956c7', // no official address available, use USDT instead
        [Erc20Symbol.USDT]: '0x030bA81f1c18d280636F32af80b9AAd02Cf0854e',
        [Erc20Symbol.WBNB]: '0xae13d989dac2f0debff460ac112a837c89baa7cd',
    },
};

export const coinAddress = (symb: Erc20Symbol, network: ChainNetwork) => {
    return ERC20_ADDRESS_BY_NAME_BY_NETWORK[network][symb];
};

export const alchemyEndpoint = (network: ChainNetwork) => {
    const API_KEY = process.env.ALCHEMY_API_KEY as string;
    return `${ENDPOINT_BY_NETWORK[network]}/${API_KEY}`;
};

export const parseCommandLineArgs = () => {
    let shoudUseMainnet = false;
    const mainnetIndex = process.argv.findIndex(arg => arg === '-n');
    if (
        mainnetIndex !== -1 &&
        (process.argv[mainnetIndex + 1] || '') === 'mainnet'
    ) {
        shoudUseMainnet = true;
    }
    return {
        shoudUseMainnet,
    };
};

export const createJsonRpcProviderAndLogInfo = async (url: string) => {
    const provider = new ethers.JsonRpcProvider(url);
    const network = await provider.getNetwork();
    console.log('Network:', network.name, '\tID:', network.chainId);
    return provider;
};
