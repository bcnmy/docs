---
sidebar_label: "Batching Transactions"
sidebar_position: 5
custom_edit_url: https://github.com/bcnmy/docs/blob/master/docs/Account/transactions/batchedtransactions.md
---

# Batching Transactions

This guide is an extension of our Gasless transaction guide with the addition of bundling multiple transactions together, where if a single call in the batch fails, all the calls in the group will be reverted. Check the entire code in the [end](/account/transactions/batchedtransactions#mint-nft-function).


:::info
This guide assumes you have already initialized the Biconomy SDK and just need to understand how to execute a user paid transaction. See our [tutorials](/category/tutorials) for step by step setups.

Before using these code snippets make sure to [set up a paymaster](/dashboard/paymaster) and [register any smart contracts](/dashboard/paymasterPolicies) for sponsorship.
:::


## Imports

These are the imports needed for the code snippets below.

```javascript
import { Hex, createWalletClient, encodeFunctionData, http, parseAbi} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { polygonMumbai } from "viem/chains";
import { createSmartAccountClient, PaymasterMode } from "@biconomy/account";
```

## Create smart account instance

```javascript
const smartAccount = await createSmartAccountClient({
    signer: client,
    bundlerUrl: "BUNDLER_URL",
    biconomyPaymasterApiKey: "PAYMASTER_API_KEY",
  });
const scwAddress = await smartAccount.getAccountAddress();
console.log("SCW Address", scwAddress);
```

## Create Transaction

Create the transaction specifying the required fields such as to, address etc

```javascript
// use the ethers populateTransaction method to create a raw transaction
const nftAddress = "0x1758f42Af7026fBbB559Dc60EcE0De3ef81f665e";
const parsedAbi = parseAbi(["function safeMint(address _to)"]);
const nftData = encodeFunctionData({
  abi: parsedAbi,
  functionName: "safeMint",
  args: [scwAddress as Hex],
});
```

## Send Transaction

Send your transactions to our Bundler which will send the internal userOp batching both the transactions to the entry point contract to handle executing it as a transaction on chain.

We also specify the `paymasterServiceData` with the Paymaster mode set to sponsored while sending the transaction. 

```javascript
const { waitForTxHash } = await smartAccount.sendTransaction(
   [{
      to: nftAddress,
      data: nftData,
    }, {
      to: nftAddress,
      data: nftData,
    }],
    { paymasterServiceData: { mode: PaymasterMode.SPONSORED } }
  );
const { transactionHash } = await waitForTxHash();
console.log("transactionHash", transactionHash);
```

## Mint NFT Function

```javascript

import { Hex, createWalletClient, encodeFunctionData, http, parseAbi} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { polygonMumbai } from "viem/chains";
import { createSmartAccountClient, PaymasterMode } from "@biconomy/account";

export const mintNft = async () => {
  // ----- 1. Generate EOA from private key
  const account = privateKeyToAccount("PRIVATE_KEY);
  const client = createWalletClient({
    account,
    chain: polygonMumbai,
    transport: http(),
  });
  const eoa = client.account.address;
  console.log(`EOA address: ${eoa}`);

  // ------ 2. Create biconomy smart account instance
  const smartAccount = await createSmartAccountClient({
    signer: client,
    bundlerUrl: "BUNDLER_URL",
    biconomyPaymasterApiKey: "PAYMASTER_API_KEY",
  });
  const scwAddress = await smartAccount.getAccountAddress();
  console.log("SCW Address", scwAddress);

  // ------ 3. Generate transaction data
  const nftAddress = "0x1758f42Af7026fBbB559Dc60EcE0De3ef81f665e";
  const parsedAbi = parseAbi(["function safeMint(address _to)"]);
  const nftData = encodeFunctionData({
    abi: parsedAbi,
    functionName: "safeMint",
    args: [scwAddress as Hex],
  });

  // ------ 4. Send transaction
  const { waitForTxHash } = await smartAccount.sendTransaction(
    [{
      to: nftAddress,
      data: nftData,
    }, {
      to: nftAddress,
      data: nftData,
    }],
    { paymasterServiceData: { mode: PaymasterMode.SPONSORED } }
  );
  const { transactionHash } = await waitForTxHash();
  console.log("transactionHash", transactionHash);
};


```
