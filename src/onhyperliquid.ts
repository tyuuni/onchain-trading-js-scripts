import { InfoClient, HttpTransport } from '@nktkas/hyperliquid';
import { parseCommandLineArgs } from './config';

const MACHIBIGBROTHER = '0x020ca66c30bec2c4fe3861a94e4db4a498a35872';

const play = async () => {
    const { shoudUseMainnet } = parseCommandLineArgs();
    const transport = new HttpTransport({
        isTestnet: !shoudUseMainnet,
    });
    const infoClient = new InfoClient({ transport });

    // const allMids = await infoClient.allMids();
    // console.log('all mids:', allMids);

    const accountInfo = await infoClient.activeAssetData({
        user: MACHIBIGBROTHER,
        coin: 'ETH',
    });

    console.log(accountInfo);

    const openOrders = await infoClient.openOrders({
        user: MACHIBIGBROTHER,
    });
    console.log('open orders:', openOrders);

    const userDetails = await infoClient.userDetails({
        user: MACHIBIGBROTHER,
    });
    // console.log('user details:', userDetails);
    for (let i = 0; i < userDetails.txs.length && i < 10; i++) {
        const tx = userDetails.txs[i];
        console.log('tx:', tx.action);
        console.log(
            `time ${new Date(tx.time).toISOString()}, type ${tx.action.type}`,
        );
    }
};

play();
