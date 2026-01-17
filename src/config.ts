export enum ChainNetwork {
    ETH_MAINNET = 'https://eth-mainnet.g.alchemy.com/v2',
    ETH_SEPOLIA = 'https://eth-sepolia.g.alchemy.com/v2',
    ARBITRUM_ONE_MAINNET = 'https://arb-mainnet.g.alchemy.com/v2',
    ARBITRUM_ONE_SEPOLIA = 'https://arb-sepolia.g.alchemy.com/v2',
}

export const alchemyEndpoint = (network: ChainNetwork) => {
    const API_KEY = process.env.ALCHEMY_API_KEY as string;
    return `${network}/${API_KEY}`;
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
