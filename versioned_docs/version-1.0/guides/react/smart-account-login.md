---
sidebar_position: 2
---

# Setting Up Smart Account with Social Login

Next, you will need to connect the provider to the Biconomy Smart Account package. To install the smart account run the following command:

```bash
yarn add @biconomy/smart-account
// or
npm install @biconomy/smart-account
```

:::info
**You'll need a dApp API key to create Smart Accounts for your users.**
You can register your dApp and get an API key for it from the **Biconomy Dashboard.**

If you have problems with using the Dashboard and configuring your dApp and Gas Tank, feel free to get in touch with us for spinning up personal test keys and gas tanks on other test networks.
:::

## Initialize Smart Account

```js
import { ChainId } from "@biconomy/core-types";
import SmartAccount from "@biconomy/smart-account";

// Initialize the Smart Account
// All values are optional except networkConfig only in the case of gasless dappAPIKey is required
let options = {
  activeNetworkId: ChainId.GOERLI,
  supportedNetworksIds: [ChainId.GOERLI, ChainId.POLYGON_MAINNET, ChainId.POLYGON_MUMBAI],
  networkConfig: [
    {
      chainId: ChainId.POLYGON_MUMBAI,
      // Dapp API Key you will get from new Biconomy dashboard that will be live soon
      // Meanwhile you can use the test dapp api key mentioned above
      dappAPIKey: <DAPP_API_KEY>,
      providerUrl: <YOUR_PROVIDER_URL>
    },
    {
      chainId: ChainId.POLYGON_MAINNET,
      // Dapp API Key you will get from new Biconomy dashboard that will be live soon
      // Meanwhile you can use the test dapp api key mentioned above
      dappAPIKey: <DAPP_API_KEY>,
      providerUrl: <YOUR_PROVIDER_URL>
    }
  ]
}

// this provider is from the social login which we created in previous setup
let smartAccount = new SmartAccount(provider, options);
smartAccount = await smartAccount.init();
```

Now using the SDK you can do:

- Gasless Transactions in which dapp sponsors the gas.

:::info
If you have any questions please post them on the [Biconomy SDK Forum](https://forum.biconomy.io/)
:::
