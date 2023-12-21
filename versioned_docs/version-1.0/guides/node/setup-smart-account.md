---
sidebar_position: 1
---

# Setting Up Smart Account

The very first step is to set up your smart account and attach a provider to it. You will need to pass the provider into the Biconomy Smart Account package. To install the smart account run the following command:

```bash
yarn add @biconomy/smart-account
// or
npm install @biconomy/smart-account
```

:::note
The dashboard is not live yet and will be launching soon. Meanwhile, to enable Gasless transactions please reach out to us.
:::

:::info
**You'll need a dApp API key to create Smart Accounts for your users.**
You can register your dApp and get an API key for it from the **Biconomy Dashboard.**

If you have problems with using the Dashboard and configuring your dApp and Gas Tank, feel free to get in touch with us for spinning up personal test keys and gas tanks on other test networks.
:::

## Steps to Enable Gasless Transactions

```js
const { ethers } = require("ethers");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const { ChainId } = require("@biconomy/core-types");
const SmartAccount = require("@biconomy/smart-account").default;

const privateKey = "<private_key>";
const rpcUrl = "<rpc_url>";

async function main() {
  let provider = new HDWalletProvider(privateKey, rpcUrl);
  const walletProvider = new ethers.providers.Web3Provider(provider);
  // get EOA address from wallet provider
  const eoa = await walletProvider.getSigner().getAddress();
  console.log(`EOA address: ${eoa}`);

  // get SmartAccount address from wallet provider
  const wallet = new SmartAccount(walletProvider, {
    activeNetworkId: ChainId.GOERLI,
    supportedNetworksIds: [
      ChainId.GOERLI,
      ChainId.POLYGON_MAINNET,
      ChainId.POLYGON_MUMBAI,
    ],
    networkConfig: [
      {
        chainId: ChainId.POLYGON_MUMBAI,
        // Dapp API Key you will get from new Biconomy dashboard that will be live soon
        // Meanwhile you can use the test dapp api key mentioned above
        dappAPIKey: "<DAPP_API_KEY>",
        providerUrl: "<YOUR_PROVIDER_URL>",
      },
      {
        chainId: ChainId.POLYGON_MAINNET,
        // Dapp API Key you will get from new Biconomy dashboard that will be live soon
        // Meanwhile you can use the test dapp api key mentioned above
        dappAPIKey: "<DAPP_API_KEY>",
        providerUrl: "<YOUR_PROVIDER_URL>",
      },
    ],
  });
  const smartAccount = await wallet.init();
  const address = await smartAccount.getSmartAccountState();
  console.log(`SmartAccount address: ${address.address}`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

Now using the SDK you can do:

- Gasless Transactions in which dapp sponsors the gas.

:::info
If you have any questions please post them on the [Biconomy SDK Forum](https://forum.biconomy.io/)
:::
