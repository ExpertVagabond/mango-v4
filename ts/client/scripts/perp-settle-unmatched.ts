import { MANGO_V4_ID, MangoClient, PerpMarketIndex, sleep } from '../src';
import { AnchorProvider, Wallet } from '@coral-xyz/anchor';
import { Cluster, Connection, Keypair, PublicKey } from '@solana/web3.js';
import fs from 'fs';

const CLUSTER: Cluster =
  (process.env.CLUSTER_OVERRIDE as Cluster) || 'mainnet-beta';
const CLUSTER_URL =
  process.env.CLUSTER_URL_OVERRIDE || process.env.MB_CLUSTER_URL;
const USER_KEYPAIR =
  process.env.USER_KEYPAIR_OVERRIDE || process.env.MB_PAYER_KEYPAIR;
const GROUP_PK =
  process.env.GROUP_PK || '78b8f4cGCwmZ9ysPFMWLaLTkkaYnUjwMJYStWe5RTSSX';
const PERP_MARKET_INDEX = Number(
  process.env.PERP_MARKET_INDEX,
) as PerpMarketIndex;

/**
 * This code is intended to be used one perp market at a time. After running for one perp market,
 * Run perp-sanity-check afterwards to see if the perp market has been zeroed out
 */
async function perpSettleUnmatched(): Promise<void> {
  const options = AnchorProvider.defaultOptions();
  const connection = new Connection(CLUSTER_URL!, options);
  const user = Keypair.fromSecretKey(
    Buffer.from(
      JSON.parse(
        process.env.KEYPAIR || fs.readFileSync(USER_KEYPAIR!, 'utf-8'),
      ),
    ),
  );
  const userWallet = new Wallet(user);
  const userProvider = new AnchorProvider(connection, userWallet, options);
  const client = MangoClient.connect(
    userProvider,
    CLUSTER,
    MANGO_V4_ID[CLUSTER],
    {
      idsSource: 'get-program-accounts',
    },
  );

  const group = await client.getGroup(new PublicKey(GROUP_PK));
  const pm = group.getPerpMarketByMarketIndex(PERP_MARKET_INDEX);
  console.log(pm.name);
  if (!pm.reduceOnly) {
    throw new Error(`Unexpected reduce only state ${pm.reduceOnly}`);
  }
  if (!pm.forceClose) {
    throw new Error(`Unexpected force close state ${pm.forceClose}`);
  }

  const mangoAccounts = await client.getAllMangoAccounts(group);
  const negPnlAccounts = mangoAccounts.filter((a) => {
    const pp = a.getPerpPosition(PERP_MARKET_INDEX);
    return pp && pp.getUnsettledPnlUi(pm) < 0;
  });

  for (const account of negPnlAccounts) {
    const negPnl = account
      .getPerpPosition(PERP_MARKET_INDEX)!
      .getUnsettledPnlUi(pm);
    console.log(`Settling: ${account.publicKey} - ${negPnl}`);

    const sig = await client.perpSettleUnmatched(
      group,
      account,
      PERP_MARKET_INDEX,
      1, // Do $1 at a time in the beginning
    );
    console.log(`sig - ${sig}`);
    await sleep(1000);
    await account.reload(client);
    console.log(`Settling: ${account.publicKey} - ${negPnl}`);
    return;
  }
}

perpSettleUnmatched();
