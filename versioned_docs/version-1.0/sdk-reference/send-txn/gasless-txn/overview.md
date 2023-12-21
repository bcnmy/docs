---
sidebar_position: 1
---

# Overview

> Gasless transactions are supported using Account abstraction Paymasters and Biconomy Paymaster Dashboard for your managed gas tank.

Gasless sponsorships can be managed by passing relevant parameters in the Smart Account custom config.

## Dapp API Key

Please sign up to Biconomy Dashboard to create your dApp, get the API key for it, and set up the Gas Tank to sponsor transactions for your users.

:::note
The dashboard is not live yet and will be launching soon. Meanwhile, to enable Gasless transactions please reach out to us.
:::

:::info
Gasless transactions are currently supported on all the major testnets and selected mainnets.

If you have problems with using the Dashboard and configuring your dApp and Gas Tank, feel free to get in touch with us for spinning up personal test keys and gas tanks on other test networks.
:::

# Link your Custom Paymaster

:::info
You only need to either pass dApp API Key or Custom Paymaster Api in the Smart Account Config (options) -> Network Config
:::

:::info
Custom Paymaster should implement the `IPaymaster` interface to `getPaymasterAndData` for 4337 User Operation.
:::

Here's what configuration initialization looks like to enable gasless transactions through Smart Contract Wallets.

```js
/// only used for creating your custom paymaster
import { IPaymaster, ChainId } from "@biconomy/core-types";

import SmartAccount from "@biconomy/smart-account";
// initialise Smart Account

const { provider, address } = useWeb3AuthContext();
const walletProvider = new ethers.providers.Web3Provider(provider);

// Initialize the Smart Account

export let activeChainId = ChainId.GOERLI;
export const supportedChains = [
  ChainId.GOERLI,
  ChainId.POLYGON_MAINNET,
  ChainId.POLYGON_MUMBAI,
];

let options = {
  activeNetworkId: activeChainId,
  supportedNetworksIds: supportedChains,
  // Network Config.
  // Link Paymaster / DappAPIKey for the chains you'd want to support Gasless transactions on
  networkConfig: [
    {
      chainId: ChainId.GOERLI,
      dappAPIKey: "<DAPP_API_KEY>", // if you are using Biconomy Paymaster configured from a Dashboard
      // customPaymasterAPI: <IPaymaster Instance of your own Paymaster>
    },
  ],
};

let smartAccount = new SmartAccount(walletProvider, options);
smartAccount = await smartAccount.init();
```

:::info
If you have any questions please post them on the [Biconomy SDK Forum](https://forum.biconomy.io/)
:::
