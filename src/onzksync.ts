import { ethers, formatEther } from 'ethers';
import { Provider, utils, types, Wallet } from 'zksync-ethers';
import { ChainNetwork, alchemyEndpoint, parseCommandLineArgs } from './config';

const play = async () => {
    const { shoudUseMainnet } = parseCommandLineArgs();

    console.log('using network:', shoudUseMainnet ? 'mainnet' : 'sepolia');
    const PRIVATE_KEY1 = process.env.ETH_KEY1 as string;

    const provider = Provider.getDefaultProvider(
        shoudUseMainnet ? types.Network.Mainnet : types.Network.Sepolia,
    );
    const ethProvider = ethers.getDefaultProvider(
        alchemyEndpoint(
            shoudUseMainnet
                ? ChainNetwork.ETH_MAINNET
                : ChainNetwork.ETH_SEPOLIA,
        ),
    );

    const wallet1 = new Wallet(PRIVATE_KEY1, provider, ethProvider);

    const [ethBalance, ethBalanceL1] = await Promise.all([
        wallet1.getBalance(),
        wallet1.getBalanceL1(),
    ]);

    console.log(
        'address:',
        wallet1.address,
        '\n\tL1 balance:',
        formatEther(ethBalanceL1),
        '\n\tZK balance:',
        formatEther(ethBalance),
    );
};

play();
