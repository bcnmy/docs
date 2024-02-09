---
sidebar_label: "Viem"
sidebar_position: 2
---

# Create Smart Accounts with Viem

This section shows how to use Viem to create a Smart Account with Biconomy. If you would like to simply see a code implementation, one is available [here](https://github.com/bcnmy/biconomy_viem_example) which showcases how to create a smart account as well as execute a gasless transaction with Viem.

## Dependencies

You will need the following dependencies to create a Smart Account this way:

```bash
yarn add viem @biconomy/account
```

## Imports

```typescript
import { useState } from "react";
import {
  Address,
  createWalletClient,
  custom,
  WalletClient,
  encodeFunctionData,
} from "viem";
import { baseGoerli } from "viem/chains";
import "viem/window";
import { createSmartAccountClient } from "@biconomy/account";
```

## Connect to Users EOA

Let's get connected to the users EOA using Viem so we can prompt the user to sign when needed. In practice you should ensure this is done in an async function, potentially called from the click handler of a button.

```typescript
const connect = async () => {
  if (!window.ethereum) return;
  const [account] = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  const walletClient = createWalletClient({
    account,
    chain: baseGoerli,
    transport: custom(window.ethereum),
  });
};
```

## Create the Biconomy Smart Account

In the previous function we got the wallet Client - this should be saved in some sort of state variable depending on your frontend framework.

```typescript
const createSmartAccount = async (walletClient: WalletClient) => {
  if (!walletClient) return;
  const smartAccount = await createSmartAccountClient({
    signer: walletClient,
    bundlerUrl: "https://docs.biconomy.io/dashboard#bundler-url", // <-- Read about this here
    biconomyPaymasterApiKey: "https://docs.biconomy.io/dashboard/paymaster", // <-- Read about this here
  });

  const address = await biconomySmartAccount.getAccountAddress();
  setSaAddress(address);
  setSmartAccount(biconomySmartAccount);
};
```

You are now ready to get started using viem with Biconomy. For a full code implementation check out [this example repo](https://github.com/bcnmy/biconomy_viem_example).
