import { ethers, formatEther, parseUnits } from 'ethers';
import ERC20_ABI from './abi/erc20.abi.json';
import PANCAKESWAP_FACTORY_ABI from './abi/pancakeswap-factory.abi.json';
import PANCAKESWAP_ROUTER_ABI from './abi/pancakeswap-router.abi.json';
import {
    ChainNetwork,
    alchemyEndpoint,
    parseCommandLineArgs,
    createJsonRpcProviderAndLogInfo,
    coinAddress,
    Erc20Symbol,
} from './config';

// see https://developer.pancakeswap.finance/contracts/v2/addresses
const PANCAKESWAP_V2_FACTORY_ADDRESS_MAINNET =
    '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73';

const PANCAKESWAP_V2_FACTORY_ADDRESS_TESTNET =
    '0x6725F303b657a9451d8BA641348b6761A6CC7a17';

const PANCAKESWAP_V2_ROUTER_ADDRESS_MAINNET =
    '0x10ED43C718714eb63d5aA57B78B54704E256024E';

const PANCAKESWAP_V2_ROUTER_ADDRESS_TESTNET =
    '0xD99D1c33F9fC3444f8101754aBC46c52416550D1';

const play = async () => {
    const { shoudUseMainnet } = parseCommandLineArgs();
    console.log('using network:', shoudUseMainnet ? 'mainnet' : 'testnet');
    const network = shoudUseMainnet
        ? ChainNetwork.BSC_MAINNET
        : ChainNetwork.BSC_TESTNET;
    const provider = await createJsonRpcProviderAndLogInfo(
        alchemyEndpoint(network),
    );

    const PRIVATE_KEY1 = process.env.ETH_KEY1 as string;
    const wallet1 = new ethers.Wallet(PRIVATE_KEY1, provider);
    console.log('wallet address:', wallet1.address);

    const tqqqAddress = coinAddress(Erc20Symbol.TQQQon, network);
    const usdtAddress = coinAddress(Erc20Symbol.USDT, network);
    const wbnbAddress = coinAddress(Erc20Symbol.WBNB, network);
    console.log('usdt address:', usdtAddress);
    console.log('tqqq address:', tqqqAddress);
    try {
        const pancakeswapRouter = new ethers.Contract(
            shoudUseMainnet
                ? PANCAKESWAP_V2_ROUTER_ADDRESS_MAINNET
                : PANCAKESWAP_V2_ROUTER_ADDRESS_TESTNET,
            PANCAKESWAP_ROUTER_ABI,
            provider,
        );

        const tqqqErc20 = new ethers.Contract(tqqqAddress, ERC20_ABI, provider);
        const usdtErc20 = new ethers.Contract(usdtAddress, ERC20_ABI, provider);

        const usdtDecimals = await usdtErc20.decimals();
        const tqqqDecimals = await tqqqErc20.decimals();

        console.log('usdt decimals:', usdtDecimals);
        console.log('tqqq decimals:', tqqqDecimals);

        const path = [tqqqAddress, wbnbAddress, usdtAddress];

        const amountIn = parseUnits('1', tqqqDecimals);
        // TODO: no liquidity pool for tqqq. this call will fail.
        const amountsOut = await pancakeswapRouter.getAmountsOut(
            amountIn,
            path,
        );
        console.log('tqqq price', amountsOut);

        const balanceOf = await tqqqErc20.balanceOf(wallet1.address);
        console.log('balance:', formatEther(balanceOf));
    } catch (error) {
        console.error('error:', error);
    }
};

play();
