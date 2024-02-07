---
sidebar_label: "Send a batch of transactions"
sidebar_position: 2
title: "Send a batch of transactions"
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

### Overview

This tutorial demonstrates how to send a batch of transactions using ethers.js/viem and the Biconomy Smart Account with the `@biconomy/account` SDK.

### Prerequisites

- Node.js installed on your machine
- A Bundler url if you don't want to use the testnet one (for mumbai you can use https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44)
- An rpc url (for mumbai can use https://rpc.ankr.com/polygon_mumbai)
- An address to send the transaction to (replace `0xaddress`)

### Step 1: Generate the config and Create Biconomy Smart Account

<Tabs>
<TabItem value="viem" label="viem">

```typescript
import { createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { polygonMumbai } from "viem/chains";
import { createSmartAccountClient } from "@biconomy/account";

// Your configuration with private key and Biconomy API key
const config = {
  privateKey: "your-private-key",
  bundlerUrl: "your-bundler-url", // Replace with the appropriate RPC URL
};

// Generate EOA from private key using ethers.js
const account = privateKeyToAccount("0x" + config.privateKey);
const client = createWalletClient({
  account,
  chain: polygonMumbai,
  transport: http(),
});

// Create Biconomy Smart Account instance
const smartWallet = await createSmartAccountClient({
  signer: client,
  bundlerUrl: config.bundlerUrl,
});

const scwAddress = await smartWallet.getAccountAddress();
console.log("SCW Address", scwAddress);
```

</TabItem>
<TabItem value="ethers" label="ethers">

```typescript
import { ethers } from "ethers";
import { createSmartAccountClient } from "@biconomy/account";

// Your configuration with private key and Biconomy API key
const config = {
  privateKey: "your-private-key",
  bundlerUrl: "your-bundler-url", // Replace with the appropriate RPC URL
  rpcUrl: "rpc-url",
};

// Generate EOA from private key using ethers.js
let provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
let signer = new ethers.Wallet(config.privateKey, provider);

// Create Biconomy Smart Account instance
const smartWallet = await createSmartAccountClient({
  signer,
  bundlerUrl: config.bundlerUrl,
});

const scwAddress = await smartWallet.getAccountAddress();
console.log("SCW Address", scwAddress);
```

</TabItem>
</Tabs>

Get your signer from either ethers.js or viem and create a Biconomy Smart Account instance.

### Step 2: Generate Transaction Data

```typescript
const toAddress = "0xaddress"; // Replace with the recipient's address
const transactionData = "0x123"; // Replace with the actual transaction data

// Build the transactions
const tx = {
  to: toAddress,
  data: transactionData,
};
const txs = [tx, tx]; // Send the tx twice
```

Specify the recipient's address and transaction data to build the simple transaction. For this example we simply copy and paste the same dummy tx but the tx's here can be different.

### Step 3: Send the Transaction and wait for the Transaction Hash

```typescript
// Send the transaction and get the transaction hash
const userOpResponse = await smartWallet.sendTransaction(txs);
const { transactionHash } = await userOpResponse.waitForTxHash();
console.log("Transaction Hash", transactionHash);
```

Send the transaction using the Biconomy Smart Account and get the transaction hash. The transaction will be built into a User Operation and then sent to the Bundler.

That's it! You've successfully sent a simple transaction using ethers.js/viem and the Biconomy Smart Account. Feel free to customize this example based on your specific use case.

```

```
