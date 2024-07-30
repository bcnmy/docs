---
sidebar_label: "Use a session"
sidebar_position: 2
title: "Use a session"
---

:::info
Building in React? [check here](../../react/useSession.md)
:::

### Overview

This tutorial demonstrates how to use a simple session with viem and the Biconomy Smart Account with the `@biconomy/account` SDK. The provided code assumes you have a Biconomy Paymaster API key, and a valid session setup during the [previous step](./createSession). The following is appropriately viewed from the perspective of a dapp, looking to make txs on a users behalf.

You can get your Biconomy Paymaster API key from the dashboard [here](https://dashboard.biconomy.io/).

### Prerequisites

- Biconomy Paymaster API key
- A Bundler url if you don't want to use the testnet one, for Amoy you can use

```
https://bundler.biconomy.io/api/v2/80002/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44
```

- A session granted by a user [see the previous step](./createSession)

### Step 1: Setup

```typescript
import { polygonAmoy as chain } from "viem/chains";
import {
  PaymasterMode,
  createSessionSmartAccountClient,
  createSession,
  Rule,
  Policy,
  Session,
  getSingleSessionTxParams,
} from "@biconomy/account";

const nftAddress = "0x1758f42Af7026fBbB559Dc60EcE0De3ef81f665e";
const withSponsorship = {
  paymasterServiceData: { mode: PaymasterMode.SPONSORED },
};
const usersSmartAccountAddress = sessionStorageClient.smartAccountAddress;
```

### Step 2: Create the sessionSmartAccountClient

The [createSessionSmartAccountClient](https://bcnmy.github.io/biconomy-client-sdk/functions/createSessionSmartAccountClient.html) helper here is very similar to the [createSmartAccountClient](https://bcnmy.github.io/biconomy-client-sdk/functions/createSmartAccountClient.html), in that it returns a [BiconomySmartAccountV2](https://bcnmy.github.io/biconomy-client-sdk/classes/BiconomySmartAccountV2.html), but there are subtle differences in the configuration. createSessionSmartAccountClient expects **no** signer and a **mandatory** smartAccountAddress in the config (so that a dapp can emulate the users smartAccount without the original signer).

```typescript
const emulatedUsersSmartAccount = await createSessionSmartAccountClient(
  {
    accountAddress: usersSmartAccountAddress, // Dapp can set the account address on behalf of the user
    bundlerUrl,
    paymasterUrl,
    chainId,
  },
  usersSmartAccountAddress // Storage client, full Session or simply the smartAccount address if using default storage for your environment
);
```

### Step 3: Execute a tx on the users behalf

Next we can use the users smartAccount in the usual manner to generate txs. Txs generated for the emulatedSmartAccount must be relevant to the policy over which the user has previously signed.

```typescript
const nftMintTx = {
  to: nftAddress,
  data: encodeFunctionData({
    abi: parseAbi(["function safeMint(address _to)"]),
    functionName: "safeMint",
    args: [usersSmartAccountAddress],
  }),
};

const params = await getSingleSessionTxParams(
  usersSmartAccountAddress,
  chain,
  0 // index of the relevant policy leaf to the tx
);

const { wait } = await emulatedUsersSmartAccount.sendTransaction(nftMintTx, {
  ...params,
  ...withSponsorship,
});

const { success } = await wait();
```

Send the transaction using the users smartAccount and get the transaction hash. The transaction will be built into a User Operation and then send to the Bundler.

That's it! You've successfully emulated a users smartAccount to execute a transaction on their behalf using their session.
